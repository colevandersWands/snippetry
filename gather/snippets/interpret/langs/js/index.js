import { langs } from '../index.js';

import { name, ext, staticLabels } from '../../utils.js';

import { findForelinks } from './find-forelinks.js';
import { jsast } from './jsast.js';

export const js = ({ title = '', text = '' }) => {
  let alt;
  const splitText = text.split('\n');
  const hashbangLine = splitText.find((line) => line.trimStart().startsWith('#!'));
  if (hashbangLine) {
    text = text
      .replace(hashbangLine + '\n\n', '')
      .replace(hashbangLine + '\n', '')
      .replace(hashbangLine, '');
    alt = hashbangLine?.replace('#!', '').trim();
  }

  const ast = jsast({ title, text });

  const forelinks = findForelinks(ast);

  forelinks.push(
    ...staticLabels({
      text,
      begin: /(\/\/)[\s]*see[\s]*:/gi,
    }),
  );

  const tags = staticLabels({
    text,
    label: 'tags',
    begin: /(\/\/)[\s]*tags[\s]*:/gi,
  });

  if (
    staticLabels({
      text,
      label: 'tribute',
      begin: /(\/\/)[\s]*tribute[\s]*:/gi,
    }).length > 0
  ) {
    tags.push('tribute');
  }

  let subtext = null;
  if (ast && ext(name(title)).replace('.', '') in langs) {
    const comments = [];
    for (const comment of ast?.comments) {
      comments.push({
        type: comment.type,
        lines: comment.value.split('\n'),
        start: comment.position.start.line,
        inset: comment.position.start.column,
      });
    }

    const preSubtextText = Array(text.split('\n').length).fill('');
    for (const comment of comments) {
      for (let i = 0; i < comment.lines.length; i++) {
        preSubtextText[i + comment.start] = comment.lines[i];
        if (comment.type === 'Line') {
          preSubtextText[i + comment.start] =
            Array(comment.inset).fill(' ').join('') + preSubtextText[i + comment.start];
        }
      }
    }

    const splitTitle = title.split('.');
    splitTitle.push('st', splitTitle[splitTitle.length - 2]);
    const subTitle = splitTitle.join('.');

    if (preSubtextText.join('').trim() !== '') {
      subtext = {
        title: subTitle,
        text: preSubtextText.join('\n'),
      };
    }
  }

  if (title.toLowerCase().endsWith('.dweet.js')) {
    text = text.replace(/^\/\/.*/gm, '').trim();
  }

  return { text, forelinks, tags, alt, subtext };
};
