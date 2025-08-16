import { staticLabels } from '../utils.js';

export const py = ({ text = '' }) => {
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

  const tags = staticLabels({
    text,
    label: 'tags',
    begin: /(\#)[\s]*tags[\s]*:/gi,
  });

  const forlinks = staticLabels({
    text,
    begin: /(\#)[\s]*see[\s]*:/gi,
  });

  if (
    staticLabels({
      text,
      begin: /(\#)[\s]*tribute[\s]*:/gi,
    }).length > 0
  ) {
    tags.push('tribute');
  }

  return { tags, alt, text, forlinks };
};
