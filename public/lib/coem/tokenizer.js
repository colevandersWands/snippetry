import { CoemError, Coordinate, Token } from './helpers.js';
import { isDigit, isIdentifierChar, keywords, tokenEnum, tokenMap, tokens } from './tokens.js';

class Tokenizer {
  static get tokens() {
    return tokens;
  }

  static get tokenEnum() {
    return tokenEnum;
  }
  constructor(source) {
    this.source = source;
    this.length = source.length;
    this.tokens = [];
    this.startPosition = null;
    this.column = 0;
    this.start = 0;
    this.line = 1;
    this.current = 0;
  }

  handleStringLiterals() {
    while (this.peek() !== '\u201d' && this.peek() !== '') {
      if (this.peek() === '\n') this.newline();
      this.advance();
    }

    if (this.peek() === '') {
      throw new CoemError('Unfinished string', this.startPosition, this.endPosition);
    }

    // The closing \u201d.
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(tokenEnum.STRING, value);
  }

  handleComments() {
    this.addToken(tokenEnum.DAGGER);

    while (this.peek() !== '\n' && this.peek() !== '') {
      this.advance();
    }

    const text = this.source.substring(this.start + 1, this.current);
    this.addToken(tokenEnum.STRING, text);
  }

  handleIdentifiers() {
    while (isIdentifierChar(this.peek())) this.advance();
    const value = this.source.substring(this.start, this.current);
    if (keywords[value]) {
      this.addToken(keywords[value], value);
    } else {
      this.addToken(tokenEnum.IDENTIFIER, value);
    }
  }

  scanTokens() {
    while (this.current < this.length) {
      const c = this.advance();
      this.startPosition = new Coordinate(this.column - 1, this.line, this.current - 1);
      if (!tokenMap[c]) {
        if (isIdentifierChar(c)) {
          this.handleIdentifiers();
        } else if (isDigit(c)) {
          while (isDigit(this.peek())) this.advance();
          const value = this.source.substring(this.start, this.current);
          this.addToken(tokenEnum.NUMBER, Number(value));
        } else {
          // Column isn't -1 because we haven't iterated column yet
          throw new CoemError(
            `Unexpected character ${c}`,
            this.startPosition,
            new Coordinate(this.column, this.line, this.current),
          );
        }
      } else {
        tokenMap[c](this);
      }
      this.start = this.current;
    }
    this.addToken(tokenEnum.EOF);
    return this.tokens;
  }

  get endPosition() {
    return new Coordinate(this.column - 1, this.line, this.current);
  }

  addToken(type, literal = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(
      new Token(type, text, literal, this.endPosition, this.startPosition),
    );
  }

  newline() {
    this.line++;
    this.column = 0;
  }

  peek() {
    if (this.current >= this.length) return '';
    return this.source[this.current];
  }

  advance() {
    this.column++;
    return this.source[this.current++];
  }

  increment() {
    this.current++;
  }

  nextMatch(expected) {
    if (this.peek() !== expected) return false;
    this.increment();
    return true;
  }
}

export { Tokenizer };
