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
    n('button', {}, 'copy', () => copyCode(snippet.text, `copied ${snippet.title}`)),
    n('button', {}, 'link', () => {
      const url = `${window.location.origin}${window.location.pathname}?title=${
        snippet.title
      }&danger=${state.liveDangerously ? 'yes' : 'no'}`;
      copyCode(url, `${url} ->  URL is copied`);
    }),
    snippet.figment
      ? null
      : n('button', {}, 'source', () =>
          window.open(`${REPO}/tree/main/snippets/${snippet.title}`, '_blank'),
        ),
  ]);
};

// -------------------------------------------------

const fallbackCopyTextToClipboard = (text) => {
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

const copyCode = (code, message = 'copied!') => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(code);
    return;
  }

  navigator.clipboard.writeText(code).then(
    () => alert(message),
    () => fallbackCopyTextToClipboard(code),
  );
};
