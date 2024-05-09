const stack = (fn) => (names) =>
  names.length === 0
    ? fn
    : stack
      ({ [names[0]]: (...args) => fn(...args) }[names[0]]) 
      (names.slice(1));

stack
  (function busted() { yolo; })
  (['too', 'bad', 'so', 'sad'])
  ();
 