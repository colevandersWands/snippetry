import { CodeJar } from '../../../lib/codejar.min.js';

import { lang } from '../../utils/titling.js';

import { langs } from '../langs/index.js';

export const editor = (snippet) => {
  const { className, jarConfig } = langs[lang(snippet.title)];

  const editorContainer = document.createElement('pre');
  editorContainer.className = `editor ${className(snippet.title)}`;
  const codeContainer = document.createElement('code');
  codeContainer.textContent = snippet.text;
  editorContainer.appendChild(codeContainer);

  // from codeJar
  const highlight = (editor) => {
    snippet.text = editor.textContent; // side-effect the snippet for danger & copying

    // highlight.js does not trims old tags,
    // let's do it by this hack.
    editor.textContent = editor.textContent;
    Prism.highlightElement(editor);
  };

  const jar = CodeJar(editorContainer.firstChild, highlight, jarConfig(lang));
  jar.updateCode(snippet.text);

  return editorContainer;
};
