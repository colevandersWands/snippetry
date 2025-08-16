import { state } from '../../state.js';

const snippets = state.snippets;

const areOverlapping = (arr1 = [], arr2 = []) =>
  arr1.filter((item) => arr2.includes(item)).length !== 0;

const gatherDependencies = (snippet, dependencies = new Set(), visited = new Set()) => {
  if (visited.has(snippet)) return dependencies;
  visited.add(snippet);

  if (!snippet.dsp) return dependencies;

  for (const next of snippets) {
    if (next === snippet) continue;
    if (areOverlapping(snippet.dsp, next.dsl)) {
      if (next.dsp) gatherDependencies(next, dependencies, visited);
      dependencies.add(next);
    }
  }

  return Array.from(dependencies);
};

export const compileDslDependencies = (snippet) => {
  if (!snippet.dsp) return '';

  const dependencies = gatherDependencies(snippet);

  return dependencies.map(({ text }) => text).join('\n\n\n');
};
