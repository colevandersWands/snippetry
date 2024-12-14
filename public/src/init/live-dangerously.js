import { state } from '../state.js';

import { persistToParams } from '../procedures/persist-to-params.js';

const dangerZone = document.getElementById('danger-zone');

const dangerZoneStyle = Array.from(document.styleSheets[0].cssRules).find(
  (rule) => rule.selectorText === '.danger-zone',
).style;

export const riskManagement = () => {
  state.liveDangerously = !state.liveDangerously;
  if (state.liveDangerously) {
    dangerZoneStyle.display = 'inline-block';
  } else {
    dangerZoneStyle.display = 'none';
  }
  persistToParams();
};

dangerZone.addEventListener('input', riskManagement);

if (state.liveDangerously) {
  dangerZone.checked = true;
  dangerZoneStyle.display = 'inline-block';
} else {
  dangerZone.checked = false;
  dangerZoneStyle.display = 'none';
}
