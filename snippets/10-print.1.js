// 10 PRINT CHR$(205.5+RND(1)); : GOTO 10

const HEIGHT = 25;
const WIDTH = 50;

let maze = '';

for (let i = 0; i < HEIGHT; i++) 
  maze +=
    Array(WIDTH)
      .fill()
        .map(() => '\\/'[+(Math.random() > 0.5)])
          .join('') 
            + '\n';

console.log(maze);
