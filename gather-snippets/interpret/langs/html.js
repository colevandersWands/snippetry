import { fromHtml } from 'hast-util-from-html';
import { visit } from 'unist-util-visit';

import { isRelative, staticLabels } from '../utils.js';
import { findForelinks as findJsForelinks } from './js/find-forelinks.js';

export const html = ({ title = '', text = '' }) => {
  const forelinks = new Set();
  try {
    const ast = fromHtml(text, { fragment: true });
    visit(ast, (node) => {
      // find script src forelinks
      if (
        node.tagName === 'script' &&
        node.properties?.src &&
        isRelative(node.properties?.src)
      ) {
        const forelink = node.properties?.src.replace('./', '').replace('/', '');
        if (forelink) forelinks.add(forelink);
      }
      // find import statements in inline scripts
      const scriptText = node.children?.find(
        (child) => child.type === 'text' && child.value !== '',
      )?.value;
      if (node.tagName === 'script' && scriptText) {
        forelinks.add(
          ...findJsForelinks({
            code: scriptText,
            type: node.properties?.type || 'script',
          }),
        );
      }
      // if there's ever a style sheet
      if (node.tageName === 'link') null;
      // can search for CSS imports if ever
    });
  } catch (err) {
    // can ignore syntactically incorrect snippets
  }

  const tags = staticLabels({
    text,
    label: 'tags',
    begin: /(\<\!\-\-)[\s]*tags[\s]*:/gi,
    end: /(\-\-\>)/gi,
  });

  return {
    title,
    text,
    forelinks: Array.from(forelinks)
      .sort()
      .filter((fl) => fl),
    tags,
  };
};
