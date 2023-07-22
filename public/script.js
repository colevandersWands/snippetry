import { CodeJar } from './lib/codejar.min.js';

// ----- console greeting -----

console.log(`
Welcome to Snippetry!

You're in the right place.

`);

// ----- constants -----

const REPO = 'https://github.com/colevandersWands/snippetry';

const SEPARATOR = '-=-=-=-';

// ----- initialize state -----

const href = new URL(window.location.href);

const state = await fetch('./public/snippets.json').then((res) => res.json());

// initialize tags
const persistedTagsEncoded = href.searchParams.get('tags');
const persistedTags = persistedTagsEncoded
  ? decodeURI(persistedTagsEncoded)
      .split(',')
      .filter((persistedTag) => state.tags.includes(persistedTag))
  : '';
state.tags = state.tags.map((tag) => ({
  value: tag,
  selected: persistedTags.includes(tag) ? true : false,
}));

// initialize query
const persistedQueryEncoded = href.searchParams.get('query');
state.query = persistedQueryEncoded ? decodeURI(persistedQueryEncoded) : '';

// initialize dangerous life
state.liveDangerously =
  !href.searchParams.has('danger') || href.searchParams.get('danger') !== 'yes'
    ? false
    : true;

// ----- utilities -----

const filterList = (entries, key) => {
  const entryContainer = document.createElement('ul');
  for (const entry of entries) {
    const id = key + SEPARATOR + entry.value;
    const entryLi = document.createElement('span');
    entryLi.innerHTML = `<input id="${id}" type="checkbox" ${
      entry.selected ? 'checked' : ''
    }/><label for="${id}">${entry.value}  </label>`;
    entryContainer.appendChild(entryLi);
  }
  return entryContainer;
};

const assert = (assertion, ...messages) => {
  if (assertion) {
    console.groupCollapsed(
      '%c√ YES ',
      'font-weight: bold; color: green;',
      ...messages,
    );
  } else {
    console.groupCollapsed(
      '%c✖ NO ',
      'font-weight: bold; color: red;',
      ...messages,
    );
  }
  console.trace();
  console.groupEnd();
};

let firstRun = true;
const runCode = (snippet = {}, debug = false) => {
  if (firstRun) {
    alert(
      "open your dev console to see the program's logs \n(if you're using a desktop)",
    );
    firstRun = false;
  }

  console.log(`\n========== ${snippet.name} ==========\n`);

  const evaller = document.createElement('iframe');
  evaller.style.display = 'none';
  evaller.id = Math.random();
  evaller.src = `./snippets/${snippet.name}`;

  const finalCode = debug
    ? '/* ------------------------ */ debugger;\n\n\n\n\n' +
      snippet.code +
      '\n\n\n\n\n/* ------------------------ */ debugger;'
    : snippet.code;

  evaller.onload = () => {
    evaller.contentWindow.console.assert = assert;

    const script = document.createElement('script');
    if (snippet.name.endsWith('.mjs')) {
      script.type = 'module';
    }
    script.innerHTML = finalCode;

    evaller.contentDocument.body.appendChild(script);
  };

  snippet.root.appendChild(evaller);
};

const copyCode = (code, message = 'copied!') => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(code);
    return;
  }
  navigator.clipboard.writeText(code).then(
    function () {
      // console.log('Async: Copying to clipboard was successful!');
      alert(message);
    },
    function (err) {
      // console.error('Async: Could not copy text: ', err);
      fallbackCopyTextToClipboard(code);
    },
  );

  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      alert(successful ? message : "nope, couldn't copy the link.\ntry again");
    } catch (err) {
      alert("nope, couldn't copy the link.\ntry again");
    }

    document.body.removeChild(textArea);
    window.scrollTo(0, 0);
  }
};

// ----- (re)render snippets -----

const renderCode = (snippet) => {
  const containerHighlight = document.createElement('div');
  containerHighlight.innerHTML = `<pre class="editor language-${
    snippet.name.endsWith('js')
      ? 'js'
      : snippet.name.endsWith('html')
      ? 'html'
      : snippet.name.endsWith('html')
      ? 'css'
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
          : snippet.name.endsWith('html')
          ? `<button class='tabber'>open tab</button>
      |`
          : snippet.name.endsWith('css')
          ? `<button class='styler'>apply style</button>
      |`
          : `<button class='logger'>log</button>
      <button class='alerter'>alert</button>
      <button class='tabby'>new tab</button>
      |`
      }
    </span>
    <button class='editoringer'>edit</button>
    <button class='copier'>copy</button>
    |
    <button class='linker'>link</button>
    <button class='githubber'>source</button>
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

  window.history.replaceState(
    {},
    '',
    `${href.origin + href.pathname}?${params}`,
  );
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
    snippet.containerEditor.className = 'editor language-js';
    snippet.jar = CodeJar(snippet.containerEditor, highlight, {
      tab: '\t',
      indentOn: /[(\[\{]$/,
    });
  } else if (snippet.name.endsWith('.html')) {
    snippet.containerEditor.className = 'editor language-html';
    snippet.jar = CodeJar(snippet.containerEditor, highlight, {
      tab: '\t',
    });
  } else if (snippet.name.endsWith('.css')) {
    snippet.containerEditor.className = 'editor language-css';
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

  snippet.root.replaceChild(
    snippet.containerEditor,
    snippet.containerHighlight,
  );
};

const newTabHTML = (snippet) => {
  console.log(`\n========== ${snippet.name} ==========\n`);

  const evaller = document.createElement('iframe');
  evaller.style = 'border: none; height: 100vh; width: 100vw;';
  evaller.src = './snippets/html-sandbox.txt';
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
  const params = new URLSearchParams(href.search);
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
    `${href.origin + href.pathname}?${params.toString()}`,
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

const snippetsRoot = document.getElementById('snippets');

for (const snippet of state.snippets) {
  renderSnippet(snippet);
  snippetsRoot.appendChild(snippet.root);
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
  } else if (snippet.name.endsWith('html')) {
    snippet.root
      .getElementsByClassName('tabber')[0]
      .addEventListener('click', () => newTabHTML(snippet));
  } else if (snippet.name.endsWith('css')) {
    const snippetStyle = document.createElement('style');
    let isApplied = false;
    snippet.root
      .getElementsByClassName('styler')[0]
      .addEventListener('click', (e) => {
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
  } else if (snippet.name.endsWith('txt')) {
    snippet.root
      .getElementsByClassName('logger')[0]
      .addEventListener('click', () => console.log(snippet.code));
    snippet.root
      .getElementsByClassName('alerter')[0]
      .addEventListener('click', () => alert(snippet.code));
    snippet.root
      .getElementsByClassName('tabby')[0]
      .addEventListener('click', () => {
        const x = window.open();
        x.document.open();
        x.document.write(`<pre>${snippet.code}</pre>`);
        x.document.close();
      });
  }

  snippet.root
    .getElementsByClassName('copier')[0]
    .addEventListener('click', () =>
      copyCode(snippet.code, `${snippet.name} ->  snippet is copied`),
    );

  snippet.root
    .getElementsByClassName('linker')[0]
    .addEventListener('click', () => {
      const url = `${window.location.origin}/${
        window.location.pathname
      }?query=${snippet.name}&danger=${state.liveDangerously ? 'yes' : 'no'}`;
      copyCode(url, `${url} ->  URL is copied`);
    });

  snippet.root
    .getElementsByClassName('githubber')[0]
    .addEventListener('click', () =>
      window.open(`${REPO}/tree/main/snippets/${snippet.name}`, '_blank'),
    );

  let editable = false;
  snippet.root
    .getElementsByClassName('editoringer')[0]
    .addEventListener('click', (e) => {
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
