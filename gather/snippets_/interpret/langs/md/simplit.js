import { fromMarkdown } from 'mdast-util-from-markdown';
import { visit } from 'unist-util-visit';

export const simplit = ({ text = '', lang = '' }) => {
  let code = '';
  const ast = fromMarkdown(text);
  visit(ast, 'code', (node) => {
    if (lang.includes(node.lang)) code += `\n\n${node.value}`;
  });
  return code.trim() + '\n';
};
