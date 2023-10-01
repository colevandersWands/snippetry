import { REPO, SEPARATOR, HREF } from './src/CONSTANTS.js';
import { state } from './src/state.js';

import { copyCode, filterList, runCode } from './src/utils/index.js';

import { CodeJar } from './lib/codejar.min.js';

// ----- (re)render snippets -----

const renderCode = (snippet) => {
  const containerHighlight = document.createElement('div');
  containerHighlight.innerHTML = `<pre class="editor language-${
    snippet.name.includes('.txt')
      ? 'txt'
      : snippet.name.endsWith('js')
      ? 'js'
      : snippet.name.endsWith('html') ||
        snippet.name.endsWith('htm') ||
        snippet.name.endsWith('svg')
      ? 'html'
      : snippet.name.endsWith('css')
      ? 'css'
      : snippet.name.endsWith('json')
      ? 'json'
      : 'txt'
  }"><code></code></pre>`;
  containerHighlight.firstChild.firstChild.textContent = snippet.code;

  Prism.highlightElement(containerHighlight.firstChild);

  return { containerHighlight };
};

const renderSnippet = (snippet) => {
  snippet.root = document.createElement('div');
  snippet.root.className = 'a-snippet';
  snippet.root.innerHTML = `
<div class="snippet-header">
  <h2 id="${snippet.name}">${snippet.name}</h2>
  <div class="down">
    <span class="danger-zone hidden">
      ${
        snippet.name.endsWith('js')
          ? `<button class='runner'>run</button>
      <button class='debugger'>debug</button>
      |`
          : snippet.name.endsWith('html') || snippet.name.endsWith('htm')
          ? `<button class='tabber'>new tab</button>
      |`
          : snippet.name.endsWith('css')
          ? `<button class='styler'>apply style</button>
          <button class='new-tab-css'>new tab</button>
      |`
          : snippet.name.endsWith('svg')
          ? `<button class='set-background'>set background</button>
          <button class='set-icon'>set icon</button>
          <button class='new-tab-svg'>new tab</button>
      |`
          : snippet.name.endsWith('json')
          ? `<button class='log-json'>log</button>
      |`
          : `<button class='logger'>log</button>
      <button class='alerter'>alert</button>
      <button class='tabby'>new tab</button>
      |`
      }
    </span>
    <button class='editoringer'>edit</button>
    <button class='copier'>copy</button>${
      snippet.noLinks
        ? ''
        : `
    |
    <button class='linker'>link</button>
    <button class='githubber'>source</button>`
    }
  </div>
</div>`;

  Object.assign(
    snippet,
    {
      visible(display = true) {
        if (display) {
          snippet.root.style.display = 'block';
        } else {
          snippet.root.style.display = 'none';
        }
      },
    },
    renderCode(snippet),
  );

  snippet.root.appendChild(snippet.containerHighlight);
};

const filterSnippets = () => {
  const ignoreTags = state.tags.every((tag) => !tag.selected);

  for (const snippet of state.snippets) {
    const tagsAreSelected =
      ignoreTags ||
      state.tags
        .filter((tag) => tag.selected)
        .every((tag) => snippet.tags.includes(tag.value));

    if (
      tagsAreSelected &&
      (snippet.code.toLowerCase().includes(state.query.toLowerCase()) ||
        snippet.name.toLowerCase().includes(state.query.toLowerCase()))
    ) {
      snippet.visible(true);
    } else {
      snippet.visible(false);
    }
  }

  // update URL
  const tagsParam = encodeURI(
    state.tags
      .filter((tag) => tag.selected)
      .map((tag) => tag.value)
      .join(','),
  );
  const queryParam = encodeURI(state.query);

  const params = `query=${queryParam}&tags=${tagsParam}&danger=${
    state.liveDangerously ? 'yes' : 'no'
  }`;

  window.history.replaceState({}, '', `${HREF.origin + HREF.pathname}?${params}`);
};

// https://medv.io/codejar/
const highlight = (editor) => {
  // highlight.js does not trims old tags,
  // let's do it by this hack.
  editor.textContent = editor.textContent;
  Prism.highlightElement(editor);
};

const replaceWithEditor = (snippet) => {
  snippet.originalCode = snippet.code;

  snippet.containerEditor = document.createElement('pre');
  if (snippet.name.endsWith('js')) {
    snippet.containerEditor.className = `editor language-${
      snippet.name.includes('.txt') ? 'txt' : 'js'
    }`;
    snippet.jar = CodeJar(snippet.containerEditor, highlight, {
      tab: '\t',
      indentOn: /[(\[\{]$/,
    });
  } else if (snippet.name.includes('.txt')) {
    snippet.containerEditor.className = 'editor language-text';
    snippet.jar = CodeJar(snippet.containerEditor, () => {}, {
      tab: '\t',
    });
  } else if (
    snippet.name.endsWith('.html') ||
    snippet.name.endsWith('.htm') ||
    snippet.name.endsWith('.svg')
  ) {
    snippet.containerEditor.className = 'editor language-html';
    snippet.jar = CodeJar(snippet.containerEditor, highlight, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.css')) {
    snippet.containerEditor.className = 'editor language-css';
    snippet.jar = CodeJar(snippet.containerEditor, highlight, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.json')) {
    snippet.containerEditor.className = 'editor language-js';
    snippet.jar = CodeJar(snippet.containerEditor, highlight, {
      tab: '\t',
    });
  } else {
    snippet.containerEditor.className = 'editor language-text';
    snippet.jar = CodeJar(snippet.containerEditor, () => {}, {
      tab: '\t',
    });
  }
  snippet.jar.updateCode(snippet.originalCode);

  Object.defineProperty(snippet, 'code', {
    get() {
      return snippet.jar.toString();
    },
  });

  snippet.root.replaceChild(snippet.containerEditor, snippet.containerHighlight);
};

const newTabHTML = (snippet) => {
  console.log(`\n========== ${snippet.name} ==========\n`);

  const evaller = document.createElement('iframe');
  evaller.style = 'border: none; height: 100vh; width: 100vw;';
  evaller.src = './snippets/html.sandbox.txt';
  evaller.onload = () => {
    evaller.contentDocument.body.innerHTML = '';
    evaller.contentDocument.body.style = evaller.style =
      'border: none; height: 100vh; width: 100vw;';

    const container = document.createElement('div');
    container.innerHTML = snippet.code;
    Array.from(container.children).forEach((el) => {
      if (el.nodeName === 'SCRIPT') {
        const script = document.createElement('script');
        Array.from(el.attributes).forEach((attribute) => {
          script.setAttribute(attribute.name, attribute.value);
        });
        script.appendChild(document.createTextNode(el.innerHTML));
        evaller.contentDocument.body.appendChild(script);
      } else {
        evaller.contentDocument.body.appendChild(el);
      }
    });

    evaller.contentDocument.dispatchEvent(new Event('resize'));
  };

  const x = window.open();
  x.document.open();
  x.document.appendChild(evaller);
  x.document.close();
};

const dangerZones = document.getElementsByClassName('danger-zone');
const toggleDanger = (e) => {
  const params = new URLSearchParams(HREF.search);
  if (e.target.checked) {
    for (const zone of dangerZones) {
      zone.classList.remove('hidden');
    }
    params.set('danger', 'yes');
  } else {
    for (const zone of dangerZones) {
      zone.classList.add('hidden');
    }
    params.set('danger', 'no');
  }
  window.history.replaceState(
    {},
    '',
    `${HREF.origin + HREF.pathname}?${params.toString()}`,
  );
  state.liveDangerously = !state.liveDangerously;
};

// ----- initialize UI -----

const dangerZone = document.getElementById('danger-zone');
dangerZone.addEventListener('input', toggleDanger);
if (state.liveDangerously) {
  dangerZone.checked = true;
  setTimeout(() => toggleDanger({ target: { checked: true } }));
}

document.getElementById('search-field').value = state.query;

document.getElementById('tags').appendChild(filterList(state.tags, 'tags'));

const emptySnippets = [];
const snippetsToRender = state.snippets
  .filter((snippet) => {
    if (snippet.name[0] === '.') {
      snippet.noLinks = true;
      renderSnippet(snippet);
      emptySnippets.push(snippet);
      return false;
    } else {
      return true;
    }
  })
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

const postableSnips = [...state.snips];

const snippetsRoot = document.getElementById('snippets');
snippetsRoot.appendChild(
  emptySnippets[Math.floor(Math.random() * emptySnippets.length)].root,
);

for (const snippet of snippetsToRender) {
  renderSnippet(snippet);
  snippetsRoot.appendChild(snippet.root);
  if (postableSnips.length > 0 && Math.random() < 0.05) {
    const snip = postableSnips[Math.floor(Math.random() * postableSnips.length)];
    postableSnips.splice(postableSnips.indexOf(snip), 1);

    const snipEl = document.createElement('textarea');
    snipEl.style = 'border: none; resize: none; overflow: hidden;';
    snipEl.value = snip;
    snipEl.rows = snip.split('\n').length;
    snipEl.cols = snip
      .split('\n')
      .reduce((a, b) => (a.length < b.length ? b : a), '').length;

    const snipWrapper = document.createElement('pre');
    snipWrapper.appendChild(snipEl);
    snippetsRoot.appendChild(snipWrapper);
  }
}

for (const snippet of state.snippets) {
  if (snippet.name.endsWith('js')) {
    snippet.root
      .getElementsByClassName('runner')[0]
      .addEventListener('click', function run() {
        runCode(snippet);
      });
    snippet.root
      .getElementsByClassName('debugger')[0]
      .addEventListener('click', function debug() {
        runCode(snippet, true);
      });
  } else if (snippet.name.includes('.htm')) {
    snippet.root
      .getElementsByClassName('tabber')[0]
      .addEventListener('click', () => newTabHTML(snippet));
  } else if (snippet.name.endsWith('css')) {
    const snippetStyle = document.createElement('style');
    let isApplied = false;
    snippet.root.getElementsByClassName('styler')[0].addEventListener('click', (e) => {
      console.log(`\n========== ${snippet.name} ==========\n`);
      // apply to body to override other styles
      if (isApplied) {
        document.body.removeChild(snippetStyle);
        isApplied = false;
      }

      if (e.target.innerText.includes('apply')) {
        snippetStyle.innerHTML = snippet.code;
        document.body.appendChild(snippetStyle);
        e.target.innerText = 'remove style';
        isApplied = true;
      } else {
        e.target.innerText = 'apply style';
      }
    });
    snippet.root
      .getElementsByClassName('new-tab-css')[0]
      .addEventListener('click', () => {
        console.log(`\n========== ${snippet.name} ==========\n`);
        const x = window.open();
        x.document.open();
        x.document.write(`<style>${snippet.code}</style>`);
        x.document.close();
      });
  } else if (snippet.name.endsWith('svg')) {
    let isBackground = false;
    snippet.root
      .getElementsByClassName('set-background')[0]
      .addEventListener('click', (e) => {
        console.log(`\n========== ${snippet.name} ==========\n`);
        if (isBackground) {
          document.body.style.backgroundImage = '';
          isBackground = false;
        }

        if (e.target.innerText.includes('set')) {
          document.body.style.backgroundImage = `url("data:image/svg+xml,${encodeURI(
            snippet.code,
          )}")`;
          e.target.innerText = 'remove background';
          isBackground = true;
        } else {
          e.target.innerText = 'set background';
        }
      });
    let isIcon = false;
    const iconEl = document.getElementById('icon');
    snippet.root.getElementsByClassName('set-icon')[0].addEventListener('click', (e) => {
      console.log(`\n========== ${snippet.name} ==========\n`);

      if (isIcon) {
        iconEl.href = './public/favicon.ico';
        isIcon = false;
      }

      if (e.target.innerText.includes('set')) {
        iconEl.href = `data:image/svg+xml,${encodeURI(snippet.code)}`;
        e.target.innerText = 'remove icon';
        isIcon = true;
      } else {
        e.target.innerText = 'set icon';
      }
    });
    snippet.root
      .getElementsByClassName('new-tab-svg')[0]
      .addEventListener('click', () => {
        console.log(`\n========== ${snippet.name} ==========\n`);
        const x = window.open();
        x.document.open();
        x.document.write(snippet.code);
        x.document.close();
      });
  } else if (snippet.name.endsWith('txt')) {
    snippet.root
      .getElementsByClassName('logger')[0]
      .addEventListener('click', () => console.log(snippet.code));
    snippet.root
      .getElementsByClassName('alerter')[0]
      .addEventListener('click', () => alert(snippet.code));
    snippet.root.getElementsByClassName('tabby')[0].addEventListener('click', () => {
      const x = window.open();
      x.document.open();
      x.document.write(`<pre>${snippet.code}</pre>`);
      x.document.close();
    });
  } else if (snippet.name.endsWith('json')) {
    snippet.root
      .getElementsByClassName('log-json')[0]
      .addEventListener('click', () => console.log(JSON.parse(snippet.code)));
  }

  snippet.root
    .getElementsByClassName('copier')[0]
    .addEventListener('click', () =>
      copyCode(snippet.code, `${snippet.name} ->  snippet is copied`),
    );

  snippet.root.getElementsByClassName('linker')[0]?.addEventListener('click', () => {
    const url = `${window.location.origin}/${window.location.pathname}?query=${
      snippet.name
    }&danger=${state.liveDangerously ? 'yes' : 'no'}`;
    copyCode(url, `${url} ->  URL is copied`);
  });

  snippet.root
    .getElementsByClassName('githubber')[0]
    ?.addEventListener('click', () =>
      window.open(`${REPO}/tree/main/snippets/${snippet.name}`, '_blank'),
    );

  let editable = false;
  snippet.root.getElementsByClassName('editoringer')[0].addEventListener('click', (e) => {
    if (editable) {
      snippet.jar.updateCode(snippet.originalCode);
    } else {
      editable = true;
      e.target.innerText = 'reset';
      replaceWithEditor(snippet);
    }
  });
}

document.getElementById('tags').addEventListener('change', (e) => {
  const [key, value] = e.target.id.split(SEPARATOR);

  const tag = state[key].find((entry) => entry.value === value);
  tag.selected = e.target.checked;

  filterSnippets();
});

document.getElementById('search-field').addEventListener('input', (e) => {
  state.query = e.target.value;

  filterSnippets();
});

filterSnippets();

// --- MDN Potluck ---

const docSearchQueries = Reflect.ownKeys(window);
document
  .getElementById('mdn-potluck')
  .addEventListener('click', function randomMDNPotluck(e) {
    e.preventDefault();
    const randomDocsQuery =
      docSearchQueries[Math.floor(Math.random() * docSearchQueries.length)];
    window.open(
      `https://developer.mozilla.org/en-US/search?q=${randomDocsQuery}`,
      '_blank',
    );
  });
