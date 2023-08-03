import { alertStory } from './story-in-a-story.mjs';

let lang = '';
while (
  !lang &&
  lang.toLowerCase() !== 'de' &&
  lang.toLowerCase() !== 'fr' &&
  lang.toLowerCase() !== 'nl'
) {
  lang = prompt('Select your language:\n- DE\n- FR\n- NL');
}

await alertStory(
  `be.${lang.toLowerCase()}.txt`,
  'You should understand this flag:\n\n',
);

alert('Welcome to Belgium!');
