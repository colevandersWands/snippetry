// >>>>>>> abandon, far more than a snippet <<<<<<<<

// use: import in an HTML file module script tag
//  no special file (sub)extension
//  can style the canvas, or embed in a page
// setup should follow the P5 API (see ?p5)
//  implement instance mode: https://github.com/processing/p5.js/wiki/Global-and-instance-mode
// can everything but setup be a mixin?
//  mixed at construction?

export default class o4 {
  #container = document.createElement('div');
  #canvas = document.createElement('canvas');
  constructor(sketch = () => {}, container) {
    try {
      this.#container =
        typeof container === 'string'
          ? document.getElementById(container)
          : container instanceof HTMLDivElement
          ? container
          : (document.body.appendChild(this.#container), this.#container);
    } catch (err) {
      console.error(err);
    }
    try {
      sketch(this);
      typeof this.setup === 'function' && (this.setup(), this.draw()); // https://p5js.org/reference/#/p5/draw
    } catch (err) {
      console.error(err);
    }
  }
  draw() {}
  setup() {}
  createCanvas(height = 0, width = 0) {
    this.#canvas =
      this.#canvas instanceof HTMLCanvasElement
        ? this.#canvas
        : document.createElement('canvas');
    this.#canvas.style.height = height;
    this.#canvas.style.width = width;
    this.#container.innerHTML = '';
    this.#container.appendChild(canvas);
  }
}

// // --- this should work (from wiki docs) ---
// {
//   const s = (sketch) => {
//     let x = 100;
//     let y = 100;

//     sketch.setup = () => {
//       sketch.createCanvas(200, 200);
//     };

//     sketch.draw = () => {
//       sketch.background(0);
//       sketch.fill(255);
//       sketch.rect(x, y, 50, 50);
//     };
//   };
//   let myp5 = new p5(s);
// }

// // --- these should all work too, from p5js.org docs ---

// {
//   let sketch = function (p) {
//     p.setup = function () {
//       p.createCanvas(100, 100);
//       p.background(0);
//     };
//   };
//   new p5(sketch, window.document.getElementById('container'));
// }
// {
//   let sketch = function (p) {
//     p.setup = function () {
//       p.createCanvas(100, 100);
//       p.background(0);
//     };
//   };
//   let node = document.createElement('div');
//   window.document.getElementsByTagName('body')[0].appendChild(node);
//   new p5(sketch, node);
// }
// {
//   let sketch = function (p) {
//     p.setup = function () {
//       p.createCanvas(100, 100);
//       p.background(0);
//     };
//   };
//   let node = document.createElement('div');
//   new p5(sketch, node);
//   window.document.getElementsByTagName('body')[0].appendChild(node);
// }
