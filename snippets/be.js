console.log('%c↺ 90°', 'font-weight: bold; font-size: xx-large;');

for (const color of ['black', 'yellow', 'red']) {
  let bar = [];
  for (let height = 0; height < 10; height++) {
    let column = [];
    for (let width = 0; width < 35; width++) {
      column.push(' ');
    }
    bar.push(column);
  }
  console.log(
    `%c${bar.flatMap((column) => column.join('')).join('\n')}`,
    `background-color: ${color};`,
  );
}
