export const selectTag = (tag = {}) =>
  new CustomEvent('select-tag', {
    bubbles: true,
    detail: tag,
  });
