import { state } from '../state.js';

import { persistToParams } from '../procedures/persist-to-params.js';

const codeIsText = document.getElementById('code-is-text');
if (state.codeIsText) {
  codeIsText.checked = true;
} else {
  codeIsText.checked = false;
}

const textOrCodeStyle = document.createElement('style');
textOrCodeStyle.innerHTML = '.token { color: black !important; }';

const textOrCode = () => {
  state.codeIsText = !state.codeIsText;

  if (state.codeIsText) {
    document.body.appendChild(textOrCodeStyle);
  } else if (textOrCodeStyle.parentElement === document.body) {
    document.body.removeChild(textOrCodeStyle);
  }

  persistToParams();
};
codeIsText.addEventListener('input', textOrCode);

if (state.codeIsText) {
  document.body.appendChild(textOrCodeStyle);
}
