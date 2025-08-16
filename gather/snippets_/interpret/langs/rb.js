import { staticLabels } from '../utils.js';

export const rb = ({ text = '' }) => {
  // Extract Ruby-specific patterns
  const forelinks = [];
  const tags = [];

  // Find require statements
  const requirePattern = /require\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = requirePattern.exec(text))) {
    forelinks.push(match[1]);
  }

  // Find require_relative statements
  const requireRelativePattern = /require_relative\s+['"]([^'"]+)['"]/g;
  while ((match = requireRelativePattern.exec(text))) {
    forelinks.push(match[1]);
  }

  forelinks.push(
    ...staticLabels({
      text,
      begin: /(\#)[\s]*see[\s]*:/gi,
    }),
  );

  // Extract tags from Ruby comments (similar to Python)
  const rubyCommentTags = staticLabels({
    text,
    label: 'tags',
    begin: /(\#)[\s]*tags[\s]*:/gi,
  });
  tags.push(...rubyCommentTags);

  // Check for tribute comments
  if (
    staticLabels({
      text,
      begin: /(\#)[\s]*tribute[\s]*:/gi,
    }).length > 0
  ) {
    tags.push('tribute');
  }

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

  return {
    forelinks: [...new Set(forelinks)], // Remove duplicates
    tags: [...new Set(tags)], // Remove duplicate tags
    text,
    alt,
  };
};
