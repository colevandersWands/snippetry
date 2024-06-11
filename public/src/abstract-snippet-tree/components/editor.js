import { CodeJar } from '../../../lib/codejar.min.js';

import { lang } from '../../utils/titling.js';

import { lazyRender } from '../utils/lazy-render.js';

import { langs } from '../langs/index.js';

export const editor = (snippet) =>
  lazyRender(() => {
    const { className, jarConfig } = langs[lang(snippet.title)];

    const editorContainer = document.createElement('pre');
    editorContainer.className = `editor ${className(snippet.title)}`;
    const codeContainer = document.createElement('code');
    codeContainer.textContent = snippet.text;
    editorContainer.appendChild(codeContainer);

    const highlight = (editor) => {
      snippet.text = editor.textContent; // side-effect
      Prism.highlightElement(editor);
    };

    const jar = CodeJar(editorContainer.firstChild, highlight, jarConfig(lang));

    jar.updateCode(snippet.text);

    return editorContainer;
  });
