const environment = {
  "+": (...args) => args.reduce((a, b) => a + b),
  "=": (...args) => args.map((a) => args[0] === a).every((a) => a === true),

  log: (...args) => (console.log(...args), args.pop()),
  prompt: (message) => prompt(message),
  alert: (message) => alert(message),
};

const reserved = {
  if: "if",
  define: "define",
  ...Object.keys(environment).reduce(
    (all, next) => ({ ...all, [next]: environment[next] }),
    {}
  ),
};

export const evaluate = (program, env = Object.assign({}, environment)) => {
  try {
    if (Array.isArray(program)) {
      if (program[0] === reserved.if) {
        const [_, condition, trueExpr, falseExpr] = program;
        return evaluate(condition, env)
          ? evaluate(trueExpr, env)
          : evaluate(falseExpr, env);
      } else if (program[0] === reserved.define) {
        if (Object.values(reserved).includes(program[1])) {
          throw new SyntaxError(
            `"${program[0]}" is reserved, you can't use it as a variable`
          );
        }
        const [_, name, value] = program;
        const evaluatedValue = evaluate(value, env);
        env[name] = evaluatedValue;
        return evaluatedValue;
      } else if (program[0] in env && typeof env[program[0]] !== "function") {
        return env[program[0]];
      } else {
        const [fn, ...args] = program.map((value) => evaluate(value, env));
        if (typeof fn === "function") {
          return fn(...args);
        } else {
          return args[args.length - 1];
        }
      }
    } else if (typeof program === "string" && program in env) {
      return env[program];
    } else if (typeof program === "string" || program === null) {
      return program;
    } else {
      throw new Error("Invalid program.");
    }
  } catch (error) {
    throw { error, program };
  }
};
