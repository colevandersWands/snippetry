import { HREF } from '../CONSTANTS.js';

import { state } from '../state.js';

export const persistToParams = () => {
  const params = [];

  if (state.liveDangerously) {
    params.push(`danger=${state.liveDangerously ? 'yes' : 'no'}`);
  }

  if (state.search) {
    params.push(`search=${encodeURI(state.search)}`);
  }

  const selectedTags = state.tags.filter((tag) => tag.selected);
  if (selectedTags.length > 0) {
    params.push(`tags=${encodeURI(selectedTags.map((tag) => tag.value).join(','))}`);
  }

  window.history.replaceState(
    {},
    '',
    `${HREF.origin + HREF.pathname}?${params.join('&')}`,
  );
};
