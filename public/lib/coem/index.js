import { formatCoemError } from './helpers.js';
import { Tokenizer } from './tokenizer.js';
import { Parser } from './parser.js';
import { Environment } from './environment.js';
import { Interpreter } from './interpreter.js';

async function run(code, environment, debug = false) {
  if (!code) return;
  const tokenizer = new Tokenizer(code);
  const tokens = tokenizer.scanTokens();
  if (debug) console.log(tokens);
  const parser = new Parser(tokens);
  const statements = parser.parse();
  if (debug) console.log(statements);
  const interpreter = new Interpreter(environment, code);
  for (let statement of statements) {
    await interpreter.interpret(statement);
  }
  const echo = interpreter.getEcho();
  return echo;
}

function parse(code) {
  if (!code) return;
  const tokenizer = new Tokenizer(code);
  const tokens = tokenizer.scanTokens();
  const parser = new Parser(tokens);
  const statements = parser.parse();
  return statements;
}

export { Environment, Interpreter, Parser, Tokenizer, formatCoemError, parse, run };
