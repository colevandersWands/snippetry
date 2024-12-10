import { visit } from 'estree-util-visit';

import { isRelative } from '../../utils.js';

export const findForelinks = (ast = null) => {
  if (!ast) return [];

  const forelinks = new Set();

  visit(ast, (node) => {
    if (
      node.type.startsWith('Import') &&
      node.source?.value &&
      isRelative(node.source?.value)
    ) {
      const forelink = node.source?.value.replace('./', '').replace('/', '');
      if (forelink) forelinks.add(forelink);
    } else if (
      node.type === 'CallExpression' &&
      node.callee.name === 'fetch' &&
      node.arguments[0]?.type === 'Literal' &&
      isRelative(node.arguments[0]?.value)
    ) {
      forelinks.add(node.arguments[0].value.replace('./', '').replace('/', ''));
    }
  });

  return Array.from(forelinks).sort();
};
