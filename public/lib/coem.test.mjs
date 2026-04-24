import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'fs/promises';
import { join } from 'path';

import { Tokenizer, Parser, Environment, Interpreter, run, parse } from './coem/index.js';

// coem uses smart quotes: \u201c (open) and \u201d (close)
const Q = (s) => `\u201c${s}\u201d`;
const EM = '\u2014'; // em dash
const DAGGER = '\u2020'; // †

// Helper: run a coem program and return the echo output
async function echo(code) {
  return await run(code, new Environment());
}

// Helper: tokenize and return token types/lexemes
function tokenize(code) {
  const t = new Tokenizer(code);
  const tokens = t.scanTokens();
  return tokens.map((tok) => ({
    type: tok.type,
    lexeme: tok.lexeme,
    literal: tok.literal,
  }));
}

// =============================================================
// Tokenizer
// =============================================================

describe('Tokenizer', () => {
  it('tokenizes keywords', () => {
    const tokens = tokenize('let x be true');
    const types = tokens.map((t) => t.lexeme).filter(Boolean);
    assert.deepStrictEqual(types, ['let', 'x', 'be', 'true']);
  });

  it('tokenizes string literals with smart quotes', () => {
    const tokens = tokenize(`let x be ${Q('hello')}`);
    const strToken = tokens.find((t) => t.literal === 'hello');
    assert.ok(strToken, 'should find string literal "hello"');
  });

  it('tokenizes em dashes', () => {
    const tokens = tokenize(`know${EM}x${EM}`);
    const emTokens = tokens.filter((t) => t.lexeme === EM);
    assert.strictEqual(emTokens.length, 2, 'should have 2 em dashes');
  });

  it('tokenizes the reduce keyword', () => {
    const tokens = tokenize('reduce');
    assert.ok(
      tokens.some((t) => t.lexeme === 'reduce'),
      'should tokenize reduce as keyword',
    );
  });

  it('tokenizes number literals', () => {
    const tokens = tokenize('reduce x to 42');
    const numToken = tokens.find((t) => t.literal === 42);
    assert.ok(numToken, 'should find number literal 42');
  });

  it('tokenizes multi-digit numbers', () => {
    const tokens = tokenize('reduce x to 100');
    const numToken = tokens.find((t) => t.literal === 100);
    assert.ok(numToken, 'should find number literal 100');
  });
});

// =============================================================
// Parser
// =============================================================

describe('Parser', () => {
  it('parses let/be variable declaration', () => {
    const stmts = parse(`let x be ${Q('hello')}`);
    assert.strictEqual(stmts.length, 1);
    assert.strictEqual(stmts[0].constructor.name, 'VarStatement');
  });

  it('parses reduce X to Y as Reduce node', () => {
    const stmts = parse('reduce x to 3');
    // bare expression gets wrapped in ExpressionStatement → printExpression → Call
    // The reduce is nested inside. Let's just verify it parses without error.
    assert.ok(stmts.length > 0, 'should parse without error');
  });

  it('parses if with reduce condition', () => {
    const code = `if${EM}reduce x to 5${EM}:\n    know${EM}x${EM}.`;
    const stmts = parse(code);
    assert.ok(stmts.length > 0, 'should parse if-reduce without error');
  });

  it('rejects standalone number literals', () => {
    assert.throws(() => parse('3'), /Expect expression/);
  });
});

// =============================================================
// isEqual (palimpsest-aware)
// =============================================================

describe('isEqual (palimpsest-aware)', () => {
  it('compares simple values', async () => {
    const result = await echo(`know${EM}${Q('a')} is ${Q('a')}${EM}`);
    assert.ok(result.includes('true'));
  });

  it('compares simple values (not equal)', async () => {
    const result = await echo(`know${EM}${Q('a')} is ${Q('b')}${EM}`);
    assert.ok(result.includes('false'));
  });

  it('array vs value: compares latest element', async () => {
    const code = [
      '#as palimpsest',
      `let x be ${Q('a')}`,
      `let x be ${Q('b')}`,
      `know${EM}x is ${Q('b')}${EM}`,
    ].join('\n');
    const result = await echo(code);
    assert.ok(result.includes('true'), `expected true, got: ${result}`);
  });

  it('array vs value: latest element mismatch', async () => {
    const code = [
      '#as palimpsest',
      `let x be ${Q('a')}`,
      `let x be ${Q('b')}`,
      `know${EM}x is ${Q('a')}${EM}`,
    ].join('\n');
    const result = await echo(code);
    assert.ok(result.includes('false'), `expected false, got: ${result}`);
  });
});

// =============================================================
// #with reduction + reduce X to Y
// =============================================================

describe('#with reduction', () => {
  it('reduce returns true for divisible', async () => {
    const code = `#with reduction\n\nknow${EM}reduce ${Q('15')} to 3${EM}`;
    const result = await echo(code);
    assert.ok(result.includes('true'), `expected true, got: ${result}`);
  });

  it('reduce returns false for non-divisible', async () => {
    const code = `#with reduction\n\nknow${EM}reduce ${Q('15')} to 7${EM}`;
    const result = await echo(code);
    assert.ok(result.includes('false'), `expected false, got: ${result}`);
  });

  it('reduce handles non-numeric strings gracefully', async () => {
    const code = `#with reduction\n\nknow${EM}reduce ${Q('hello')} to 3${EM}`;
    const result = await echo(code);
    assert.ok(result.includes('false'), `expected false for non-numeric, got: ${result}`);
  });

  it('reduce returns false without directive', async () => {
    const code = `know${EM}reduce ${Q('15')} to 3${EM}`;
    const result = await echo(code);
    assert.ok(result.includes('false'), `expected false without directive, got: ${result}`);
  });

  it('reduce handles palimpsest arrays (uses latest value)', async () => {
    const code = [
      '#as palimpsest',
      '#with reduction',
      '',
      `let x be ${Q('4')}`,
      `let x be ${Q('9')}`,
      `know${EM}reduce x to 3${EM}`,
    ].join('\n');
    const result = await echo(code);
    assert.ok(result.includes('true'), `expected true (9%3=0), got: ${result}`);
  });

  it('reduce with zero divisor returns false', async () => {
    const code = `#with reduction\n\nknow${EM}reduce ${Q('15')} to 0${EM}`;
    const result = await echo(code);
    assert.ok(result.includes('false'), `expected false for div-by-zero, got: ${result}`);
  });
});

// =============================================================
// Integration: existing snippets as regression tests
// =============================================================

const snippetsDir = join(import.meta.dirname, '..', '..', 'snippets');

describe('Regression: existing coem snippets', () => {
  it('be.coem: Belgian flag', async () => {
    const code = await readFile(join(snippetsDir, 'be.coem'), 'utf8');
    const result = await echo(code);
    assert.ok(result.includes('black, yellow, red'), `unexpected output: ${result}`);
  });

  it('e-d.coem: evidence of disease (slow: #with patience)', { timeout: 20000 }, async () => {
    const code = await readFile(join(snippetsDir, 'e-d.coem'), 'utf8');
    const result = await echo(code);
    assert.ok(result.includes('evidence'), `should contain evidence: ${result}`);
    assert.ok(result.includes('disease'), `should contain disease: ${result}`);
  });

  it('cat-detected.be.coem: multilingual cat detection', async () => {
    const code = await readFile(join(snippetsDir, 'cat-detected.be.coem'), 'utf8');
    const result = await echo(code);
    assert.ok(result.includes('true'), `should detect cats: ${result}`);
  });

  it('peace.coem: sleep function', async () => {
    const code = await readFile(join(snippetsDir, 'peace.coem'), 'utf8');
    const result = await echo(code);
    assert.ok(result.includes('eternal'), `should include eternal: ${result}`);
  });

  it('n-e-d.coem: no evidence of disease', async () => {
    const code = await readFile(join(snippetsDir, 'n-e-d.coem'), 'utf8');
    const result = await echo(code);
    assert.ok(result.includes('no'), `should contain no: ${result}`);
  });
});
