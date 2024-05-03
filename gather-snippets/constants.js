import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const SNIPPETS_ROOT = join(__dirname, '..', 'snippets');

export const PUBLIC_SNIPPETS = join(__dirname, '..', 'public', 'data', 'snippets.json');
export const PUBLIC_TAGS = join(__dirname, '..', 'public', 'data', 'tags.json');
export const PUBLIC_LINKS = join(__dirname, '..', 'public', 'data', 'links.json');
export const PUBLIC_LANGS = join(__dirname, '..', 'public', 'data', 'langs.json');

export const IGNORE = Object.freeze([
  '.draft',
  '.sandbox',
  '.notes',
  '.spec',
  '.mp3',
  'DS_Store',
]);
