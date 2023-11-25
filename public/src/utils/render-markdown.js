export const renderMarkdown = (markdown = '') =>
  marked.parse(markdown, {
    baseUrl: `./snippets/`,
    gfm: true,
  });
