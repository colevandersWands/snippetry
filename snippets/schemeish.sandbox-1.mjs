import schemeish, { define, eq, cond, plus, otherwise, not } from './schemeish.draft.mjs';

const { run } = schemeish();

const program = [
  [define, ['$getACat', '$message'],
    [[define, '$maybe', [prompt, '$message']],
    [cond, [
        [eq, '$maybe', null],
          [[alert, 'there is no escape'], ['$getACat', '$message']]],
        [[not, [eq, '$maybe', 'cat']],
          [[alert, [plus, "'", '$maybe', "' is not cat"]], ['$getACat', '$message']]],
        [otherwise, ['$maybe']]]]],

  ['$getACat', "'cat' please"],

  [alert, 'thank you for the cat']
];

console.log(program())

run(program);
