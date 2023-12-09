import './lib/marked.min.js';
import { CodeJar } from './lib/codejar.min.js';
import { evaluate } from './lib/scheme-dot-json/index.js';
import { simplit } from './lib/simplit.mjs';

import { REPO, SEPARATOR, HREF } from './src/CONSTANTS.js';
import { state } from './src/state.js';

import {
  copyCode,
  filterList,
  newTabHTML,
  runCode,
  renderMarkdown,
} from './src/utils/index.js';

let counted = 0;
const counterval = setInterval(function countingSnippets() {
  document.title = 'Snippetry #' + counted;
  if (++counted > state.snippets.length) clearInterval(counterval);
}, 1000);

// ----- (re)render snippets -----

const renderCode = (snippet) => {
  if (snippet.name.endsWith('.md')) {
    const container = document.createElement('div');
    container.setAttribute('target', '_blank');
    container.innerHTML = renderMarkdown(snippet.code);

    for (const link of container.getElementsByTagName('a')) {
      link.target = '_blank';
    }

    Prism.highlightAllUnder(container);

    return { containerHighlight: container };
  }

  const containerHighlight = document.createElement('div');
  containerHighlight.innerHTML = `<pre class="editor"><code class="language-${
    snippet.name.includes('.txt')
      ? 'txt'
      : snippet.name.endsWith('scm.js')
      ? 'js rainbow-braces'
      : snippet.name.endsWith('js')
      ? 'js'
      : snippet.name.endsWith('html') ||
        snippet.name.endsWith('htm') ||
        snippet.name.endsWith('svg')
      ? 'html'
      : snippet.name.endsWith('css')
      ? 'css'
      : snippet.name.endsWith('scm.json')
      ? 'scmjson rainbow-braces'
      : snippet.name.endsWith('json')
      ? 'json'
      : snippet.name.endsWith('yaml')
      ? 'yaml'
      : snippet.name.endsWith('py')
      ? 'python'
      : snippet.name.endsWith('md')
      ? 'markdown'
      : snippet.name.endsWith('psu')
      ? 'psu'
      : snippet.name.endsWith('.sh')
      ? 'bash'
      : 'txt'
  } match-braces"></code></pre>`;

  containerHighlight.firstChild.firstChild.textContent = snippet.code;

  Prism.highlightElement(containerHighlight.firstChild.firstChild);

  return { containerHighlight };
};

const renderSnippet = (snippet, delay = 0) => {
  snippet.root = document.createElement('div');
  Object.assign(snippet, {
    visible(display = true) {
      if (display) {
        snippet.root.style.display = 'block';
      } else {
        snippet.root.style.display = 'none';
      }
    },
  });

  setTimeout(function lazyRender() {
    snippet.root.className = 'a-snippet';
    snippet.root.innerHTML = `
<div class="snippet-header">
  <h2 id="${snippet.name}">${snippet.name}</h2>
  <div class="down">
    <span class="danger-zone ${state.liveDangerously ? '' : 'hidden'}">
      ${
        snippet.name.endsWith('js') || snippet.name.endsWith('psu')
          ? `<button class='runner'>run</button>
      <button class='debugger'>debug</button>
      |`
          : snippet.name.endsWith('.js.md') || snippet.name.endsWith('.mjs.md')
          ? `<button class='simplit-runner'>run</button>
          <button class='simplit-debugger'>debug</button>
          <button class='new-tab-md'>new tab</button>
      |`
          : snippet.name.endsWith('.md')
          ? `<button class='new-tab-md'>new tab</button>
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
          ? `${
              snippet.name.endsWith('scm.json')
                ? '<button class="run-json">run</button> '
                : ''
            }<button class='log-json'>log</button>
      |`
          : snippet.name.endsWith('txt')
          ? `<button class='logger'>log</button>
      <button class='alerter'>alert</button>
      <button class='tabby'>new tab</button>
      |`
          : ''
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

    Object.assign(snippet, renderCode(snippet));

    snippet.root.appendChild(snippet.containerHighlight);

    if (snippet.name.endsWith('psu')) {
      snippet.root
        .getElementsByClassName('runner')[0]
        .addEventListener('click', function run() {
          eval(snippet.code);
        });
      snippet.root
        .getElementsByClassName('debugger')[0]
        .addEventListener('click', function debug() {
          eval(`debugger;\n\n${snippet.code}\n\ndebugger;`);
        });
    } else if (snippet.name.endsWith('js')) {
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
    } else if (snippet.name.endsWith('.md')) {
      snippet.root
        .getElementsByClassName('new-tab-md')[0]
        .addEventListener('click', () => {
          const code = `
      <link rel="stylesheet" href="../public/lib/prism.min.css" />

      ${renderMarkdown(snippet.code)}
      
      <script src="../public/lib/prism.min.js"></script>
      `;

          newTabHTML({ ...snippet, code });
        });

      if (snippet.name.includes('.js') || snippet.name.includes('.mjs')) {
        snippet.root
          .getElementsByClassName('simplit-runner')[0]
          .addEventListener('click', async function run() {
            runCode({ ...snippet, code: simplit(snippet.code) });
          });
        snippet.root
          .getElementsByClassName('simplit-debugger')[0]
          .addEventListener('click', async function debug() {
            runCode({ ...snippet, code: simplit(snippet.code) }, true);
          });
      }
    } else if (snippet.name.includes('.htm')) {
      snippet.root
        .getElementsByClassName('tabber')[0]
        .addEventListener('click', () => newTabHTML(snippet));
    } else if (snippet.name.includes('.md')) {
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
      snippet.root
        .getElementsByClassName('set-icon')[0]
        .addEventListener('click', (e) => {
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
      if (snippet.name.endsWith('scm.json')) {
        snippet.root
          .getElementsByClassName('run-json')[0]
          .addEventListener('click', () => evaluate(JSON.parse(snippet.code)));
      }
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
    snippet.root
      .getElementsByClassName('editoringer')[0]
      .addEventListener('click', (e) => {
        // why no highlight for language-bash?
        if (editable) {
          snippet.jar.updateCode(snippet.originalCode);
        } else {
          editable = true;
          e.target.innerText = 'reset';
          replaceWithEditor(snippet);
        }
      });
  }, delay);
};

const snips = document.getElementsByClassName('snip');
const filterSnippets = () => {
  const ignoreTags = state.tags.every((tag) => !tag.selected);

  if (!ignoreTags || state.query !== '') {
    for (const snip of snips) snip.style.display = 'none';
  } else {
    for (const snip of snips) snip.style.display = 'block';
  }

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
  console.log(editor);
  editor.textContent = editor.textContent;
  Prism.highlightElement(editor);
};

const replaceWithEditor = (snippet) => {
  snippet.originalCode = snippet.code;

  snippet.containerEditor = document.createElement('pre');
  snippet.containerEditor.appendChild(document.createElement('code'));

  if (snippet.name.endsWith('js')) {
    snippet.containerEditor.className = `editor match-braces language-${
      snippet.name.includes('.txt') ? 'txt' : 'js'
    }`;
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, highlight, {
      tab: '\t',
      indentOn: /[(\[\{]$/,
    });
  } else if (snippet.name.includes('.txt')) {
    snippet.containerEditor.className = 'editor match-braces language-text';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, () => {}, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.sh')) {
    // why no highlight for language-bash?
    snippet.containerEditor.className = 'editor match-braces language-bash';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, () => {}, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.psu')) {
    snippet.containerEditor.className = 'editor match-braces language-psu';
    snippet.containerEditor.firstChild.className += ' language-psu';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, () => {}, {
      tab: '\t',
    });
  } else if (
    snippet.name.endsWith('.html') ||
    snippet.name.endsWith('.htm') ||
    snippet.name.endsWith('.svg')
  ) {
    snippet.containerEditor.className = 'editor match-braces language-html';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, highlight, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.css')) {
    snippet.containerEditor.className = 'editor match-braces language-css';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, highlight, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.scm.json')) {
    snippet.containerEditor.className = 'editor language-scmjson match-braces';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, highlight, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.json')) {
    snippet.containerEditor.className = 'editor language-json match-braces';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, highlight, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.yaml')) {
    snippet.containerEditor.className = 'editor match-braces language-yaml';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, highlight, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.py')) {
    snippet.containerEditor.className = 'editor match-braces language-python';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, highlight, {
      tab: 's',
    });
  } else if (snippet.name.endsWith('.md')) {
    snippet.containerEditor.className = 'editor match-braces language-markdown';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, highlight, {
      tab: '\t',
    });

    snippet.jar.onUpdate((markdown = '') => {
      snippet.containerHighlight.innerHTML = renderMarkdown(markdown);
      Prism.highlightAllUnder(snippet.containerHighlight);
    });
  } else {
    snippet.containerEditor.className = 'editor match-braces language-text';
    snippet.jar = CodeJar(snippet.containerEditor.firstChild, () => {}, {
      tab: '\t',
    });
  }

  if (snippet.name.includes('.scm')) {
    snippet.containerEditor.className += 'rainbow-braces';
  }

  snippet.jar.updateCode(snippet.originalCode);

  Object.defineProperty(snippet, 'code', {
    get() {
      return snippet.jar.toString();
    },
  });

  snippet.root.replaceChild(snippet.containerEditor, snippet.containerHighlight);

  if (snippet.name.endsWith('.md')) {
    snippet.root.appendChild(snippet.containerHighlight);
  }
};

const dangerZones = document.getElementsByClassName('danger-zone');

const toggleDanger = (e) => {
  const params = new URLSearchParams(HREF.search);
  if (e.target.checked) {
    for (const zone of dangerZones) {
      zone.classList.remove('hidden');
    }
    params.set('danger', 'yes');
    state.liveDangerously = true;
  } else {
    for (const zone of dangerZones) {
      zone.classList.add('hidden');
    }
    params.set('danger', 'no');
    state.liveDangerously = false;
  }

  window.history.replaceState(
    {},
    '',
    `${HREF.origin + HREF.pathname}?${params.toString()}`,
  );
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
      renderSnippet(snippet, 0);
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
  renderSnippet(snippet, snippetsToRender.indexOf(snippet) * 2);
  snippetsRoot.appendChild(snippet.root);

  if (postableSnips.length > 0 && Math.random() < 0.1) {
    const snip = postableSnips[Math.floor(Math.random() * postableSnips.length)];
    postableSnips.splice(postableSnips.indexOf(snip), 1);

    const snipEl = document.createElement('TEXTAREA');
    snipEl.style = 'border: none; resize: none; overflow: hidden;';
    snipEl.value = snip;
    snipEl.rows = snip.split('\n').length;
    snipEl.cols = snip
      .split('\n')
      .reduce((a, b) => (a.length < b.length ? b : a), '').length;

    const snipWrapper = document.createElement('PRE');
    snipWrapper.className = 'snip';
    snipWrapper.appendChild(snipEl);
    snippetsRoot.appendChild(snipWrapper);
  }
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

const deepKeys = (obj = {}, keys = new Set()) => {
  for (const [key, value] of Object.entries(obj)) {
    if (keys.has(key)) {
      continue;
    }

    keys.add(key);

    if (Object(value) === value) {
      keys.add(...deepKeys(value, keys));
    }
  }

  return Array.from(keys);
};

const docSearchQueries = deepKeys(globalThis);

document.getElementById('mdn-potluck').addEventListener('click', function MDNPotluck(e) {
  e.preventDefault();

  const randomDocsQuery =
    docSearchQueries[Math.floor(Math.random() * docSearchQueries.length)];

  window.open(
    `https://developer.mozilla.org/en-US/search?q=${randomDocsQuery}`,
    '_blank',
  );
});
