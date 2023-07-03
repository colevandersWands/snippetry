import steamroll from './steamroll.mjs';

fetch('./python-by-any-other-name.js')
  .then((res) => res.text())
  .then(steamroll)
  .then(console.log)
  .catch(console.error);

// tags: frivolous
