export const dynamicTags = [
  function variation(snippets = []) {
    const metaSnippets = snippets
      .filter((snippet) => !snippet.title.startsWith('.'))

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
  },

  function oneLiner(snippets = []) {
    const tagsRegex = /(\(|\/\/|<!\-\-|\/\*|\#)[\s]*tags[\s]*:(?:\s+(.*))?/gi;
    for (const snippet of snippets) {
      const trimmedCodeLines = snippet.text
        .replaceAll(tagsRegex, '')
        .trim()
        .split('\n')
        .filter((l) => l);

      if (trimmedCodeLines.length === 1) {
        if (!snippet.tags) snippet.tags = [];
        snippet.tags.push('1-liner');
      }
    }
  },

  function subtext(snippets = []) {
    for (const snippet of snippets) {
      if (snippet.title.toLowerCase().includes('.st.')) {
        snippet.tags.push('subtext');
      }
    }
  },

  function translation(snippets = []) {
    const lang = (name = '') => {
      const ext = name.split('.').pop().toLowerCase();
      return ext === 'mjs' ? 'js' : ext;
    };

    const universalize = (name = '') =>
      ((nameParts) => (nameParts.pop(), nameParts.join('.')))(name.split('.'))
        .replaceAll('_', '-')
        .toLowerCase();

    for (let i = 0; i < snippets.length; i++) {
      const oneSnippet = snippets[i];
      if (oneSnippet.title.startsWith('.')) continue;

      for (let j = i + 1; j < snippets.length; j++) {
        const anotherSnippet = snippets[j];
        if (
          universalize(oneSnippet.title) === universalize(anotherSnippet.title) &&
          lang(oneSnippet.title) !== lang(anotherSnippet.title)
        ) {
          oneSnippet.tags.push('translation');
          anotherSnippet.tags.push('translation');
        }
      }
    }
  },
];
