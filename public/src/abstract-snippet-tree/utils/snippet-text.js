export const snippetText = (snippet) =>
  snippet.text !== undefined
    ? Promise.resolve(snippet.text)
    : fetch(snippet.src).then((r) => r.text());
