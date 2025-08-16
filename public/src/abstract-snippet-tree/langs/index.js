import { coem } from './coem.js';
import { css } from './css.js';
import { html } from './html.js';
import { js } from './js/index.js';
import { json } from './json.js';
import { md } from './md/index.js';
import { psu } from './psu.js';
import { py } from './py.js';
import { rb } from './rb/index.js';
import { sh } from './sh.js';
import { svg } from './svg.js';
import { txt } from './txt.js';
import { yaml } from './yaml.js';

const langMap = {
  coem,
  css,
  htm: html,
  html,
  js,
  json,
  cjs: js,
  mjs: js,
  md,
  psu,
  py,
  rb,
  ruby: rb,
  sh,
  svg,
  txt,
  yaml,
};

export const langs = new Proxy(langMap, {
  get(target, key) {
    return key in target ? target[key] : txt;
  },
});
