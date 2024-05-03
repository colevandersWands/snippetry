// 10 PRINT CHR$(205.5+RND(1)); : GOTO 10

(function tenPrint(maze = '') {
  try {
    maze = tenPrint(maze + '\\/'[+(Math.random() > 0.5)]);
  } catch (_) {
    console.log(maze);
  }
})();
