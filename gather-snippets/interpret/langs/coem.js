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

  return { text, forelinks, tags };
};
