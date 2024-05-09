import { emoj } from './emoj.mjs';
import { say } from './say.mjs';
import { theFoxSays as yip } from './what-does-the-fox-say.mjs';

export const funsole = Object.assign({}, console, { emoj, say, yip });

export default funsole;

// tags: minibrary
