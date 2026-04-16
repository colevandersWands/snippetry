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
      : [n('button', {}, 'render', (e) => toggleRender(snippet, e.target))],
  controls: (snippet) =>
    snippet.tags?.includes('live')
      ? [
          n('button', {}, 'restart', () => restartLive(snippet)),
          n('button', {}, 'new tab', () => window.open(snippet.src, '_blank')),
        ]
      : [n('button', {}, 'new tab', () => newTabHTML(snippet))],
  translate: ({ ast, snippet }) =>
    snippet.tags?.includes('live')
      ? revise(ast, (node) =>
          node?.attributes?.id === `${snippet.title}-text`
            ? liveContainer(snippet)
            : node,
        )
      : ast,
};

// --- shared iframe rendering ---

const renderIframe = ({ src, srcdoc }) => {
  const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const maxSide = Math.min(window.innerHeight - 7 * remPx, window.innerWidth);
  const scale = maxSide / Math.max(window.innerWidth, window.innerHeight);

  const scaledW = window.innerWidth * scale;
  const scaledH = window.innerHeight * scale;
  const offsetX = (maxSide - scaledW) / 2;
  const offsetY = (maxSide - scaledH) / 2;

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `width: ${maxSide}px; height: ${maxSide}px; overflow: hidden; position: relative;`;

  const iframe = document.createElement('iframe');
  if (src) iframe.src = src;
  if (srcdoc) iframe.srcdoc = srcdoc;
  iframe.style.cssText = `border: none; width: ${window.innerWidth}px; height: ${window.innerHeight}px; transform: scale(${scale}); transform-origin: top left; position: absolute; left: ${offsetX}px; top: ${offsetY}px;`;
  iframe.setAttribute(
    'sandbox',
    'allow-scripts allow-same-origin allow-modals allow-popups allow-forms allow-downloads',
  );

  wrapper.appendChild(iframe);
  return wrapper;
};

const withBase = (html) => {
  const snippetsBase = new URL('./snippets/', window.location.href).href;
  const baseTag = `<base href="${snippetsBase}">`;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (match) => `${match}${baseTag}`);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html[^>]*>/i, (match) => `${match}<head>${baseTag}</head>`);
  }
  return (
    '<!DOCTYPE html>' +
    '<html style="height:100%">' +
    `<head>${baseTag}</head>` +
    '<body style="height:100%;margin:0">' +
    html +
    '</body></html>'
  );
};

// --- live ---

const liveRoot = (snippet) => renderIframe({ src: snippet.src });

const liveContainer = (snippet) => {
  const container = lazyRender(() => liveRoot(snippet));
  container.id = `${snippet.title}-live-container`;
  return container;
};

const restartLive = (snippet) => {
  const iframe = document
    .getElementById(`${snippet.title}-live-container`)
    ?.querySelector('iframe');
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

// --- plain HTML render toggle ---

const plainRender = (snippet) => renderIframe({ srcdoc: withBase(snippet.text) });

const toggleRender = (snippet, button) => {
  const container = document.getElementById(`${snippet.title}-text`);
  if (!container) return;

  if (button.textContent === 'render') {
    container.replaceChildren(plainRender(snippet));
    button.textContent = 'source';
  } else {
    container.replaceChildren(editor(snippet));
    button.textContent = 'render';
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
