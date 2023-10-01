function BunnyRabbit() {
  return this instanceof BunnyRabbit ? _ : _;
}
BunnyRabbit.mate = function () {};
BunnyRabbit.prototype.hop = function () {};

console.log(BunnyRabbit()); // bunny

console.log(new BunnyRabbit()); // rabbit

// inspiration: How to Draw a Bunny - Jacob Thornton
