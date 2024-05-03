// 10 PRINT CHR$(205.5+RND(1)); : GOTO 10

let maze = '';
while (maze.length < 5000) {
  maze += '\\/'[+(Math.random() > 0.5)];
}
console.log(maze);
