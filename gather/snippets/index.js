import { processPipeline } from './pipeline/index.js';
import {
  PUBLIC_SNIPPETS,
  PUBLIC_TAGS,
  PUBLIC_LINKS,
  PUBLIC_LANGS,
  SNIPPETS_ROOT,
} from '../constants.js';

async function main() {
  try {
    await processPipeline(SNIPPETS_ROOT, {
      PUBLIC_SNIPPETS,
      PUBLIC_TAGS,
      PUBLIC_LINKS,
      PUBLIC_LANGS,
    });
    console.log('------ done gathering snippets ------');
  } catch (error) {
    console.error('Error processing snippets:', error);
    process.exit(1);
  }
}

main();
