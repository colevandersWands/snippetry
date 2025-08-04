/**
 * Tags snippets that are variations of the same base concept
 * by analyzing their base names (before the first dot)
 */
export function tagVariations(snippets = []) {
  const metaSnippets = snippets
    .filter((snippet) => !snippet.title.startsWith('.'))
    .filter((snippet) => !snippet.metappet)
    .map((snippet) => ({ snippet }));

  const baseNames = {};
  for (const metaSnippet of metaSnippets) {
    metaSnippet.baseName = metaSnippet.snippet.title
      .split('.')
      .shift()
      .toLowerCase()
      .replaceAll('_', '-');
    if (baseNames[metaSnippet.baseName]) {
      baseNames[metaSnippet.baseName]++;
    } else baseNames[metaSnippet.baseName] = 1;
  }

  const variation = Object.entries(baseNames)
    .filter(([_, value]) => value > 1)
    .map(([theme]) => theme);

  for (const metaSnippet of metaSnippets) {
    if (variation.includes(metaSnippet.baseName)) {
      if (!metaSnippet.snippet.tags) metaSnippet.snippet.tags = [];
      metaSnippet.snippet.tags.push('variation');
    }
  }
}
