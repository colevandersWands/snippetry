function potato() {
  return this instanceof potato ? this.__proto__.constructor : potato;
}

console.log(`you say ${new potato().name}, I say ${potato().name}`);

// tags: pun
