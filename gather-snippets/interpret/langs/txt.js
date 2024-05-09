import { staticLabels } from '../utils.js';

export const txt = ({ text = '' }) => {
  const forelinks = [
    ...staticLabels({
      text,
      begin: /(\()[\s]*see[\s]*:/gi,
      end: /(\))/gi,
    }),
  ];

  const tags = staticLabels({
    text,
    begin: /(\()[\s]*tags[\s]*:/gi,
    end: /(\))/gi,
  });

  return { text, forelinks, tags };
};
