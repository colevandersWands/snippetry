import { browserGlobals } from './browser-globals.js';
import { compileDslDependencies } from '../../utils/compile-dsl-dependencies.js';

let opalInitialized = false;
const loadOpal = async () => {
  if (opalInitialized) return;
  try {
    if (!window.Opal) {
      await import('../../../../lib/opal.min.js');
      await import('../../../../lib/opal-parser.min.js');
      window.Opal.load('opal-parser');
    }
    opalInitialized = true;
  } catch (error) {
    console.error('Failed to load Opal:', error);
  }
};

export const runCode = async (snippet = {}) => {
  console.log(`\n========== ${snippet.title} ==========\n`);

  if (!window.Opal || !opalInitialized) await loadOpal();

  try {
    const toExecute = `
${browserGlobals}


${compileDslDependencies(snippet)}


# --- --- --- ---

${snippet.text}`;

    const result = window.Opal.eval(toExecute);
  } catch (error) {
    console.error('Ruby execution error:', error);
  }
};
