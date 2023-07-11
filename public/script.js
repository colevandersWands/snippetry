import { CodeJar } from './lib/codejar.min.js';

// ----- console greeting -----

console.log(`
Welcome to Snippetry!

You're in the right place : )

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
    console.log('%c√ YES ', 'font-weight: bold; color: green;', ...messages);
  } else {
    console.log('%c✖ NO ', 'font-weight: bold; color: red;', ...messages);
  }
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

  // conditionally open iframe in new tab based on option
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
      : 'css'
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
          : `<button class='styler'>apply styles</button>
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

  const params = `query=${queryParam}&tags=${tagsParam}`;

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
  const x = window.open();
  x.document.open();
  x.document.write(snippet.code);
  x.document.close();
};

// ----- initialize UI -----

document.getElementById('danger-zone').addEventListener('input', (e) => {
  for (const zone of document.getElementsByClassName('danger-zone')) {
    if (e.target.checked) {
      zone.classList.remove('hidden');
    } else {
      zone.classList.add('hidden');
    }
  }
});

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
      .addEventListener('click', () => runCode(snippet));
    snippet.root
      .getElementsByClassName('debugger')[0]
      .addEventListener('click', () => runCode(snippet, true));
  } else if (snippet.name.endsWith('html')) {
    snippet.root
      .getElementsByClassName('tabber')[0]
      .addEventListener('click', () => newTabHTML(snippet));
  } else {
    const snippetStyle = document.createElement('style');
    snippet.root
      .getElementsByClassName('styler')[0]
      .addEventListener('click', (e) => {
        if (e.target.innerText.includes('apply')) {
          snippetStyle.innerHTML = snippet.code;
          document.head.appendChild(snippetStyle);
          e.target.innerText = 'remove styles';
        } else {
          document.head.removeChild(snippetStyle);
          e.target.innerText = 'apply styles';
        }
      });
  }

  snippet.root
    .getElementsByClassName('copier')[0]
    .addEventListener('click', () =>
      copyCode(snippet.code, `${snippet.name} ->  snippet is copied`),
    );

  snippet.root
    .getElementsByClassName('linker')[0]
    .addEventListener('click', () =>
      copyCode(
        `${window.location.origin}/${window.location.pathname}?query=${snippet.name}`,
        `${snippet.name} ->  URL is copied`,
      ),
    );

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
