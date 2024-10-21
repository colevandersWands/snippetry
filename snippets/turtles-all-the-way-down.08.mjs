import { chronicle } from './chronicle.mjs';

const turtle = chronicle(function t(s) { turtle(s) });

try { turtle('🐢') } catch (turtles) { console.log(turtle._chronicle) }

// tags: wuzzle