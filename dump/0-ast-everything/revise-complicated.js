// skip, remove, replace

export const revise = (ast = {}, edits) => {
  if (typeof edits !== 'function' && edits?.__proto__ !== Object.prototype) return ast;

  const before = typeof edits === 'function' ? edits : edits?.before;
  const after = edits?.after;

  const beforeResult = before && before(ast);

  if (beforeResult === 'skip') return ast

  const afterResult = after && after(ast);
};
