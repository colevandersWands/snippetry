import { HREF } from './CONSTANTS.js';

const [state, snips] = await Promise.all([
  fetch('./public/snippets.json').then((res) => res.json()),
  fetch('./public/snips.json').then((res) => res.json()),
]);

state.snips = snips;

// initialize tags
const persistedTagsEncoded = HREF.searchParams.get('tags');
const persistedTags = persistedTagsEncoded
  ? decodeURI(persistedTagsEncoded)
      .split(',')
      .filter((persistedTag) => state.tags.includes(persistedTag))
  : '';
state.tags = state.tags.map((tag) => ({
  value: tag,
  selected: persistedTags.includes(tag) ? true : false,
}));

// initialize query
const persistedQueryEncoded = HREF.searchParams.get('query');
state.query = persistedQueryEncoded ? decodeURI(persistedQueryEncoded) : '';

// initialize dangerous life
state.liveDangerously =
  !HREF.searchParams.has('danger') || HREF.searchParams.get('danger') !== 'yes'
    ? false
    : true;

export { state };
