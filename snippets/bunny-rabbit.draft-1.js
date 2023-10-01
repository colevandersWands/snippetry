// ear length, tooth length, foot length, fur length

const bunny = () => ({ e: 'bunny' });

class Rabbit {
  constructor(...args) {
    Object.assign(this, bunny(...args));
  }
}

console.log(new Rabbit());

// inspiration: How to Draw a Bunny - Jacob Thornton
