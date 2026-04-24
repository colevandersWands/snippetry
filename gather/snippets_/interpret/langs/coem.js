import { staticLabels } from '../utils.js';

export const coem = ({ text = '' }) => {
  let alt;
  const hashbangLine = text.split('\n').find((line) => line.trimStart().startsWith('#!'));
  if (hashbangLine) {
    text = text
      .replace(hashbangLine + '\n\n', '')
      .replace(hashbangLine + '\n', '')
      .replace(hashbangLine, '');
    alt = hashbangLine?.replace('#!', '').trim();
  }

  const forelinks = staticLabels({
    text,
    begin: /(\†)[\s]*see[\s]*:/gi,
  });

  const tags = staticLabels({
    text,
    begin: /(\†)[\s]*tags[\s]*:/gi,
  });

  if (
    staticLabels({
      text,
      begin: /(\†)[\s]*tribute[\s]*:/gi,
    }).length > 0
  ) {
    tags.push('tribute');
  }

  return { text, forelinks, tags, alt };
};
