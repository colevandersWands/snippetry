import { html } from './html.js';

export const svg = ({ title = '', text = '' }, snippets = []) => {
  const sketchTagsTitle = title.toLowerCase() + '.csv';
  const sketchTagsSnippet = snippets.find(
    (snippet) => snippet.title.toLowerCase() === sketchTagsTitle,
  );

  const gathered = html({ title, text });
  if (sketchTagsSnippet) {
    const sketchTags = sketchTagsSnippet.text.split('\n')[0].split(',');
    gathered.tags.push(...sketchTags.map((tag) => tag.trim()));
  }
  return gathered;
};
