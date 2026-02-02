#!/usr/bin/env node
import { _written_ } from './executable-comment._written_.mjs';

const { _ } = { _: _written_ };

// Basic test
_.Once.upon.a.time('in', 'a', 'codebase').there.lived.a.snippet['!'];
console.log('Basic:', String(_));

// New instance test
const story = new _(['Chapter', '1:']);
story.The.quick.brown.fox('jumps').over.the.lazy.dog('twice!');
console.log('Story:', String(story));

// Offrecord test
const notes = new _();
notes.Public.statement[Symbol.iterator].private.thoughts.done.continues;
console.log('Notes:', String(notes));

// Edge case: empty parentheticals
const edge = new _();
edge.Testing().empty('args').calls();
console.log('Edge:', String(edge));

// tags: coAIthored
