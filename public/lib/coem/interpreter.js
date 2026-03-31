import { ReturnError, isEqual, isTruthy, runtimeError } from './helpers.js';
import { Tokenizer } from './tokenizer.js';
import {
  Binary,
  Block,
  Call,
  CoemFunction,
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
import { CoemCallable, Environment } from './environment.js';

const token = Tokenizer.tokenEnum;
const NOT = token.NOT;

class Interpreter {
  constructor(environment, source) {
    this.environment = environment || new Environment();

    this.source = source;
    this.echo = source;
    this.lines = [];
    const linesWhole = source.split('\n');
    for (let line of linesWhole) {
      if (line.trim().indexOf(' \u2020') > -1) {
        this.lines.push(line.split(' \u2020'));
      } else {
        this.lines.push([line]);
      }
    }

    const nativePrint = new CoemCallable(null, this.env);
    nativePrint.call = (interpreter, args, callee) => {
      let print = ' ';
      let line = callee.name.startCoordinates.line - 1;
      if (args.length >= 1) {
        print += getArgPrint(args[0]);
        if (args.length > 1) {
          for (let i = 1; i < args.length; i++) {
            print += ' ' + getArgPrint(args[i]);
          }
        }
      }

      if (this.lines[line].length > 1) {
        this.lines[line][1] += print;
      } else {
        this.lines[line].push(print);
      }
    };

    const getArgPrint = (arg) => {
      if (Array.isArray(arg)) {
        return arg.join(', ');
      }
      return arg;
    };

    this.environment.setBuiltin('print', nativePrint);
    this.environment.setBuiltin('know', nativePrint);
    this.environment.setBuiltin('say', nativePrint);
    this.environment.setBuiltin('respond', nativePrint);
  }

  async interpret(expr) {
    return await this.evaluate(expr);
  }

  async evaluate(expr) {
    if (this.environment?.withPatience !== 0) {
      await new Promise((res) => setTimeout(res, (this.environment.withPatience *= 1.1)));
    }

    if (expr instanceof Block) return await this.visitBlock(expr);
    else if (expr instanceof CoemFunction) return await this.visitFunction(expr);
    else if (expr instanceof Logical) return await this.visitLogical(expr);
    else if (expr instanceof Call) return await this.visitCall(expr);
    else if (expr instanceof While) return await this.visitWhile(expr);
    else if (expr instanceof Directive) return await this.visitDirective(expr);
    else if (expr instanceof Condition) return await this.visitCondition(expr);
    else if (expr instanceof VarStatement) return await this.visitVarStatement(expr);
    else if (expr instanceof Return) return await this.visitReturnStatement(expr);
    // Doesn't need its own, it can just evaluate like grouping
    else if (expr instanceof ExpressionStatement)
      return await this.visitExpressionStmt(expr);
    else if (expr instanceof Var) return await this.visitVar(expr);
    else if (expr instanceof Literal) return await this.visitLiteral(expr);
    else if (expr instanceof Maybe) return await this.visitLiteral(expr);
    else if (expr instanceof Unary) return await this.visitUnary(expr);
    else if (expr instanceof Binary) return await this.visitBinary(expr);
    else if (expr instanceof Reduce) return await this.visitReduce(expr);
  }

  async visitLiteral(expr) {
    return this.environment.inDenial && typeof expr.value === 'boolean'
      ? !expr.value
      : expr.value;
  }

  async visitExpressionStmt(expr) {
    return await this.evaluate(expr.expression);
  }

  async visitFunction(expr) {
    const fn = new CoemCallable(expr, this.environment);
    await this.environment.set(expr.name, fn);
  }

  async visitLogical(expr) {
    const left = await this.evaluate(expr.left);
    if (expr.operator.type === token.OR) {
      if (isTruthy(left)) return left;
    } else {
      if (!isTruthy(left)) return left;
    }

    return await this.evaluate(expr.right);
  }

  async visitWhile(expr) {
    while (isTruthy(await this.evaluate(expr.condition))) {
      await this.evaluate(expr.body);
    }
    return null;
  }

  async visitDirective(expr) {
    await this.environment.set(expr.name, expr.value);
    return null;
  }

  async visitComment(expr) {
    return null;
  }

  async visitReturnStatement(stmt) {
    var val = null;
    if (stmt.value) val = await this.evaluate(stmt.value);

    throw new ReturnError(val);
  }

  async visitVar(variable) {
    return this.environment.get(variable);
  }

  async visitVarStatement(variable) {
    let value = null;
    if (variable.value !== null) {
      value = await this.evaluate(variable.value);
    }
    await this.environment.set(variable.name, value);
    return null;
  }

  async visitBlock(expr) {
    await this.interpretBlock(expr.statements, new Environment(this.environment));
    return null;
  }

  async visitCondition(expr) {
    if (isTruthy(await this.evaluate(expr.condition))) {
      await this.evaluate(expr.thenBranch);
    } else if (expr.elseBranch) {
      await this.evaluate(expr.elseBranch);
    }
    return null;
  }

  async interpretBlock(statements, env) {
    const prevEnvironment = this.environment;
    try {
      this.environment = env;
      for (let stmt of statements) {
        await this.interpret(stmt);
      }
      this.environment = prevEnvironment;
    } catch (e) {
      this.environment = prevEnvironment;
      throw e;
    }
  }

  async visitCall(expr) {
    let callee = await this.evaluate(expr.callee);
    // hack: fixes function calls in palimpsests
    if (Array.isArray(callee)) callee = callee[0];

    let args = [];
    for (const argument of expr.arguments) {
      args.push(await this.evaluate(argument));
    }

    if (!callee.call) {
      throw runtimeError('Can only call functions.', expr.dash);
    }

    return await callee.call(this, args, expr.callee);
  }

  async visitUnary(expr) {
    const right = await this.evaluate(expr.right);
    switch (expr.operator.type) {
      case NOT:
        return !isTruthy(right);
    }
  }

  async visitBinary(expr) {
    const left = await this.evaluate(expr.left);
    const right = await this.evaluate(expr.right);
    switch (expr.operator.type) {
      // Equality
      case token.IS:
      case token.AM:
      case token.ARE:
        return isEqual(left, right);
    }
  }

  async visitReduce(expr) {
    if (!this.environment.withReduction) {
      return false;
    }
    let subject = await this.evaluate(expr.subject);
    if (Array.isArray(subject)) subject = subject[subject.length - 1];
    const divisor = await this.evaluate(expr.divisor);
    const n = parseInt(subject);
    if (isNaN(n) || divisor === 0) return false;
    return n % divisor === 0;
  }

  getEcho() {
    let echo = '';
    for (let i = 0; i < this.lines.length; i++) {
      if (this.lines[i].length > 1) {
        const line = this.lines[i].join(' \u2020');
        echo += line;
      } else {
        echo += this.lines[i][0];
      }
      if (i < this.lines.length - 1) {
        echo += '\n';
      }
    }
    return echo;
  }
}

// adapted from YALI.js by Daniel Berezin (danman113)

export { Interpreter };
