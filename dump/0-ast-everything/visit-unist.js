// adapted from https://github.com/syntax-tree/unist-util-visit/blob/main/lib/index.js

import { visitParents } from 'unist-util-visit-parents';

// Continue traversing as normal.
export const CONTINUE = true;

// Stop traversing immediately.
export const EXIT = false;

// Do not traverse this node’s children.
export const SKIP = 'skip';

export function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
  let reverse;
  let test;
  let visitor;

  if (typeof testOrVisitor === 'function' && typeof visitorOrReverse !== 'function') {
    test = undefined;
    visitor = testOrVisitor;
    reverse = visitorOrReverse;
  } else {
    test = testOrVisitor;
    visitor = visitorOrReverse;
    reverse = maybeReverse;
  }

  visitParents(tree, test, overload, reverse);

  function overload(node, parents) {
    const parent = parents[parents.length - 1];
    const index = parent ? parent.children.indexOf(node) : undefined;
    return visitor(node, index, parent);
  }
}
