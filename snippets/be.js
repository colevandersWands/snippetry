console.log('%c↺ 90°', 'font-weight: bold; font-size: xx-large;');

for (const color of ['black', 'yellow', 'red']) {
  const bar = [];
  for (let width = 0; width < 10; width++) {
    let column = '';
    for (let height = 0; height < 35; height++) {
      column += ' ';
    }
    bar.push(column);
  }
  console.log(`%c${bar.join('\n')}`, `background-color: ${color};`);
}
