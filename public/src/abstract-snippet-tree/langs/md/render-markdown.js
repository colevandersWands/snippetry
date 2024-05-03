import { marked } from '../../../../lib/marked.mjs';
import { baseUrl } from '../../../../lib/marked-base-url.min.js';

const REPLACE_WITH_HASH = 'https://replace_with_hash/';

marked.use(baseUrl(REPLACE_WITH_HASH));

export const renderMarkdown = (markdown = '') =>
  marked.parse(markdown, { gfm: true }).replaceAll(REPLACE_WITH_HASH, '#');
