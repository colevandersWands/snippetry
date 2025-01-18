import { staticLabels } from '../utils.js';

export const txt = ({ text = '', title = '' }, snippets = []) => {
  const forelinks = staticLabels({
    text,
    begin: /(\()[\s]*see[\s]*:/gi,
    end: /(\))/gi,
  });

  const tags = staticLabels({
    text,
    begin: /(\()[\s]*tags[\s]*:/gi,
    end: /(\))/gi,
  });

  let metappet = undefined;
  for (const snippet of snippets) {
    if (
      `${snippet.title}.txt`.toLowerCase() === title.toLowerCase() &&
      snippet.title.toLowerCase().endsWith('.svg')
    ) {
      tags.push('metappet');
      metappet = snippet.title;
    }
  }

  if (
    staticLabels({
      text,
      begin: /(\()[\s]*tribute[\s]*:/gi,
      end: /(\))/gi,
    }).length > 0
  ) {
    tags.push('tribute');
  }

  return { title, text, forelinks, tags, metappet };
};
