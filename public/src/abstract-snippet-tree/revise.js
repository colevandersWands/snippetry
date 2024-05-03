export const revise = (ast = {}, edits = (n) => n) => {
  const revision = edits(ast);

  if (Array.isArray(revision) && revision[0].toLowerCase() === 'skip')
    return revision[1] || ast;
  if (typeof revision === 'string' && revision.toLowerCase() === 'skip') return ast;
  if (
    (Array.isArray(revision) && revision[0].toLowerCase() === 'remove') ||
    (typeof revision === 'string' && revision.toLowerCase() === 'remove')
  ) {
    return null;
  }

  if (!(revision instanceof Element) && Array.isArray(revision?.children)) {
    revision.children = revision.children
      .map((child) => (child instanceof Element ? child : revise(child, edits)))
      .filter((c) => c);
  }

  return revision;
};
