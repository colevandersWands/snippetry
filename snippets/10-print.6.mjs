import { projector } from './projector.mjs';

const FRAMES = 10;

const HEIGHT = 25;
const WIDTH = 50;

function* tenPrintPrintTen() {
  for (let f = 0; f < FRAMES; f++) {
    let maze = '';
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        maze += '\\/'[+(Math.random() > 0.5)];
      }
      maze += '\n';
    }
    yield maze;
  }
}

projector(tenPrintPrintTen, { frameRate: 1 });
