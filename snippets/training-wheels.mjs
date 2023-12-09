import { deMethod } from './de-method.mjs';

// --- setup, could happen in a different file ---

deMethod(String, { target: globalThis, prefix: '$str' });
deMethod(Array, { target: globalThis, prefix: '$arr' });
deMethod(console, { target: globalThis, statics: true });

// --- use the functioned methods ---

const things = [];
while (true) {
  const thing = prompt('enter things, cancel to finish');
  log(thing);
  if (thing === null) break;
  $arrPush(things, thing);
}
log(things);

const smallThings = $arrMap(things, $strToLowerCase);
const renderedThings = $arrJoin(smallThings, '\n- ');
const packagedThings = `here are your smaller things:\n- ${renderedThings}`;

alert(packagedThings);
