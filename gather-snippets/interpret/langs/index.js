// better way to do this?
//	could re-export from ./lang.js for things like .svg
//	that could make this more generic

import { css } from './css.js';
import { html } from './html.js';
import { js } from './js/index.js';
import { md } from './md/index.js';
import { txt } from './txt.js';
import { py } from './py.js';

export const langs = { css, htm: html, html, js, mjs: js, md, txt, py, svg: html };
