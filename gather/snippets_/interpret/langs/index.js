// better way to do this?
//	could re-export from ./lang.js for things like .svg
//	that could make this more generic

import { coem } from './coem.js';
import { css } from './css.js';
import { html } from './html.js';
import { js } from './js/index.js';
import { md } from './md/index.js';
import { py } from './py.js';
import { rb } from './rb.js';
import { svg } from './svg.js';
import { txt } from './txt.js';

export const langs = { coem, css, htm: html, html, js, mjs: js, md, py, rb, ruby: rb, svg, txt };
