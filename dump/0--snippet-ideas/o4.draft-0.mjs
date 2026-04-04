// ?? prefer working in an HTML file
//  no special file (sub)extension
//  can style the canvas, or embed in a page

/* Minimal p5 polyfill

This is a very minimal bit of polyfill code for when you want to use some basic p5.js code you wrote, but not pay the performance cost associated with importing the whole kitchen sink.

It basically implements some of the sintactic sugar I use the most from p5.js but using the Canvas api, so that I have the p5 api but without all the magic I'm probably not using in this particular sketch.

https://gist.github.com/notwaldorf/e63ea117011ac059a258776d65b6ffc3

*/

// Add this object somewhere before your p5.js code.
let context;
// what's a better way to get the canvas into P?
const p = {
  PI: Math.PI,
  HALF_PI: Math.PI / 2,
  random: (a, b) => {
    if (a !== undefined && b !== undefined) {
      return Math.floor(Math.random() * b) + a;
    } else {
      // Assume a is an array.
      const i = Math.floor(Math.random() * a.length);
      return a[i];
    }
  },
  fill: (c) => (context.fillStyle = c),
  stroke: (c) => (context.strokeStyle = c),
  noFill: () => (context.fillStyle = 'transparent'),
  noStroke: () => (context.strokeStyle = 'transparent'),
  push: () => context.save(),
  pop: () => context.restore(),
  translate: (x, y) => context.translate(x, y),
  scale: (x, y) => context.scale(x, y),
  rect: (x, y, w, h) => {
    context.fillRect(x, y, w, h);
    context.strokeRect(x, y, w, h);
  },
  circle: (x, y, d) => {
    context.beginPath();
    context.arc(x, y, d / 2, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
  },
  arc: (x, y, w, h, start, stop, slice = false) => {
    context.beginPath();
    if (!slice) {
      context.moveTo(x, y);
    }
    context.arc(x, y, w / 2, start, stop);
    context.closePath();
    context.fill();
    context.stroke();
  },
};

// -------------------------- using it --------------------------

// Write your p5.js code in slightly bastardized "instance" mode:
function sketch(p) {
  setup();

  function setup() {
    // ...
    // If you need a drawing loop you could add this in a requestAnimationFrame.
    draw();
  }

  function draw() {
    p.fill('red');
    p.rect(0, 0, p.width, p.height);

    p.push();
    // Center.
    p.translate(p.width / 2, p.height);
    // This is an obviously contrived example.
    p.arc(0, 0, 40, 40, 0, p.HALF_PI);
    p.pop();

    // etc.
  }
}

// And then instantiate the instance mode. This looks way simpler than the p5.js instance mode
// because I'm assuming you know where your canvas lives already. I sure do.
sketch(p);

// ----- from ?--p5 -----

// function setup() {
//   createCanvas(700, 500);
// }

// function draw() {
//   background(220);
// }
