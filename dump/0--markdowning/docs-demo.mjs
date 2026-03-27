import rehypeStringify from './lib/rehype-stringify.bundle.mjs';
import remarkFrontmatter from './lib/remark-frontmatter.bundle.mjs';
import remarkGfm from './lib/remark-gfm.bundle.mjs';
import remarkParse from './lib/remark-parse.bundle.mjs';
import remarkRehype from './lib/remark-rehype.bundle.mjs';
import { unified } from './lib/unified.bundle.mjs';
import { visit } from './lib/unist-util-visit.bundle.mjs';
import { parse } from './lib/yaml.bundle.mjs';

const doc = `---
layout: solar-system
---

# Hi ~~Mars~~Venus!

![image-alt-text](./asdf/img.deepfake.svg)
[href-alt-text](https://badgerbadgerbadger.com)
[rel-alt-text](./badgerbadgerbadger.com)
`;

// https://stackoverflow.com/a/19709846
const isURL = new RegExp('^(?:[a-z+]+:)?//', 'i')
const isRelative = (link = '') => !isURL.test(link);

const foreLinksSet = new Set();
const file = await unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkGfm)
  .use((options) => (tree, file) => {
    console.log(tree);
    visit(tree, ['link', 'image'], (node) => {
      if (isRelative(node.url)) {
        console.log('------------');
        console.log(node.url);
        const linkPath = node.url
          .split('/')
          .filter((i) => i)
          .filter((i) => i !== '.' && i !== '..');
        console.log(linkPath);
        foreLinksSet.add(linkPath.pop());
      }
    });
  })
  .use((options) => (tree, file) => {
    console.log(tree);
  })
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(doc);

const foreLinks = Array.from(foreLinksSet).sort();

console.log(file);
console.log(foreLinks);
