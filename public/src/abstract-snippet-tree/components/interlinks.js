import { n } from '../../utils/n.js';

const linksList = (type = '', links = []) =>
  n('details', 'interlinks', [
    n('summary', {}, n('em', {}, type)),
    n(
      'list',
      {},
      links.map((link) => {
        let href = link;
        let isURL = false;
        try {
          new URL(href);
          isURL = true;
        } catch (_) {
          href = `#${link.toLowerCase()}`;
        }

        return n('li', {}, n('a', { href, target: isURL ? '_blank' : '_self' }, link));
      }),
    ),
  ]);

export const interlinks = (snippet) => {
  const linkKeys = Object.keys(snippet).filter((key) => key.includes('links'));
  if (linkKeys.length === 0) return null;

  const linkLists = linkKeys.map((linkType) => linksList(linkType, snippet[linkType]));

  return n('div', {}, [n('div', 'interlinks-container', linkLists)]);
};
