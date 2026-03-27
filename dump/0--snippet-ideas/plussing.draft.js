const add = (a) => (b) => a + b;

class Sum {
  #a;
  constructor(a) {
    this.#a = a;
  }
  get sum() {
    return this.#a;
  }
  plus(b) {
    this.#a + b;
  }
}

// tags: comparadigms
