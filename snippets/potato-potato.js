function potato() {
  return this instanceof potato ? this.__proto__.constructor : potato;
}

alert(`you say ${new potato().name}, I say ${potato().name}`);

// tags: wuzzle
