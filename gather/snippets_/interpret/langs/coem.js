import { staticLabels } from '../utils.js';

export const coem = ({ text = '' }) => {
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

  return { text, forelinks, tags };
};
