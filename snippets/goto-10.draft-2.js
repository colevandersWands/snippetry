// 10 PRINT CHR$(205.5+RND(1)); : GOTO 10

console.log(
  Array(25)
    .fill(Array(50).fill())
    .map((row) => row.map(() => '\\/'[+(Math.random() > 0.5)]).join(''))
    .join('\n'),
);
