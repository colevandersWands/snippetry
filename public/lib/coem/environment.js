import { CoemError, ReturnError, runtimeError } from './helpers.js';

class RegexMap {
  #map = new Map();
  set(regexKey, value) {
    if (!(regexKey instanceof RegExp || typeof regexKey === 'string')) {
      throw new TypeError('RegexMap key must be a string or an instance of RegExp');
    }

    this.#map.set(regexKey instanceof RegExp ? regexKey.source : regexKey, value);

    return this;
  }
  entries() {
    const entries = Array.from(this.#map.entries());
    for (const entry of entries) entry[0] = new RegExp(entry[0]);
    return new Map(entries).entries();
  }
}

class CoemCallable {
  constructor(declaration, closure) {
    this.declaration = declaration;
    this.closure = closure;
  }

  async call(interpreter, args, callee) {
    const env = new Environment(this.closure);
    for (let param = 0; param < this.declaration.params.length; param++) {
      await env.set(this.declaration.params[param], args[param]);
    }
    try {
      await interpreter.interpretBlock(this.declaration.bodyStatements, env);
    } catch (ret) {
      if (ret instanceof ReturnError) {
        return ret.value;
      } else {
        throw ret;
      }
    }
    return null;
  }

  toString() {
    return `<${this.declaration.name.lexeme}()>`;
  }
}

class Environment {
  constructor(enclosing = null) {
    // regex var names didn't work as palimpsest
    //  refactor: treat all names as regex, using .source in map wrapper
    this.values = new RegexMap();
    this.enclosing = enclosing;

    // Directive flags inherit from enclosing environment (directives are program-wide)
    this.asPalimpsest = enclosing ? enclosing.asPalimpsest : false;
    this.inDialogue = enclosing ? enclosing.inDialogue : false;
    this.inDenial = enclosing ? enclosing.inDenial : false;
    this._Allusion = enclosing ? enclosing._Allusion : false;
    this.withPatience = enclosing ? enclosing.withPatience : 0;
    this.withReduction = enclosing ? enclosing.withReduction : false;
  }

  get(token) {
    const set = this.getSet(token.name.lexeme);
    if (set) {
      return set[1];
    }

    // if not found in this environment, try enclosing one
    if (this.enclosing) return this.enclosing.get(token);

    // return the variable name as a string
    return token.name.lexeme;

    // if not found after recursively walking up the chain, throw error
    // throw runtimeError(`Undefined variable '${token.name.lexeme}'.`, token.name);
  }

  getSet(name) {
    // check each regex against name
    for (const [key, value] of this.values.entries()) {
      if (
        key.test(name.source ? name.source : name) ||
        key.source === (name.source ? name.source : name)
      ) {
        return [key, value];
      }
    }
    return null;
  }

  async set(token, value) {
    return await this.setNameValue(token.lexeme, value);
  }

  async setNameValue(name, value) {
    if (name === 'as' && value.literal === 'palimpsest') {
      this.asPalimpsest = true;
      return;
    }
    if (name === 'in' && value.literal === 'dialogue') {
      // hack: "receive" (reception theory), "respond/se" (reader-response theory), ...
      const _prompt = new CoemCallable(null, this.env);

      if (typeof globalThis.prompt === 'function') {
        _prompt.call = (interpreter, args, callee) => prompt(args.join(', ')) || '';
      } else if (typeof globalThis.require === 'function' && globalThis.process) {
        try {
          const readline = require('readline');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          _prompt.call = async (interpreter, args, callee) =>
            await new Promise((res) => rl.question(args.join(', '), res));
        } catch (err) {
          console.error(err);
          _prompt.call = (interpreter, args, callee) => args.join(', ');
        }
      } else {
        try {
          const readline = await import('readline');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          _prompt.call = async (interpreter, args, callee) =>
            await new Promise((res) => rl.question(args.join(', ') + '\n: ', res));
        } catch (err) {
          // console.error(err);
          _prompt.call = (interpreter, args, callee) => args.join(', ');
        }
      }

      this.setBuiltin('input', _prompt);
      this.setBuiltin('learn', _prompt);
      this.setBuiltin('listen', _prompt);
      this.setBuiltin('receive', _prompt);

      return;
    }
    if (name === 'with' && value.literal === 'patience') {
      this.withPatience = 500;
      return;
    }
    if (name === 'with' && value.literal === 'reduction') {
      this.withReduction = true;
      return;
    }
    if (name === 'in' && value.literal === 'denial') {
      this.inDenial = true;
      return;
    }
    if (name === '_' && value.literal === 'allusion') {
      this._Allusion = true;
      return;
    }

    const pattern = new RegExp(name);

    // redefine in current environment
    const set = this.getSet(pattern);
    if (set) {
      if (this.asPalimpsest) {
        let values = set[1];
        if (Array.isArray(value)) {
          values.push(...value);
        } else {
          values.push(value);
        }
        return this.values.set(set[0], values);
      } else {
        return this.values.set(set[0], value);
      }
    }

    if (this.enclosing) {
      // walk the entire enclosing chain to find a matching variable
      let ancestor = this.enclosing;
      while (ancestor) {
        let ancestorSet = ancestor.getSet(pattern);
        if (ancestorSet) {
          return await ancestor.setNameValue(pattern, value);
        }
        ancestor = ancestor.enclosing;
      }
    }

    // define new in current environment
    if (this.asPalimpsest) {
      this.values.set(name, Array.isArray(value) ? [...value] : [value]);
    } else {
      this.values.set(name, value);
    }
  }

  setBuiltin(name, value) {
    this.values.set(name, value);
  }
}

// Environment.asPalimpsest = false; // hack

export { CoemCallable, Environment, RegexMap };
