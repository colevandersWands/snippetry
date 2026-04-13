import { n } from '../../utils/n.js';
import { txt } from './txt.js';
import { revise } from '../utils/revise.js';
import { lazyRender } from '../utils/lazy-render.js';
import { editor } from '../components/editor.js';
import { snippetText } from '../utils/snippet-text.js';

export const html = {
  ...txt,
  dangerZone: (snippet) =>
    snippet.tags?.includes('live')
      ? [n('button', {}, 'source', (e) => toggleSource(snippet, e.target))]
      : [n('button', {}, 'render', () => newTabHTML(snippet))],
  controls: (snippet) =>
    snippet.tags?.includes('live')
      ? [n('button', {}, 'restart', () => restartLive(snippet))]
      : undefined,
  translate: ({ ast, snippet }) =>
    snippet.tags?.includes('live')
      ? revise(ast, (node) =>
          node?.attributes?.id === `${snippet.title}-text`
            ? liveContainer(snippet)
            : node,
        )
      : ast,
};

// --- live ---

const liveRoot = (snippet) => {
  const iframe = document.createElement('iframe');
  iframe.src = snippet.src;
  const size = 'min(calc(100vh - 7rem), 100vw)';
  iframe.style = `border: none; width: ${size}; height: ${size};`;
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  return iframe;
};

const liveContainer = (snippet) => {
  const container = lazyRender(() => liveRoot(snippet));
  container.id = `${snippet.title}-live-container`;
  return container;
};

const restartLive = (snippet) => {
  const iframe = document.getElementById(`${snippet.title}-live-container`)?.querySelector('iframe');
  if (iframe) iframe.contentWindow.location.reload();
};

const toggleSource = async (snippet, button) => {
  const container = document.getElementById(`${snippet.title}-live-container`);
  if (!container) return;

  if (button.textContent === 'source') {
    const text = await snippetText(snippet);
    container.replaceChildren(editor({ ...snippet, text }));
    button.textContent = 'live';
  } else {
    container.replaceChildren(liveRoot(snippet));
    button.textContent = 'source';
  }
};

// --- regular HTML ---

const newTabHTML = (snippet) => {
  console.log(`\n========== ${snippet.title} ==========\n`);

  const evaller = document.createElement('iframe');
  evaller.style = 'border: none; height: 100vh; width: 100vw;';
  evaller.src = './snippets/html.sandbox.txt';
  evaller.onload = () => {
    evaller.contentDocument.body.innerHTML = '';
    evaller.contentDocument.body.style += '; border: none; height: 100vh; width: 100vw;';

    const container = document.createElement('div');
    container.innerHTML = snippet.text;
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
