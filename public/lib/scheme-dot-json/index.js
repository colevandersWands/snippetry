import { ScopeStack } from './scope-stack.js';

import { environment } from './environment.js';
import { reserved } from './reserved.js';

// big todo: strings vs. variables
// can keep track of path to each subprogram in case of logs or errors?
export const evaluate = (
  program,
  { env = Object.assign({}, environment), scopes = new ScopeStack([{}]) } = {},
) => {
  let evaluated;
  try {
    if (Array.isArray(program)) {
      let logValue = false;
      // cleaner way to do this?
      if (program[0] === reserved.pipeLog) {
        logValue = true;
        program.shift();
      }
      if (
        typeof program[0] === 'string' &&
        program[0].startsWith(reserved.commentProgram)
      ) {
        return undefined;
      }
      program = program
        .filter((value) =>
          typeof value === 'string' ? !value.startsWith(reserved.comment) : true,
        )
        .filter((value) => value !== undefined);

      if (program[0] === 'list') {
        return program;
      } else if (program[0] === reserved.if) {
        const [_, condition, trueExpr, falseExpr] = program;
        evaluated = evaluate(condition, { env, scopes })
          ? evaluate(trueExpr, { env, scopes })
          : evaluate(falseExpr, { env, scopes });
      } else if (program[0] === reserved.cond) {
        const [_, ...clauses] = program;
        for (const [predicate, consequent] of clauses) {
          if (predicate === 'else') {
            return evaluate(consequent, { env, scopes });
          }
          if (evaluate(predicate, { env, scopes })) {
            return evaluate(consequent, { env, scopes });
          }
        }
        return undefined;
      } else if (program[0] === reserved.define) {
        if (Object.values(reserved).includes(program[1])) {
          throw new SyntaxError(
            `"${program[0]}" is reserved, you can't use it as a variable`,
          );
        }
        if (Array.isArray(program[1])) {
          const [_, [name, ...params], body] = program;
          const entry = { params, body };
          scopes.write(name, entry);
          evaluated = name;
        } else {
          const [_, name, value] = program;
          const evaluatedValue = evaluate(value, { env, scopes });
          scopes.write(name, evaluatedValue);
          evaluated = evaluatedValue;
        }
      } else if (scopes.read(program[0]) !== undefined) {
        const value = scopes.read(program[0]);
        if (Object(value) === value) {
          const [_, ...args] = program;
          const { params, body } = value;
          const subProgram = [
            ...params.map((param, i) => ['define', param, args[i]]),
            body,
          ];
          scopes.pushScope({});
          evaluated = evaluate(subProgram, { env, scopes });
          scopes.popScope();
        } else {
          evaluated = value;
        }
      } else if (program[0] in env && typeof env[program[0]] !== 'function') {
        evaluated = env[program[0]];
      } else {
        const results = program
          .map((value) => evaluate(value, { env, scopes }))
          .filter((value) => value !== undefined);
        if (typeof results[0] === 'function') {
          const [fn, ...args] = results;
          evaluated = fn(...args);
        } else {
          evaluated = results[results.length - 1];
        }
      }
      if (logValue) {
        console.log(evaluated);
      }
    } else if (
      // when the program is only one comment string with no brackets
      //  should never happen when a comment is inside a program
      typeof program === 'string' &&
      program.startsWith(reserved.comment)
    ) {
      evaluated = undefined;
    } else if (typeof program === 'string' && scopes.read(program) !== undefined) {
      evaluated = scopes.read(program);
    } else if (typeof program === 'string' && program in env) {
      evaluated = env[program];
    } else if (
      typeof program === 'string' ||
      typeof program === 'number' ||
      typeof program === 'boolean' ||
      program === null
    ) {
      evaluated = program;
    } else if (program === undefined) {
      return undefined;
    } else {
      throw new Error('Invalid program.');
    }
  } catch (error) {
    throw { error: error.error || error, program, stack: scopes.stack };
  }

  return evaluated;
};
