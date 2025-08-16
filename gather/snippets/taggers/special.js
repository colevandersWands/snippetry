/**
 * Collection of special tag handlers for specific snippet types
 */

import { lang } from '../../snippets_/interpret/utils.js';

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

export function tagSnails(snippets = []) {
  for (const snippet of snippets) {
    if (
      snippet.title
        .toLowerCase()
        .replaceAll('_', '-')
        .replaceAll('.', '-')
        .split('-')
        .includes('snail') ||
      snippet.text.includes('🐌') ||
      snippet.text.toLowerCase().includes('i_(') ||
      snippet.text.toLowerCase().includes('i_@')
    ) {
      if (!snippet.tags) snippet.tags = [];
      snippet.tags.push('🐌');
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

export function tagOneLiners(snippets = []) {
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
}

export function tagDslDsp(snippets = []) {
  const dsls = [];
  for (const snippet of snippets) {
    const snippetLang = lang(snippet.title);
    const dslTags = snippet.title
      .toLowerCase()
      .split('.')
      .filter((chunk) => chunk.startsWith('dsl='))
      .map((chunk) => chunk.replace('dsl', ''))
      .map((chunk) => `${chunk}.${snippetLang}`);

    if (dslTags.length > 0) {
      for (const tag of dslTags) dsls.push({ tag, title: snippet.title });
      snippet.dsl = dslTags;
      snippet.tags || (snippet.tags = []);
      snippet.tags.push('dsl');
    }
  }

  for (const snippet of snippets) {
    const snippetLang = lang(snippet.title);

    // which dsl tags does this snippet call on
    const dslTags = snippet.title
      .toLowerCase()
      .split('.')
      .slice(1)
      .filter((chunk) => chunk.startsWith('='))
      .map((chunk) => `${chunk}.${snippetLang}`);

    // which dsls exist in same language as this snippet
    const colingualdsls = dsls.filter(({ tag, title }) => lang(title) === snippetLang);

    // what's the intesection of these two arrays?
    const dslsUsed = colingualdsls.filter(({ title, tag }) => dslTags.includes(tag));

    if (dslsUsed.length > 0) {
      snippet.dsp = dslsUsed.map(({ tag }) => tag);
      snippet.tags || (snippet.tags = []);
      snippet.tags.push('dsp');
      snippet.forelinks || (snippet.forelinks = []);
      snippet.forelinks.push(...dslsUsed.map(({ title }) => title));
    }
  }
}
