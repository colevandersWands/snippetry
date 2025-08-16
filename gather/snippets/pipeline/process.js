import { writeFile } from 'fs/promises';
import { readSnippets as originalReadSnippets } from '../../snippets_/read-snippets.js';
import { interpret } from '../../snippets_/interpret/index.js';
import { tagVariations } from '../taggers/variation.js';
import {
  tagDweets,
  tagOneLiners,
  tagTurtles,
  tagSketches,
  tagRecuseval,
  tagSnails,
  tagDslDsp,
} from '../taggers/special.js';

export async function readSnippets(snippetsRoot) {
  return originalReadSnippets(snippetsRoot);
}

export async function interpretSnippets(snippets) {
  return snippets.map((snippet) => interpret({ ...snippet, tags: [] }, snippets));
}

export function processSubtexts(snippets) {
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
  return snippets;
}

export function processDocs(snippets) {
  const sourceToDocs = {};

  // First pass: Process docs snippets
  for (const snippet of snippets) {
    const { title } = snippet;
    if (title.includes('.docs.')) {
      const [sourceName] = title.split('.docs.');

      if (!snippet.tags) snippet.tags = [];
      if (!snippet.tags.includes('metappet')) snippet.tags.push('metappet');
      if (!snippet.tags.includes('docs')) snippet.tags.push('docs');
      snippet.docs = sourceName;

      if (!sourceToDocs[sourceName]) sourceToDocs[sourceName] = [];
      if (!sourceToDocs[sourceName].includes(title)) {
        sourceToDocs[sourceName].push(title);
      }
    }
  }

  // Second pass: Add rtfm arrays to source snippets
  for (const snippet of snippets) {
    if (sourceToDocs[snippet.title]) {
      snippet.rtfm = [...sourceToDocs[snippet.title]];
    }
  }

  return snippets;
}

export function processTags(snippets) {
  // Apply all tag generators
  tagVariations(snippets);
  tagDweets(snippets);
  tagTurtles(snippets);
  tagSketches(snippets);
  tagRecuseval(snippets);
  tagOneLiners(snippets);
  tagSnails(snippets);
  tagDslDsp(snippets);

  // Ensure unique tags per snippet
  for (const snippet of snippets) {
    snippet.tags = Array.from(new Set(snippet.tags || []));
  }

  // Compile unique tags across all snippets
  const tags = Array.from(
    new Set(
      snippets
        .flatMap((snippet) => snippet.tags?.map((tag) => tag.toLowerCase()))
        .filter((tag) => tag),
    ),
  ).sort();

  return { snippets, tags };
}

export function processMetalinks(snippets, tags) {
  function nameyName({ title = '' }) {
    return title
      .split('.')
      .shift()
      .toLowerCase()
      .replaceAll('_', ' ')
      .replaceAll('-', ' ');
  }

  // identify ruby potemkin programs (they use a global dependency)
  for (const snippet of snippets) {
    snippet.metalinks = [];
    if (
      snippet.title.toLowerCase().includes('._.') &&
      snippet.title.toLowerCase().endsWith('.rb')
    ) {
      snippet.metalinks.push('executable_pseudocode.opal.rb');
    }
  }

  // Assign metalinks to metappets
  for (const metappet of snippets.filter(
    (snippet) => snippet.tags?.includes('metappet'),
    // || snippet.tags?.includes('variation'),
  )) {
    const metalinks = new Set(metappet.metalinks);
    for (const snippet of snippets) {
      if (metappet === snippet) continue;

      if (nameyName(metappet) === nameyName(snippet)) metalinks.add(snippet.title);
      if (snippet.tags?.includes(nameyName(metappet))) metalinks.add(snippet.title);
      if (metappet.docs === snippet.title) metalinks.add(snippet.title);
    }
    metappet.metalinks = Array.from(metalinks).sort();
  }

  // Assign meta-indicated tags
  for (const metappet of snippets.filter((snippet) =>
    snippet.tags?.includes('metappet'),
  )) {
    if (tags.includes(nameyName(metappet))) {
      metappet.tags.push(nameyName(metappet));
    }
  }

  return snippets;
}

export function processLinks(snippets) {
  // Find aftlinks
  for (const snippet of snippets) {
    const aftlinks = new Set();
    for (const otherSnippet of snippets) {
      if (otherSnippet.forelinks?.includes(snippet.title)) {
        aftlinks.add(otherSnippet.title);
      }
      if (
        otherSnippet.metalinks?.includes(snippet.title) &&
        otherSnippet.docs !== snippet.title
      ) {
        aftlinks.add(otherSnippet.title);
      }
      if (otherSnippet.subtext === snippet.title) {
        aftlinks.add(otherSnippet.title);
      }
    }
    snippet.aftlinks = Array.from(aftlinks).sort();
  }

  // Compile all links
  const links = snippets.flatMap((snippet) => {
    const result = [];
    const { title, tags, forelinks, metalinks, subtext, aftlinks, docs, figment, rtfm } =
      snippet;

    // Original link types
    if (tags) {
      tags.forEach((tag) => result.push({ from: title, to: tag, type: 'tag' }));
    }
    if (forelinks) {
      forelinks.forEach((forelink) =>
        result.push({ from: title, to: forelink, type: 'forelink' }),
      );
    }
    if (metalinks) {
      metalinks.forEach((metalink) =>
        result.push({ from: title, to: metalink, type: 'metalink' }),
      );
    }
    if (subtext) {
      result.push({ from: title, to: subtext, type: 'subtext' });
    }

    // Additional relationship types
    if (aftlinks) {
      aftlinks.forEach((aftlink) =>
        result.push({ from: title, to: aftlink, type: 'aftlink' }),
      );
    }
    if (docs) {
      result.push({ from: title, to: docs, type: 'docs' });
    }
    // TODO DSL/DSP links
    if (figment) {
      result.push({ from: title, to: figment, type: 'figment' });
    }
    if (rtfm) {
      rtfm.forEach((doc) => result.push({ from: title, to: doc, type: 'rtfm' }));
    }

    return result;
  });

  return { snippets, links };
}

export async function writeOutput(state, outputPaths) {
  const { PUBLIC_SNIPPETS, PUBLIC_TAGS, PUBLIC_LINKS, PUBLIC_LANGS } = outputPaths;
  const { snippets, tags, links, langs } = state;

  const writePromises = [
    writeFile(
      PUBLIC_SNIPPETS,
      JSON.stringify(snippets, (_, value) =>
        value === null || (Array.isArray(value) && value.length === 0)
          ? undefined
          : value,
      ),
    ),
    writeFile(PUBLIC_TAGS, JSON.stringify(tags)),
    writeFile(PUBLIC_LINKS, JSON.stringify(links)),
    writeFile(PUBLIC_LANGS, JSON.stringify(langs.sort())),
  ];

  await Promise.all(writePromises);
}
