import { state } from '../../state.js';

import { REPO } from '../../CONSTANTS.js';

import { lang } from '../../utils/titling.js';

import { langs } from '../langs/index.js';

import { n } from '../../utils/n.js';

export const panel = (snippet) => {
  const { dangerZone } = langs[lang(snippet.title)];

  return n('div', 'down', [
    n(
      'span',
      { id: `${snippet.title}-danger-zone`, className: 'danger-zone' },
      dangerZone(snippet),
    ),
    n('button', {}, 'copy', () => copyText(snippet.text, `copied ${snippet.title}`)),
    n('button', {}, 'print', () => printText(snippet)),
    n('button', {}, 'download', () => download(snippet)),
    ...(snippet.figment
      ? []
      : [
          n('button', {}, 'link', () => {
            const url = `${window.location.origin}${window.location.pathname}?title=${
              snippet.title
            }&danger=${state.liveDangerously ? 'yes' : 'no'}`;
            copyText(url, `copied URL for -> ${snippet.title}`);
          }),
          n('button', {}, 'source', () =>
            window.open(`${REPO}/tree/main/snippets/${snippet.title}`, '_blank'),
          ),
        ]),
  ]);
};

// -------------------------------------------------

const fallbackCopyTextToClipboard = (text = '') => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    alert(successful ? message : "nope, couldn't copy the link.\ntry again");
  } catch (err) {
    alert("nope, couldn't copy the link.\ntry again");
  }

  document.body.removeChild(textArea);
  window.scrollTo(0, 0);
};

const copyText = (text = '', message = 'copied!') => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }

  navigator.clipboard.writeText(text).then(
    () => alert(message),
    () => fallbackCopyTextToClipboard(text),
  );
};

// open the snippet solo in a new tab with print options
const printText = ({ title = '', text = '' }) =>
  window.open(
    `./print.html?title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}`,
    '_blank',
  );

const download = ({ title = '', text = '', figment = false }) => {
  const downloader = document.createElement('a');
  downloader.setAttribute('download', figment ? `_figment_${title}` : title);
  downloader.style.display = 'none';
  downloader.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );

  document.body.appendChild(downloader);
  downloader.click();
  document.body.removeChild(downloader);
};
