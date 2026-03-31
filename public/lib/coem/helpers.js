// https://cdn.jsdelivr.net/gh/coem-lang/jscoem@428534249b0e91156f8aa55defe5bc2251a8f061/dist/coem.js

const nullable = (str) => (str ? str : '');

class CoemError {
  constructor(msg, startCoordinates, endCoordinates) {
    this.msg = msg;
    this.startCoordinates = startCoordinates;
    this.endCoordinates = endCoordinates;
  }

  toString() {
    return this.msg;
  }
}

class RuntimeError extends CoemError {
  constructor(msg, token) {
    super(
      `${nullable(token.lexeme && `at "${token.lexeme}": `)}${msg}`,
      token.startCoordinates,
      token.endCoordinates,
    );
  }
}

class ReturnError {
  constructor(val) {
    this.value = val;
  }
}

const parseError = (msg, token) => {
  if (token.type === token.EOF) {
    return new CoemError(msg, token.startCoordinates, token.endCoordinates);
  } else {
    return new CoemError(
      `${nullable(token.lexeme && `at "${token.lexeme}": `)}${msg}`,
      token.startCoordinates,
      token.endCoordinates,
    );
  }
};

const runtimeError = (msg, token) => new RuntimeError(msg, token);

const formatCoemError = (e, code) => {
  if (e instanceof CoemError) {
    const frontIndex = code.lastIndexOf('\n', e.startCoordinates.index);
    const preErrorStart = frontIndex < 0 ? 0 : frontIndex;
    const preErrorSection = code.substring(preErrorStart, e.startCoordinates.index);

    // Error String
    const errorSection = code.substring(e.startCoordinates.index, e.endCoordinates.index);

    // Post Error String
    const backIndex = code.indexOf('\n', e.endCoordinates.index);
    const postErrorStart = backIndex < 0 ? code.length : backIndex;
    const postErrorSection = code.substring(e.endCoordinates.index, postErrorStart);

    // Print Critical Code
    const errorType = e instanceof RuntimeError ? 'Runtime Error' : 'Parse Error';
    return {
      oneLiner: `${errorType}: ${e.toString()} at ${e.endCoordinates.line}:${
        e.endCoordinates.col + 1
      }`,
      preErrorSection,
      errorSection,
      postErrorSection,
    };
  } else {
    return {
      oneLiner: `Unexpected javascript Error: ${e}`,
    };
  }
};

const isTruthy = (val) => Boolean(val);
const isEqual = (a, b) => {
  if (Array.isArray(a) && !Array.isArray(b)) return a[a.length - 1] === b;
  if (!Array.isArray(a) && Array.isArray(b)) return a === b[b.length - 1];
  if (Array.isArray(a) && Array.isArray(b)) return JSON.stringify(a) === JSON.stringify(b);
  return a === b;
};

class Coordinate {
  constructor(col, line, index) {
    this.col = col;
    this.line = line;
    this.index = index;
  }
}

class Token {
  constructor(type, lexeme, literal, endCoordinates, startCoordinates) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.startCoordinates = startCoordinates;
    this.endCoordinates = endCoordinates;
  }
}

export {
  CoemError,
  Coordinate,
  ReturnError,
  RuntimeError,
  Token,
  formatCoemError,
  isEqual,
  isTruthy,
  nullable,
  parseError,
  runtimeError,
};
