import { js } from './js/index.js';
import { txt } from './txt.js';

export const psu = {
  ...txt,
  dangerZone: (snippet) => [...js.dangerZone(snippet), ...txt.dangerZone(snippet)],
};
