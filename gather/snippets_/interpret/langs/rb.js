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
  
  // Extract classes
  const classes = [];
  const classPattern = /class\s+(\w+)(?:\s*<\s*(\w+))?/g;
  while ((match = classPattern.exec(text))) {
    classes.push(match[1]);
    if (match[2]) {
      // Parent class is also a forelink
      forelinks.push(match[2]);
    }
  }
  
  // Extract modules
  const modules = [];
  const modulePattern = /module\s+(\w+)/g;
  while ((match = modulePattern.exec(text))) {
    modules.push(match[1]);
  }
  
  // Extract methods
  const methods = [];
  const methodPattern = /def\s+(\w+)/g;
  while ((match = methodPattern.exec(text))) {
    methods.push(match[1]);
  }
  
  // // Add Ruby-specific tags
  // if (classes.length > 0) {
  //   tags.push('classes');
  // }
  // if (modules.length > 0) {
  //   tags.push('modules');
  // }
  // if (text.includes('do') && text.includes('end')) {
  //   tags.push('blocks');
  // }
  // if (text.match(/\bself\b/)) {
  //   tags.push('metaprogramming');
  // }
  // if (text.match(/def\s+method_missing/)) {
  //   tags.push('metaprogramming');
  // }
  // if (text.match(/\.(send|public_send|__send__)\s*\(/)) {
  //   tags.push('metaprogramming');
  // }
  
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
  
  return { 
    forelinks: [...new Set(forelinks)], // Remove duplicates
    tags: [...new Set(tags)], // Remove duplicate tags
    classes,
    modules,
    methods,
    text
  };
};