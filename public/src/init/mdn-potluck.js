const deepKeys = (obj = {}, keys = new Set()) => {
  for (const [key, value] of Object.entries(obj)) {
    if (keys.has(key)) {
      continue;
    }

    keys.add(key);

    if (Object(value) === value) {
      keys.add(...deepKeys(value, keys));
    }
  }

  return Array.from(keys);
};

const docSearchQueries = deepKeys(globalThis);

document.getElementById('mdn-potluck').addEventListener('click', function MDNPotluck(e) {
  e.preventDefault();

  const randomDocsQuery =
    docSearchQueries[Math.floor(Math.random() * docSearchQueries.length)];

  window.open(
    `https://developer.mozilla.org/en-US/search?q=${randomDocsQuery}`,
    '_blank',
  );
});
