import hljs from './lib/highlight.min.js';
hljs.configure({ ignoreUnescapedHTML: true });

// ----- console greeting -----

console.log(`
Welcome to Snippetry!

You're in the right place : )

`);

// ----- initialize state -----

const state = await fetch('./public/snippets.json')
  .then((res) => res.json())
  .then((preState) => ({
    ...preState,
    tags: preState.tags.map((tag) => ({ value: tag, selected: false })),
    repo: 'https://githhub.com/colevandersWands/snippetry',
  }));

// ----- constants -----

const SEPARATOR = '-=-=-=-';

// ----- utilities -----

const filterList = (entries, key, checked = true) => {
  const entryContainer = document.createElement('ul');
  for (const entry of entries) {
    const id = key + SEPARATOR + entry.value;
    const entryLi = document.createElement('span');
    entryLi.innerHTML = `<input id="${id}" type="checkbox" ${
      checked ? 'checked' : ''
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

// ++ moved
//  alert on first run to check the console
//  overwrite console.assert for prettier assertions
const runCode = (snippet = {}, debug = false) => {
  console.log(`\n========== ${snippet.name} ==========\n`);

  const evaller = document.createElement('iframe');
  evaller.style.display = 'none';
  evaller.id = Math.random();

  const finalCode = debug
    ? '/* ------------------------ */ debugger;\n\n\n\n\n' +
      snippet.code +
      '\n\n\n\n\n/* ------------------------ */ debugger;'
    : snippet.code;

  evaller.onload = () => {
    evaller.contentWindow.console.assert = assert;

    const script = document.createElement('script');
    script.innerHTML = finalCode;

    evaller.contentDocument.body.appendChild(script);
  };

  // conditionally open iframe in new tab based on option
  snippet.root.appendChild(evaller);
};

const copyCode = (code) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(code);
    return;
  }
  navigator.clipboard.writeText(code).then(
    function () {
      // console.log('Async: Copying to clipboard was successful!');
      alert('copied!');
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
      alert(
        'Fallback: Copying text command was ' +
          (successful ? 'successful' : 'unsuccessful'),
      );
    } catch (err) {
      alert('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
    window.scrollTo(0, 0);
  }
};

// ----- render snippets -----

const renderCode = (code = '') => {
  const container = document.createElement('div');
  container.innerHTML = `<pre class="editor language-js"><code></code></pre>`;
  container.firstChild.firstChild.textContent = code;

  hljs.highlightElement(container.firstChild);

  return { container };
};

// total side-effects
const renderSnippet = (snippet) => {
  snippet.root = document.createElement('div');
  snippet.root.innerHTML = `
<div class="split">
  <h2 id="${snippet.name}">${snippet.name}</h2>
  <div class="down">
    <button class='runner'>run</button>
    <button class='debugger'>debug</button>
    |
    <button class='copier'>copy</button>
    <button class='githubber'>link</button>
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
    renderCode(snippet.code),
  );

  snippet.root.appendChild(snippet.container);
};

// ----- initialize UI -----

document
  .getElementById('tags')
  .appendChild(filterList(state.tags, 'tags', false));

const snippetsRoot = document.getElementById('snippets');
for (const snippet of state.snippets) {
  renderSnippet(snippet);

  snippet.root
    .getElementsByClassName('runner')[0]
    .addEventListener('click', () => runCode(snippet));

  snippet.root
    .getElementsByClassName('debugger')[0]
    .addEventListener('click', () => runCode(snippet, true));

  snippet.root
    .getElementsByClassName('copier')[0]
    .addEventListener('click', () => copyCode(snippet.code));

  snippet.root
    .getElementsByClassName('githubber')[0]
    .addEventListener('click', () =>
      window.open(`${state.repo}/tree/main/snippets/${snippet.name}`, '_blank'),
    );

  snippetsRoot.appendChild(snippet.root);
}

document.getElementById('tags').addEventListener('change', (e) => {
  const [key, value] = e.target.id.split(SEPARATOR);

  const entry = state[key].find((entry) => entry.value === value);
  entry.selected = e.target.checked;

  const ignoreTags = state.tags.every((tag) => !tag.selected);

  for (const snippet of state.snippets) {
    const tagsAreSelected =
      ignoreTags ||
      state.tags.find(
        (tag) => tag.selected && snippet.tags.includes(tag.value),
      );

    if (tagsAreSelected) {
      snippet.visible(true);
    } else {
      snippet.visible(false);
    }
  }
});
