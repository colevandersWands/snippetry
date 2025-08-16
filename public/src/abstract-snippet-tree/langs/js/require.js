import { state } from '../../../state.js';

export const require = (snippetTitle = '') => {
  const pathlessTitle = snippetTitle
    .replaceAll('./', '')
    .replaceAll('/', '')
    .toLowerCase();

  if (
    !pathlessTitle.toLowerCase().endsWith('.cjs') &&
    !pathlessTitle.toLowerCase().endsWith('.js')
  ) {
    throw Error(`"${snippetTitle}" is not a CJS snippet.`);
  }

  const dependencyModule = state.snippets.find(({ title }) => title === pathlessTitle);

  if (!dependencyModule) {
    throw Error(`There is no snippet titled "${snippetTitle}"`);
  }

  // Create disposable iframe
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // Define module object in iframe's global scope
  iframe.contentWindow.module = { exports: {} };

  // Evaluate the source code in iframe context
  iframe.contentWindow.eval(dependencyModule.text);

  // Get the populated module object
  const module = iframe.contentWindow.module;

  // Clean up iframe
  document.body.removeChild(iframe);

  return module.exports;
};
