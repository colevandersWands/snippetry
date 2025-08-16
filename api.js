const API_DOCS = `snippetry endpoints: 

  /api/comments  ? search={query}

  /api/langs     ? search={query}

  /api/links     ? search={query}
                 ? title={query}
                 ? from={query}
                   & to={query}
                   & type={query}

  /api/snippets  ? search={query} 
                   & tags={tag,tag,...}
                 ? title={title.ext}
                 / {title.ext}              

  /api/snips     ? search={query}
  
  /api/tags      ? search={query}

  /api/titles    ? search={query}
  
  /api/*       - ik stuur mijn kat -`;

//  ---  ---  ---  ---  ---  ---

import express from 'express';
import cors from 'cors';

import { SNIPPETS_ROOT } from './gather/constants.js';

import { readSnippets } from './gather/snippets_/read-snippets.js';

import comments from './public/data/comments.json' assert { type: 'json' };
import langs from './public/data/langs.json' assert { type: 'json' };
import links from './public/data/links.json' assert { type: 'json' };
import snippets from './public/data/snippets.json' assert { type: 'json' };
import snips from './public/data/snips.json' assert { type: 'json' };
import tags from './public/data/tags.json' assert { type: 'json' };

const titles = snippets.map((snippet) => snippet.title);

const rawSnippets = new Proxy(
  (await readSnippets(SNIPPETS_ROOT)).snippets.reduce(
    (all, next) => ({ ...all, [next.title.toLowerCase()]: next.text }),
    {},
  ),
  {
    get(target, key) {
      return key.toLowerCase() in target
        ? target[key.toLowerCase()]
        : target['mijn-kat.txt'];
    },
  },
);

// --- utils ---

const includes = (str = '', query = '') => str?.toLowerCase().includes(query);

// --- server setup ---

const app = express();
app.use(cors());
app.use((req, _, next) => (console.log(`${req.method} ${req.url}`), next()));
app.use(express.static('./'));

// --- define routes ---

app.get('/api', (_, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(API_DOCS);
});

app.get('/api/comments', serveOther(comments));
app.get('/api/snippets', serve(snippets));
app.get('/api/snippets/:fileName', serveRawSnippets);
app.get('/api/links', serveLinks(links));
app.get('/api/snips', serveOther(snips));
app.get('/api/tags', serveOther(tags));
app.get('/api/titles', serveOther(titles));
app.get('/api/langs', serveOther(langs));
app.get('/api/*', stuurMijnKat);

// --- start the server ---

const port = process.argv[2] || process.env.PORT || 4567;
app.listen(port, '0.0.0.0', () => {
  console.log(`Snippetry is running on port ${port}`);
});

// ---- define handlers ----

function serve(ppets) {
  return function serveSnippets(req, res) {
    const tags = req.query.tags?.split(',').filter((tag) => tag) || [];
    const search = req.query.search?.toLowerCase() || '';

    if (req.query.title) {
      const search = ppets.find(
        (snippet) => snippet.title.toLowerCase() === req.query.title.toLowerCase(),
      );

      res.send(search ? search : []);
      return;
    }

    const filteredSnippets = ppets
      .filter((snippet) =>
        tags.length === 0 ? true : snippet.tags?.some((tag) => tags.includes(tag)),
      )
      .filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(search) ||
          snippet.text.toLowerCase().includes(search),
      );
    res.send(filteredSnippets);
  };
}

function serveRawSnippets(req, res) {
  const snippet = rawSnippets[req.params.fileName];
  res.set('Content-Type', 'text/plain');
  if (snippet) {
    res.send(snippet);
  } else {
    stuurMijnKat(req, res);
  }
}

function serveOther(strings = ['']) {
  return function serveData(req, res) {
    const search = req.query.search?.toLowerCase() || '';
    const filtered = strings.filter((string) => string.toLowerCase().includes(search));
    res.send(filtered);
  };
}

function serveLinks(links = []) {
  return (req, res) => {
    if (req.query.search) {
      const search = req.query.search;
      res.send(
        links.filter(
          ({ from, to, type }) =>
            includes(from, search) || includes(to, search) || includes(type, search),
        ),
      );
    } else if (req.query.title) {
      const snippet = req.query.title.toLowerCase();
      res.send(
        links.filter(
          ({ from, to }) =>
            snippet === from.toLowerCase() || snippet === to.toLowerCase(),
        ),
      );
    } else if (req.query.from || req.query.to || req.query.type) {
      const fromQuery = req.query.from?.toLowerCase();
      const toQuery = req.query.to?.toLowerCase();
      const typeQuery = req.query.type?.toLowerCase();

      res.send(
        links.filter(
          ({ from, to, type }) =>
            (fromQuery ? includes(from, fromQuery) : true) &&
            (toQuery ? includes(to, toQuery) : true) &&
            (typeQuery ? includes(type, typeQuery) : true),
        ),
      );
    } else {
      res.send(links);
    }
  };
}

const mijnKat = rawSnippets['mijn-kat.txt']
  .split('\n')
  .map((line) => `   ${line}`)
  .join('\n');
async function stuurMijnKat(_, res) {
  // https://www.vlaanderen.be/team-taaladvies/taaladviezen/zijn-kat-sturen
  console.log('kat gestuurd');
  res.set('Content-Type', 'text/plain');
  // https://user.xmission.com/~emailbox/ascii_cats.htm
  //  -Skorch
  res.status(404);
  res.send(`404: kat gestuurd \n\n\n${mijnKat}`);
}

// tags: coAIthored
