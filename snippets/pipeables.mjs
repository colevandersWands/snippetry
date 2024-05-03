import { pipeablert } from './pipeablert.mjs';
import { pipeablog } from './pipeablog.mjs';

pipeablert('a' + pipeablert('l' + pipeablert('e' + pipeablert('r' + pipeablert('t')))));

pipeablog('l' + pipeablog('o' + pipeablog('g')));
