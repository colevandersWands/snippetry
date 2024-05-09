import { alertStory } from './story-in-a-story.mjs';

let lang = '';

while (
  !lang &&
  lang.toLowerCase() !== 'de' &&
  lang.toLowerCase() !== 'en' &&
  lang.toLowerCase() !== 'fr' &&
  lang.toLowerCase() !== 'nl'
) {
  lang = prompt('- DE\n- EN\n- FR\n- NL');
}

await alertStory(`be.${lang.toLowerCase()}.txt`);

// see: be.de.txt, be.en.txt, be.fr.txt, be.nl.txt 