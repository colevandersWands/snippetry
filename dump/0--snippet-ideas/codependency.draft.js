// https://en.wikipedia.org/wiki/Codependency

class One {
  #meaning = null;
  rely(another) {
    this.#meaning = another.rely(this);
  }
}

class Another {
  #meaning = null;
  rely(one) {
    this.#meaning = one.rely(this);
  }
}
