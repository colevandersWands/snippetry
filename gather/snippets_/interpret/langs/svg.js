import { html } from './html.js';
import { txt } from './txt.js';

export const svg = ({ title = '', text = '' }, snippets = []) => {
  const metaTitle = title.toLowerCase() + '.txt';
  const metaSnippet = snippets.find(
    (snippet) => snippet.title.toLowerCase() === metaTitle,
  );

  const gathered = html({ title, text });

  if (metaSnippet !== undefined) {
    const parsedMetaSnippet = txt(metaSnippet);

    for (const key in parsedMetaSnippet) {
      if (key === 'title' || key === 'text') continue;

      if (Array.isArray(gathered[key]) && Array.isArray(parsedMetaSnippet[key])) {
        gathered[key].push(...parsedMetaSnippet[key]);
      } else {
        gathered[key] = parsedMetaSnippet[key];
      }
    }
  }

  return gathered;
};
