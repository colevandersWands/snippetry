// $ node ./run-coem.js snippet-name

import { readFile } from 'fs/promises';
import { join, normalize } from 'path';

import { run, Environment } from './public/lib/coem/index.js';

const coemFileName = process.argv[2];
if (!coemFileName) {
  console.log('no coem file name provided');
  process.exit();
}

console.log(coemFileName);

const coem = await readFile(
  normalize(join(import.meta.dirname, 'snippets', coemFileName + '.coem')),
  'utf8',
);

console.log(coem);

try {
  console.log(
    `\n|--------- BEGIN ${coemFileName}.coem ---------|\n\n\n\n\n` +
      (await run(coem, new Environment())) +
      `\n\n\n\n|--------- END ${coemFileName}.coem ---------|\n`,
  );
} catch (e) {
  console.error(e);
}

process.exit();
