import { namojify } from './namojify.mjs';

const turtle = namojify(() => turtle(), '🐢');

console.log(turtle.name);

turtle();
