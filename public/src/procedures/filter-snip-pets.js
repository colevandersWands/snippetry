import { countSnippets } from './count-snippets.js';

import { state } from '../state.js';

import { persistToParams } from './persist-to-params.js';

export const filterSnipPets = (snippetTitle = '') => {
  const ignoreTags = state.tags.every((tag) => !tag.selected);
  const snippetName = state.snippets.find((snippet) => snippet.title === state.search);

  if (!ignoreTags || state.search !== '' || snippetName) {
    for (const snip of state.snips) snip.display = false;
  } else {
    for (const snip of state.snips) snip.display = true;
  }

  if (snippetTitle) {
    for (const snippet of state.snippets) {
      if (snippet.title === state.search) {
        snippet.display == true;
      } else {
        snippet.display = false;
      }
    }
  } else {
    const selectedTags = ignoreTags ? [] : state.tags.filter((tag) => tag.selected);
    for (const snippet of state.snippets) {
      const matchesSearch =
        snippet.text.toLowerCase().includes(state.search.toLowerCase()) ||
        snippet.title.toLowerCase().includes(state.search.toLowerCase());

      if (
        ignoreTags
          ? matchesSearch
          : matchesSearch &&
            selectedTags.every((tag) => snippet.tags?.includes(tag.value))
      ) {
        snippet.display = true;
      } else {
        snippet.display = false;
      }
    }
  }

  // ----- update UI -----

  for (const snippet of state.snippets) {
    if (snippet.dom) {
      if (snippet.display) {
        snippet.dom.style.display = 'block';
      } else {
        snippet.dom.style.display = 'none';
      }
    }
  }
  for (const snip of state.snips) {
    if (snip.dom) {
      if (snip.display) {
        snip.dom.style.display = 'block';
      } else {
        snip.dom.style.display = 'none';
      }
    }
  }

  persistToParams();

  countSnippets(state.snippets.filter((snippet) => snippet.display).length);
};
