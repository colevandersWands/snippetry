import { n } from '../../utils/n.js';
import { ext, name } from '../../utils/titling.js';

export const header = (snippet) => {
  const titleHeader = n('h2', { id: `${snippet.title}-title` }, snippet.title);

  let titleNode = titleHeader;

  if (snippet.subtext) {
    titleNode = n('a', { href: `#${snippet.subtext}` }, titleHeader);
  }

  if (typeof snippet.figment === 'string') {
    titleNode = n('a', { href: `#${snippet.figment}` }, titleHeader);
  }

  if (snippet.metappet === true && snippet.title.toLowerCase().endsWith('.txt')) {
    titleNode = n('h2', { id: `${snippet.title}-title` }, [
      n('a', { href: `#${name(snippet.title)}` }, name(snippet.title)),
      ext(snippet.title),
    ]);
  }

  if (snippet.alt) {
    titleHeader.attributes.style = 'display: inline;';
    titleNode = n('details', {}, [
      n('summary', {}, titleNode),
      n('p', { style: 'margin-bottom: 1em;' }, snippet.alt),
    ]);
  }

  return titleNode;
};
