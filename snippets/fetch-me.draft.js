fetch(
  `${window.location.origin}/${window.location.pathname}/snippets/fetch-me.js`,
)
  .then((res) => res.text())
  .then(console.log)
  .catch(console.error);
