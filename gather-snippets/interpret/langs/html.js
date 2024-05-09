import { fromHtml } from 'hast-util-from-html';
import { visit } from 'unist-util-visit';

import { isRelative, staticLabels } from '../utils.js';

import { css } from './css.js';
import { js } from './js/index.js';

export const html = ({ title = '', text = '' }) => {
  const forelinks = new Set();
  forelinks.add(
    ...staticLabels({
      text,
      begin: /(\<\!\-\-)[\s]*see[\s]*:/gi,
      end: /(\-\-\>)/gi,
    }),
  );

  const scripts = [];
  const styles = [];
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
      const nodeText = node.children?.find(
        (child) => child.type === 'text' && child.value !== '',
      )?.value;
      if (node.tagName === 'script' && nodeText) {
        const title = node.properties?.type === 'module' ? 'script.mjs' : 'script.js';
        const jsNippet = js({ title, text: nodeText });
        // scripts.push(jsNippet);

        forelinks.add(...jsNippet.forelinks);
      }

      if (node.tagName === 'style' && nodeText) {
        const csSnippet = css({ title: 'style.css', text: nodeText });
        // styles.push(csSnippet);

        forelinks.add(...csSnippet.forelinks);
      }

      // forelinks to style sheets
      if (node.tageName === 'link') null;
      // can search for CSS imports if ever
    });
  } catch (err) {
    // can ignore syntactically incorrect snippets
  }

  const tags = staticLabels({
    text,
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
    scripts,
    styles,
  };
};
