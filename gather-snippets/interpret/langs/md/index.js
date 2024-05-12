import { visit, SKIP } from 'unist-util-visit';

import { frontmatter } from 'micromark-extension-frontmatter';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { parse } from 'yaml';

import { langs } from '../index.js';

import { isRelative, name, ext, lang } from '../../utils.js';

import { interpret } from '../../index.js';

import { simplit } from './simplit.js';

export const md = ({ title, text }) => {
  const parsedFrontmatter = {};
  const forelinks = new Set();
  let simppet = null;

  // --- search for forelinks and frontmatter ---
  const mdAST = fromMarkdown(text, {
    extensions: [frontmatter(['yaml'])],
    mdastExtensions: [frontmatterFromMarkdown(['yaml'])],
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
      try {
        Object.assign(parsedFrontmatter, parse(node.value));
      } catch (err) {
        console.error(err);
      }
      // https://unifiedjs.com/learn/recipe/remove-node/
      parent.children.splice(index, 1);
      return [SKIP, index];
    }
  });

  if (Array.isArray(parsedFrontmatter.see) && parsedFrontmatter.see.length !== 0) {
    forelinks.add(...parsedFrontmatter.see);
    delete parsedFrontmatter.see;
  }

  if (ext(name(title)).replace('.', '') in langs) {
    // --- search for a simplit snippet ---
    const splitTitle = title.split('.');
    splitTitle.push('st', splitTitle[splitTitle.length - 2]);
    const subTitle = splitTitle.join('.');
    simppet = interpret({
      title: subTitle,
      text: simplit({ text, lang: lang(subTitle) }),
    });
  }

  const newppet = {
    forelinks: Array.from(forelinks).sort(),
    text: toMarkdown(mdAST),
    ...parsedFrontmatter,
  };

  if (simppet) newppet.subtext = simppet;

  return newppet;
};
