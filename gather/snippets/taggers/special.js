/**
 * Collection of special tag handlers for specific snippet types
 */

export function tagDweets(snippets = []) {
  for (const snippet of snippets) {
    if (snippet.title.toLowerCase().endsWith('.dweet.js')) {
      if (!snippet.tags) snippet.tags = [];
      snippet.tags.push('dweet', 'golf');
    }
  }
}

export function tagTurtles(snippets = []) {
  for (const snippet of snippets) {
    if (
      snippet.title
        .toLowerCase()
        .replaceAll('_', '-')
        .startsWith('turtles-all-the-way-down') ||
      snippet.text.includes('🐢')
    ) {
      if (!snippet.tags) snippet.tags = [];
      snippet.tags.push('🐢');
    }
  }
}

export function tagSketches(snippets = []) {
  for (const snippet of snippets) {
    const smallName = snippet.title.toLowerCase();
    if (smallName.endsWith('.svg') && !smallName.endsWith('.txt.svg')) {
      if (!snippet.tags) snippet.tags = [];
      snippet.tags.push('sketch');
    }
  }
}

export function tagRecuseval(snippets = []) {
  for (const snippet of snippets) {
    if (
      snippet.title.toLowerCase().includes('recurseval') ||
      snippet.text.toLowerCase().includes('recurseval')
    ) {
      if (!snippet.tags) snippet.tags = [];
      snippet.tags.push('recurseval');
    }
  }
}
