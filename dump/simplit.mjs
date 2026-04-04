import { renderMarkdown } from '../public/src/abstract-snippet-tree/langs/md/render-markdown.js';

export const simplit = (markdown = '') => {
  const parsed = renderMarkdown(markdown);

  const container = document.createElement('div');
  container.innerHTML = parsed;

  let code = '';
  for (const block of container.getElementsByTagName('code')) {
    code += '\n\n' + block.innerText;
  }

  return code;
};
