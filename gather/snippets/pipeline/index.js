import {
  readSnippets,
  interpretSnippets,
  processSubtexts,
  processDocs,
  processTags,
  processMetalinks,
  processLinks,
  writeOutput
} from './process.js';

/**
 * Processes snippets through the entire pipeline:
 * 1. Read and interpret snippets
 * 2. Process subtexts and lift them
 * 3. Handle documentation relationships
 * 4. Process and compile tags
 * 5. Handle metalinks and relationships
 * 6. Process all link types
 * 7. Write final output
 */
export async function processPipeline(snippetsRoot, outputPaths) {
  // Initialize pipeline state
  const state = {
    snippets: [],
    tags: [],
    links: [],
    langs: []
  };

  // Read and interpret
  const initial = await readSnippets(snippetsRoot);
  state.snippets = initial.snippets;
  state.langs = initial.langs;

  // Process through pipeline
  state.snippets = await interpretSnippets(state.snippets);
  state.snippets = processSubtexts(state.snippets);
  state.snippets = processDocs(state.snippets);

  const tagResult = processTags(state.snippets);
  state.snippets = tagResult.snippets;
  state.tags = tagResult.tags;

  state.snippets = processMetalinks(state.snippets, state.tags);

  const linkResult = processLinks(state.snippets);
  state.snippets = linkResult.snippets;
  state.links = linkResult.links;

  // Write output
  await writeOutput(state, outputPaths);

  return state;
}
