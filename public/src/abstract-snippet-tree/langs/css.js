import { n } from '../../utils/n.js';

import { txt } from './txt.js';

export const css = {
  ...txt,
  dangerZone: (snippet) => [n('button', {}, 'apply', applyStyle(snippet))],
};

// -----------------------------------------------

const applyStyle = (snippet) => {
  const snippetStyle = document.createElement('style');
  let isApplied = false;
  return function applyingStyle(e) {
    console.log(
      `\n========== ${snippet.title}: ${isApplied ? 'remove' : 'apply'} style ==========\n`,
    );
    // apply to body to override other styles
    if (isApplied) {
      document.body.removeChild(snippetStyle);
      isApplied = false;
    }

    if (e.target.innerText.includes('apply')) {
      snippetStyle.innerHTML = snippet.text;
      document.body.appendChild(snippetStyle);
      e.target.innerText = 'remove';
      isApplied = true;
    } else {
      e.target.innerText = 'apply';
    }
  };
};
