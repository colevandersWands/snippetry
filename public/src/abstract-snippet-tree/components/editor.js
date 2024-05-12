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

  const initializeEditor = (entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        observer.unobserve(editorContainer);

        const highlight = (editor) => {
          snippet.text = editor.textContent; // side-effect
          Prism.highlightElement(editor);
        };

        const jar = CodeJar(editorContainer.firstChild, highlight, jarConfig(lang));
        jar.updateCode(snippet.text);
      }
    }
  };

  new IntersectionObserver(initializeEditor, {
    root: null, // Use the viewport as the root
    threshold: 0, // Trigger callback when any part of the target enters the viewport
  }).observe(editorContainer);

  return editorContainer;
};
