import { describe, test, expect } from './testing.mjs';

const snippetName = prompt(
  'which story do you want to check?',
  '(snippet name with .txt extension)',
);
if (!snippetName.endsWith('.txt')) {
  alert(`no go. ${snippetName} is not a .txt snippet`);
  throw new TypeError('drabbles and twabbles should probably be .txt files');
}

const snippet = await fetch(snippetName)
  .then((res) => res.text())
  .then((snippet) => snippet.replaceAll(/\([\s]*tags:[^)]*\)/gi, ''));
const wordCount = snippet.split(/\s/).filter(Boolean).length;
const characterCount = snippet
  .split('')
  .filter((char) => /[A-Za-z]/.test(char)).length;

describe(`What is ${snippetName}?`, () => {
  test('Is it a drabble?', () => expect(wordCount).toEqual(100));
  test('Is it a twabble?', () => expect(characterCount).toEqual(100));
});

alert(
  `${snippetName} ${
    wordCount !== 100 && characterCount !== 100
      ? 'is neither a drabble nor a twabble.'
      : wordCount === 100 && characterCount === 100
      ? 'is both a drabble and a twabble.'
      : wordCount === 100
      ? 'is a drabble.'
      : 'is a twabble.'
  }`,
);

// so un-international, so brittle
