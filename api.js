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

  /api/comments ? search={query}

  /api/snippets ? search={query} & tags={tag,tag,...}
                ? snippet={file-name.ext}
  
  /api/snippets / {file-name.ext}              

  /api/snips    ? search={query}
  
  /api/tags     ? search={query}
  
  /api/*        - ik stuur mijn kat -`);
});
app.get('/api/comments', serveOther(comments));
app.get('/api/snippets', serveSnippets);
app.get('/api/snippets/:fileName', async (req, res) => {
  const snippet = snippets.snippets.find(
    (snippet) => snippet.name.toLowerCase() === req.params.fileName,
  );

  res.set('Content-Type', 'text/plain');
  if (snippet) {
    res.send(snippet.code);
  } else {
    stuurMijnKat(req, res);
  }
});
app.get('/api/snips', serveOther(snips));
app.get('/api/tags', serveOther(snippets.tags));
app.get('/api/*', stuurMijnKat);

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
    const search = snippets.snippets.find(
      (snippet) => snippet.name.toLowerCase() === req.query.snippet.toLowerCase(),
    );

    res.send(search ? search : []);
    return;
  }

  const filteredSnippets = snippets.snippets
    .filter((snippet) =>
      tags.length == 0 ? true : snippet.tags?.some((tag) => tags.includes(tag)),
    )
    .filter(
      (snippet) =>
        snippet.name.toLowerCase().includes(search) ||
        snippet.code.toLowerCase().includes(search),
    );
  res.send(filteredSnippets);
}

function serveOther(strings = ['']) {
  return function serveData(req, res) {
    const search = req.query.search?.toLowerCase() || '';
    const filtered = strings.filter((string) => string.toLowerCase().includes(search));
    res.send(filtered);
  };
}

const mijnKat = `
      /\\
      \\ \\
       \\ \\
       / /
      / /
     _\\ \\_/\\/\\
    /  *  \\@@ =
   |       |Y/
   |       |~
    \\ /_\\ /
     \\\\ //
      |||
     _|||_
    ( / \\ )
`;
async function stuurMijnKat(_, res) {
  // https://www.vlaanderen.be/team-taaladvies/taaladviezen/zijn-kat-sturen
  console.log('kat gestuurd');
  res.set('Content-Type', 'text/plain');
  // https://user.xmission.com/~emailbox/ascii_cats.htm
  //  -Skorch
  res.status(404);
  res.send(`404: kat gestuurd \n ${mijnKat}`);
}

// tags: coAIthored
