import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// ---------- file path constants ----------

const COMMENTS_ROOT = join('comments');

const PUBLIC_COMMENTS = join('public', 'data', 'comments.json');

// ---------- build array of comment objects ----------

const commentFileNames = await readdir(COMMENTS_ROOT);

const commentCode = await Promise.all(
  commentFileNames.map((fileName) => readFile(join(COMMENTS_ROOT, fileName), 'utf-8')),
);

// ---------- format comments ----------

const comments = commentFileNames.map((_, i) => commentCode[i]);

// ---------- write comment data to public folder ----------

await writeFile(
  PUBLIC_COMMENTS,
  JSON.stringify(comments, null),
  (err) => err && console.error(err),
);

console.log('------ done gathering comments ------');
