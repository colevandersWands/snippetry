import { parseError, Token } from './helpers.js';
import { Tokenizer } from './tokenizer.js';
import {
  Binary,
  Block,
  Call,
  CoemFunction,
  Comment,
  Condition,
  Directive,
  ExpressionStatement,
  Literal,
  Logical,
  Maybe,
  Reduce,
  Return,
  Unary,
  Var,
  VarStatement,
  While,
} from './ast.js';

const token$1 = Tokenizer.tokenEnum;

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
    this.isParamListStarted = false;
  }

  parse() {
    let statements = [];
    while (!this.isAtEnd) {
      while (this.check(token$1.NEWLINE)) {
        this.consume(token$1.NEWLINE, 'Expect newline between statements.');
      }
      if (!this.isAtEnd) {
        statements.push(this.declaration());
      }
    }

    return statements;
  }

  declaration() {
    if (this.match(token$1.DAGGER)) return this.comment();
    if (this.match(token$1.POUND)) return this.directive();
    if (this.match(token$1.TO)) return this.function();
    if (this.match(token$1.LET)) return this.varDeclaration();

    return this.statement();
  }

  directive() {
    if (this.match(token$1.IDENTIFIER, token$1.BE)) {
      const name = this.previous();
      const value = this.consume(
        token$1.IDENTIFIER,
        'Expect value after directive name.',
      );
      return new Directive(name, value);
    }
  }

  comment() {
    const text = this.advance();
    return new Comment(text);
  }

  function() {
    const name = this.consume(token$1.IDENTIFIER, `Expect function name.`);
    this.consume(token$1.EMDASH, `Expect '\u2014' after function name.`);
    let params = [];
    if (!this.check(token$1.EMDASH)) {
      do {
        if (params.length >= 255) {
          throw parseError("Can't have more than 255 arguments.", this.peek());
        }

        params.push(this.consume(token$1.IDENTIFIER, 'Expect identifier name.'));
      } while (this.match(token$1.COMMA));
    }
    this.consume(token$1.EMDASH, `Expect '\u2014' after arguments.`);

    this.consume(token$1.COLON, `Expect ':' before function body.`);
    const body = this.block();
    return new CoemFunction(name, params, body);
  }

  block() {
    let statements = [];

    while (this.check(token$1.NEWLINE)) {
      this.consume(token$1.NEWLINE, 'Expect newline between statements.');
    }

    while (!this.check(token$1.DOT) && !this.isAtEnd) {
      while (this.check(token$1.NEWLINE)) {
        this.consume(token$1.NEWLINE, 'Expect newline between statements.');
      }
      if (!this.check(token$1.DOT) && !this.isAtEnd) {
        statements.push(this.declaration());
      }
    }

    this.consume(token$1.DOT, "Expect '.' after block.");
    return statements;
  }

  varDeclaration() {
    const name = this.consume(token$1.IDENTIFIER, 'Expected variable name');

    let value = null;
    if (this.match(token$1.BE)) {
      value = this.expression();
    }

    return new VarStatement(name, value);
  }

  expression() {
    return this.or();
  }

  or() {
    return this.matchBinary('and', Logical, token$1.OR);
  }

  and() {
    return this.matchBinary('equality', Logical, token$1.AND);
  }

  matchBinary(method, Class, ...operators) {
    let expr = this[method]();
    while (this.match(...operators)) {
      const operator = this.previous();
      const right = this[method]();
      expr = new Class(expr, operator, right);
    }
    return expr;
  }

  equality() {
    let expr = this.unary();

    while (this.match(token$1.IS, token$1.AM, token$1.ARE)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  unary() {
    if (this.match(token$1.NOT)) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }
    return this.call();
  }

  call() {
    let expr = this.primary();
    if (!this.isParamListStarted) {
      //eslint-disable-next-line
      while (true) {
        if (this.match(token$1.EMDASH)) {
          expr = this.finishCall(expr);
        } else {
          break;
        }
      }
    }

    return expr;
  }

  primary() {
    if (this.match(token$1.FALSE)) return new Literal(false);
    if (this.match(token$1.TRUE)) return new Literal(true);
    if (this.match(token$1.NOTHING)) return new Literal(null);

    if (this.match(token$1.MAYBE)) return new Maybe();

    if (this.match(token$1.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(token$1.REDUCE)) {
      const subject = this.primary();
      this.consume(token$1.TO, "Expect 'to' after reduce subject.");
      if (!this.match(token$1.NUMBER)) {
        throw parseError('Expect number after to.', this.peek());
      }
      const divisor = new Literal(this.previous().literal);
      return new Reduce(subject, divisor);
    }

    if (this.match(token$1.IDENTIFIER)) {
      return new Var(this.previous());
    }

    throw parseError('Expect expression.', this.peek());
  }

  finishCall(callee) {
    let args = [];

    if (!this.check(token$1.EMDASH)) {
      do {
        if (args.length >= 255) {
          throw parseError("Can't have more than 255 arguments.", this.peek());
        }
        this.isParamListStarted = true;
        args.push(this.expression());
        this.isParamListStarted = false;
      } while (this.match(token$1.COMMA));
    }

    const dash = this.consume(token$1.EMDASH, "Expect '\u2014' after arguments.");

    return new Call(callee, dash, args);
  }

  statement() {
    if (this.match(token$1.IF)) return this.ifStatement();
    if (this.match(token$1.AMPERSAND)) return this.returnStatement();
    if (this.match(token$1.WHILE)) return this.whileStatement();
    if (this.match(token$1.COLON)) return new Block(this.block());

    return this.expressionStatement();
  }

  ifStatement() {
    this.consume(token$1.EMDASH, `Expect '\u2014' after 'if'.`);
    this.isParamListStarted = true;
    const cond = this.expression();
    this.consume(token$1.EMDASH, `Expect '\u2014' after if condition.`);
    this.isParamListStarted = false;

    const thenBranch = this.statement();
    let elseBranch = null;
    if (this.match(token$1.ELSE)) {
      elseBranch = this.statement();
    }

    return new Condition(cond, thenBranch, elseBranch);
  }

  returnStatement() {
    const ampersand = this.previous();
    let value = null;
    if (!this.check(token$1.NEWLINE)) {
      value = this.expression();
    }

    return new Return(ampersand, value);
  }

  whileStatement() {
    this.consume(token$1.EMDASH, `Expect '\u2014' after 'while'.`);
    this.isParamListStarted = true;
    const cond = this.expression();
    this.consume(token$1.EMDASH, `Expect '\u2014' after condition.`);
    this.isParamListStarted = false;
    const body = this.statement();

    return new While(cond, body);
  }

  expressionStatement() {
    const expr = this.expression();

    // if it's a bare expression, print the expression
    // but don't print a print statement
    let wrapped = expr;
    if (expr instanceof Call) {
      const callee = expr.callee;
      if (!callee.name === 'print') {
        wrapped = this.printExpression(expr);
      }
    } else {
      wrapped = this.printExpression(expr);
    }

    return new ExpressionStatement(wrapped);
  }

  printExpression(expr) {
    const printToken = new Token(
      token$1.IDENTIFIER,
      'print',
      null,
      this.peek().endCoordinates,
      this.peek().startCoordinates,
    );
    const printExpr = new Var(printToken);
    const dash = new Token(
      token$1.emdash,
      '\u2014',
      null,
      this.peek().endCoordinates,
      this.peek().startCoordinates,
    );
    let args = [expr];
    const call = new Call(printExpr, dash, args);
    return call;
  }

  consume(type, err) {
    if (this.check(type)) return this.advance();

    throw parseError(err, this.peek());
  }

  // Checks if current token is one of the following tokens and advances to next token
  match(...tokens) {
    for (let token of tokens) {
      if (this.check(token)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  // Verifies current token is equal to type
  check(type) {
    return !this.isAtEnd && this.peek().type === type;
  }

  get isAtEnd() {
    return this.peek().type === token$1.EOF;
  }

  // Gets current token
  peek() {
    return this.tokens[this.current];
  }

  // Gets previous token
  previous() {
    if (this.current <= 0)
      throw parseError('Expected previous but found nothing.', this.peek());
    return this.tokens[this.current - 1];
  }

  // Advances parser to the next token
  advance() {
    if (!this.isAtEnd) this.current++;
    return this.previous();
  }
}

export { Parser };
