import { visit, SKIP } from 'unist-util-visit';

import { frontmatter } from 'micromark-extension-frontmatter';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';

import { langs } from '../index.js';

import { isRelative, name, ext, staticLabels, lang } from '../../utils.js';

import { interpret } from '../../index.js';

import { simplit } from './simplit.js';

export const md = ({ title, text }) => {
  let alt = null;
  const forelinks = new Set();
  let simppet = null;

  // --- search for forelinks and an alt ---
  const mdAST = fromMarkdown(text, {
    extensions: [frontmatter()], // ['yaml', 'toml']
    mdastExtensions: [frontmatterFromMarkdown()],
  });

  visit(mdAST, ['link', 'image', 'yaml'], (node, index, parent) => {
    // can be improved with built-in path module, later
    if ((node.type === 'link' || node.type === 'image') && isRelative(node.url)) {
      const linkPath = node.url
        .split('/')
        .filter((i) => i)
        .filter((i) => i !== '.' && i !== '..');
      forelinks.add(linkPath.pop());
    } else if (node.type === 'yaml') {
      alt = node.value;
      // https://unifiedjs.com/learn/recipe/remove-node/
      parent.children.splice(index, 1);
      return [SKIP, index];
    }
  });

  // --- search for a simplit snippet ---
  if (ext(name(title)).replace('.', '') in langs) {
    const splitTitle = title.split('.');
    splitTitle.push('st', splitTitle[splitTitle.length - 2]);
    const subTitle = splitTitle.join('.');
    simppet = interpret({
      title: subTitle,
      text: simplit({ text, lang: lang(subTitle) }),
    });
  }

  const tags = staticLabels({
    text,
    label: 'tags',
    begin: /(\(|<!\-\-|)[\s]*tags[\s]*:/gi,
    end: /(\-\-\>)/gi,
  });

  const newppet = {
    forelinks: Array.from(forelinks).sort(),
    alt,
    tags,
    text: toMarkdown(mdAST),
  };

  if (simppet) newppet.subtext = simppet;

  return newppet;
};
