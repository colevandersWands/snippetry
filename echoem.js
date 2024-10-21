// $ node ./run-coem.js snippet-name

import { readFile } from 'fs/promises';
import { join, normalize } from 'path';

import { run, Environment } from './public/lib/coem.js';

const coemFileName = process.argv[2];
if (!coemFileName) {
  console.log('no coem file name provided');
  process.exit();
}

const coem = await readFile(
  normalize(join(import.meta.dirname, 'snippets', coemFileName + '.coem')),
  'utf8',
);

try {
  console.log(
    '\n---------\n\n' + (await run(coem, new Environment())) + '\n\n---------\n',
  );
} catch (e) {
  console.error(e);
}
