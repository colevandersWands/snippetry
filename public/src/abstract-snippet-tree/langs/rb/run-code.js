import { initializeBrowserAPI } from './browser-api.js';

let opalInitialized = false;

const ensureOpalLoaded = async () => {
  if (opalInitialized) return;

  try {
    // Check if Opal is already loaded
    if (!window.Opal) {
      // Load Opal core
      await import('../../../../lib/opal.min.js');

      // Load Opal parser
      await import('../../../../lib/opal-parser.min.js');

      // Initialize the parser
      window.Opal.load('opal-parser');
    }

    // Initialize Ruby browser API
    initializeBrowserAPI();

    opalInitialized = true;
  } catch (error) {
    console.error('Failed to load Opal:', error);
    throw error;
  }
};

export const runCode = async (snippet = {}) => {
  console.log(`\n========== ${snippet.title} ==========\n`);

  try {
    // Ensure Opal is loaded
    await ensureOpalLoaded();

    // Execute the Ruby code
    const result = window.Opal.eval(snippet.text);

    return result;
  } catch (error) {
    console.error('Ruby execution error:', error.toString());

    // Re-throw to show in UI if needed
    throw error;
  }
};
