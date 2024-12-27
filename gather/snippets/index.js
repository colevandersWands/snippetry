import { writeFile } from 'fs/promises';

import {
  PUBLIC_SNIPPETS,
  PUBLIC_TAGS,
  PUBLIC_LINKS,
  PUBLIC_LANGS,
  SNIPPETS_ROOT,
} from './constants.js';

import { dynamicTags } from './dynamic-tags.js';
import { interpret } from './interpret/index.js';
import { readSnippets } from './read-snippets.js';

// ---------- read and interpret snippets ----------

const { snippets: uninterpreted, langs } = await readSnippets(SNIPPETS_ROOT);

const snippets = uninterpreted.map((snippet) =>
  interpret({ ...snippet, tags: [] }, uninterpreted),
);

// ---------- lift subtexts ----------

for (const snippet of snippets) {
  if (snippet.subtext) {
    const { subtext } = snippet;
    subtext.figment = snippet.title;

    if (!subtext.aftlinks) subtext.aftlinks = [];
    subtext.aftlinks.push(snippet.title);

    snippets.push(subtext);
    snippet.subtext = snippet.subtext.title;
  }
}

// ---------- assign dynamic tags to snippets ----------

for (const dynamicTag of dynamicTags) dynamicTag(snippets);
for (const snippet of snippets) snippet.tags = Array.from(new Set(snippet.tags));

// ---------- compile tags ----------

const tags = Array.from(
  new Set(
    snippets
      .flatMap((snippet) => snippet.tags?.map((tag) => tag.toLowerCase()))
      .filter((tag) => tag),
  ),
).sort();

// ---------- assign metalinks to metappets ----------

const nameyName = ({ title = '' }) =>
  title.split('.').shift().toLowerCase().replaceAll('_', ' ').replaceAll('-', ' ');

for (const metappet of snippets.filter((snippet) => snippet.tags?.includes('metappet'))) {
  const metalinks = new Set();
  for (const snippet of snippets) {
    if (metappet === snippet) continue;
    if (nameyName(metappet) === nameyName(snippet)) {
      metalinks.add(snippet.title);
    }
    if (snippet.tags?.includes(nameyName(metappet))) {
      metalinks.add(snippet.title);
    }
  }
  metappet.metalinks = Array.from(metalinks).sort();
}

// ---------- assign meta-indicated tags ----------

for (const metappet of snippets.filter((snippet) => snippet.tags?.includes('metappet'))) {
  if (tags.includes(nameyName(metappet))) {
    metappet.tags.push(nameyName(metappet));
  }
}

// ---------- find aftlinks ----------

for (const snippet of snippets) {
  const aftlinks = new Set();
  for (const otherSnippet of snippets) {
    find_forelinks: {
      if (!otherSnippet.forelinks) break find_forelinks;
      if (otherSnippet.forelinks.length === 0) break find_forelinks;
      if (otherSnippet.forelinks.find((forelink) => forelink === snippet.title)) {
        aftlinks.add(otherSnippet.title);
      }
    }
    find_metalinks: {
      if (!otherSnippet.metalinks) break find_metalinks;
      if (otherSnippet.metalinks.length === 0) break find_metalinks;
      if (otherSnippet.metalinks.find((metalink) => metalink === snippet.title)) {
        aftlinks.add(otherSnippet.title);
      }
    }
    if (otherSnippet.subtext === snippet.title) {
      aftlinks.add(otherSnippet.title);
    }
  }
  snippet.aftlinks = Array.from(aftlinks).sort();
}

// ---------- compile links ----------

const links = [];
for (const snippet of snippets) {
  const { title, tags, forelinks, metalinks, subtext } = snippet;
  if (tags) {
    for (const tag of tags) {
      links.push({ from: title, to: tag, type: 'tag' });
    }
  }
  if (forelinks) {
    for (const forelink of forelinks) {
      links.push({ from: title, to: forelink, type: 'forelink' });
    }
  }
  if (metalinks) {
    for (const metalink of metalinks) {
      links.push({ from: title, to: metalink, type: 'metalink' });
    }
  }
  if (subtext) {
    links.push({ from: title, to: subtext, type: 'subtext' });
  }
}

// -=-=-= write gathered snippets =-=-=-

await Promise.all([
  writeFile(
    PUBLIC_SNIPPETS,
    JSON.stringify(snippets, (_, value) =>
      value === null || (Array.isArray(value) && value.length === 0) ? undefined : value,
    ),
    (err) => err && console.error(err),
  ),
  writeFile(PUBLIC_TAGS, JSON.stringify(tags), (err) => err && console.error(err)),
  writeFile(PUBLIC_LINKS, JSON.stringify(links), (err) => err && console.error(err)),
  writeFile(
    PUBLIC_LANGS,
    JSON.stringify(langs.sort()),
    (err) => err && console.error(err),
  ),
]);

console.log('------ done gathering snippets ------');
