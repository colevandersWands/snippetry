// adapted from https://github.com/syntax-tree/unist-util-visit-parents/blob/main/lib/index.js

const ok = () => true;

const convert = (test) => {
  if (test === null || test === undefined) {
    return ok;
  }

  if (typeof test === 'function') {
    return castFactory(test);
  }

  if (typeof test === 'object') {
    return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
  }

  if (typeof test === 'string') {
    return typeFactory(test);
  }

  throw new Error('Expected function, string, or object as test');
};

const empty = [];

// Continue traversing as normal.
export const CONTINUE = true;

// Stop traversing immediately.
export const EXIT = false;

// Do not traverse this node’s children.
export const SKIP = 'skip';

export function visitParents(tree, test, visitor, reverse) {
  let check;

  if (typeof test === 'function' && typeof visitor !== 'function') {
    reverse = visitor;
    visitor = test;
  } else {
    check = test;
  }

  const is = convert(check);
  const step = reverse ? -1 : 1;

  factory(tree, undefined, [])();

  function factory(node, index, parents) {
    const value = node && typeof node === 'object' ? node : {};

    if (typeof value.nodeName === 'string') {
      const name = value.nodeName;
      Object.defineProperty(visit, 'nodeName', {
        value: 'nodeName (' + node.nodeName + (name ? '<' + name + '>' : '') + ')',
      });
    }

    return function visit() {
      let result = empty;
      let subresult;
      let offset;
      let grandparents;

      if (!test || is(node, index, parents[parents.length - 1] || undefined)) {
        result = toResult(visitor(node, parents));

        if (result[0] === EXIT) {
          return result;
        }
      }

      if ('children' in node && node.children) {
        const nodeAsParent = node;

        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step;
          grandparents = parents.concat(nodeAsParent);

          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset];

            subresult = factory(child, offset, grandparents)();

            if (subresult[0] === EXIT) {
              return subresult;
            }

            offset = typeof subresult[1] === 'number' ? subresult[1] : offset + step;
          }
        }
      }

      return result;
    };
  }
}

function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'number') {
    return [CONTINUE, value];
  }

  return value === null || value === undefined ? empty : [value];
}
