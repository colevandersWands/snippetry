export class ScopeStack {
  #stack;

  constructor(stack = []) {
    this.#stack = stack;
  }

  get stack() {
    return this.#stack.map((scope) => ({ ...scope }));
  }

  pushScope(newScope = {}) {
    this.#stack.push(newScope);
    return { ...newScope };
  }
  popScope() {
    if (this.#stack.length === 0) {
      throw new RangeError("cannot pop scope from an empty stack");
    }
    return { ...this.#stack.pop() };
  }

  #findInStack(identifier = "") {
    const maybeFound = [...this.#stack]
      .reverse()
      .find((scope) => identifier in scope);
    if (maybeFound) {
      return JSON.parse(JSON.stringify(maybeFound[identifier]));
    } else {
      return undefined;
      // throw new ReferenceError(`'${identifier}' is not defined`);
    }
  }


  read(identifier = "") {
    if (this.#stack.length === 0) {
      throw new RangeError("cannot read from an empty scope stack");
    }
    return this.#findInStack(identifier);
  }

  write(identifier = "", value) {
    if (this.#stack.length === 0) {
      throw new RangeError("cannot write to an empty scope stack");
    }
    return JSON.parse(
      JSON.stringify((this.#stack[this.#stack.length - 1][identifier] = value))
    );
  }
}
