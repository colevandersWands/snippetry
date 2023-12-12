import express from 'express';
import cors from 'cors';

import comments from './public/data/comments.json' assert { type: 'json' };
import snippets from './public/data/snippets.json' assert { type: 'json' };
import snips from './public/data/snips.json' assert { type: 'json' };

// --- server setup ---

const app = express();
app.use(cors());
app.use((req, _, next) => (console.log(`${req.method} ${req.url}`), next()));
app.use(express.static('./'));

// --- define routes ---
app.get('/api', (_, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`snippetry endpoints: 

  /api/comments ? query={search string}
  /api/snippets ? query={search string} & tags={tag,tag,...}
                ? snippet={file-name.ext}
  /api/snips    ? query={search string}
  /api/tags     ? query={search string}`);
});
app.get('/api/comments', serveOther(comments));
app.get('/api/snippets', serveSnippets);
app.get('/api/snips', serveOther(snips));
app.get('/api/tags', serveOther(snippets.tags));

// --- start the server ---
const port = process.argv[2] || 4567;
app.listen(port, () => {
  console.log(`Snippetry is running on port ${port}`);
});

// ---- define handlers ----

function serveSnippets(req, res) {
  const tags = req.query.tags?.split(',').filter((tag) => tag) || [];
  const query = req.query.query?.toLowerCase() || '';

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
        snippet.name.toLowerCase().includes(query) ||
        snippet.code.toLowerCase().includes(query),
    );
  res.send(toSend);
}

function serveOther(strings = ['']) {
  return function serveData(req, res) {
    const query = req.query.query?.toLowerCase() || '';
    const toSend = strings.filter((string) => string.toLowerCase().includes(query));
    res.send(toSend);
  };
}

// tags: coAIthored
