import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';

import comments from './public/data/comments.json' assert { type: 'json' };
import snippets from './public/data/snippets.json' assert { type: 'json' };
import snips from './public/data/snips.json' assert { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const leChat = await readFile(
  path.join(__dirname, 'snippets', 'cat-detector.be.js'),
  'utf-8',
);

// --- server setup ---

const app = express();
app.use(cors());
app.use((req, _, next) => (console.log(`${req.method} ${req.url}`), next()));
app.use(express.static('./'));

// --- define routes ---

app.get('/api', (_, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`snippetry endpoints: 

  /api/comments ? search={search string}

  /api/snippets ? search={search string} & tags={tag,tag,...}
                ? snippet={file-name.ext}
  
  /api/snippets/file-name.ext              

  /api/snips    ? search={search string}
  
  /api/tags     ? search={search string}`);
});
app.get('/api/comments', serveOther(comments));
app.get('/api/snippets', serveSnippets);
app.get('/api/snippets/:fileName', async (req, res) => {
  try {
    const code = await readFile(
      path.join(__dirname, 'snippets', req.params.fileName),
      'utf-8',
    );
    res.set('Content-Type', 'text/plain');
    res.send(code);
  } catch (err) {
    console.error(err)
    serveCat(req, res);
  }
});
app.get('/api/snips', serveOther(snips));
app.get('/api/tags', serveOther(snippets.tags));
app.get('/api/*', serveCat);

// --- start the server ---
const port = process.argv[2] || 4567;
app.listen(port, () => {
  console.log(`Snippetry is running on port ${port}`);
});

// ---- define handlers ----

function serveSnippets(req, res) {
  const tags = req.query.tags?.split(',').filter((tag) => tag) || [];
  const search = req.query.search?.toLowerCase() || '';

  if (req.query.snippet) {
    res.send(
      [
        snippets.snippets.find(
          (snippet) => snippet.name.toLowerCase() === req.query.snippet.toLowerCase(),
        ),
      ] || [],
    );
  }

  const toSend = snippets.snippets
    .filter((snippet) =>
      tags.length == 0 ? true : snippet.tags?.some((tag) => tags.includes(tag)),
    )
    .filter(
      (snippet) =>
        snippet.name.toLowerCase().includes(search) ||
        snippet.code.toLowerCase().includes(search),
    );
  res.send(toSend);
}

function serveOther(strings = ['']) {
  return function serveData(req, res) {
    const search = req.query.search?.toLowerCase() || '';
    const toSend = strings.filter((string) => string.toLowerCase().includes(search));
    res.send(toSend);
  };
}

async function serveCat(_, res) {
  console.log(leChat);
  res.set('Content-Type', 'text/plain');
  res.send(leChat);
}

// tags: coAIthored
