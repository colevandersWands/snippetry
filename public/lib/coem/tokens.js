import { CoemError } from './helpers.js';

const noop = () => {};

const tokens = `
  COLON,
  COMMA, DOT,
  EMDASH,/
  AMPERSAND,
  POUND,
  DAGGER,

  IDENTIFIER, STRING, NUMBER,
  COMMENT,

  AND, OR,
  MAYBE,
  IS, AM, ARE,
  IF, ELSE, WHILE,
  LET, BE,
  TO,
  TRUE, FALSE, NOTHING,
  NOT,
  REDUCE,

  THIS, HERE, NOW,

  NEWLINE,

  EOF
`
  .split(',')
  .map((token) => token.trim());

let tokenEnum = {};
tokens.forEach((token, i) => {
  tokenEnum[token] = i;
});

const keywords = {
  and: tokenEnum.AND,
  or: tokenEnum.OR,
  is: tokenEnum.IS,
  am: tokenEnum.AM,
  are: tokenEnum.ARE,
  not: tokenEnum.NOT,
  true: tokenEnum.TRUE,
  false: tokenEnum.FALSE,
  maybe: tokenEnum.MAYBE,
  nothing: tokenEnum.NOTHING,
  let: tokenEnum.LET,
  be: tokenEnum.BE,
  to: tokenEnum.TO,
  if: tokenEnum.IF,
  else: tokenEnum.ELSE,
  while: tokenEnum.WHILE,
  reduce: tokenEnum.REDUCE,
};

const tokenMap = {
  '\u2014': (tokenizer) => {
    tokenizer.addToken(tokenEnum.EMDASH);
  },
  ':': (tokenizer) => {
    tokenizer.addToken(tokenEnum.COLON);
  },
  ',': (tokenizer) => {
    tokenizer.addToken(tokenEnum.COMMA);
  },
  '.': (tokenizer) => {
    tokenizer.addToken(tokenEnum.DOT);
  },
  '&': (tokenizer) => {
    tokenizer.addToken(tokenEnum.AMPERSAND);
  },
  '#': (tokenizer) => {
    tokenizer.addToken(tokenEnum.POUND);
  },
  '\u2020': (tokenizer) => {
    // comments
    tokenizer.handleComments();
  },
  ' ': noop,
  '\t': noop,
  '\r': noop,
  '\n': (tokenizer) => {
    tokenizer.addToken(tokenEnum.NEWLINE);
    tokenizer.newline();
  },
  '\u201c': (tokenizer) => {
    tokenizer.handleStringLiterals();
  },
};

const isDigit = (c) => c >= '0' && c <= '9';

const isIdentifierChar = (c) => {
  return (
    (c >= 'A' && c <= 'Z') ||
    (c >= 'a' && c <= 'z') ||
    c == '(' ||
    c == ')' ||
    c == '[' ||
    c == ']' ||
    c == '|' ||
    c == '?' ||
    c == '*' ||
    c == '+'
  );
};

export { isDigit, isIdentifierChar, keywords, tokenEnum, tokenMap, tokens };
