import('./projector.mjs').then(({ projector }) => {
  const vagueRecollection = {
    get eat() {
      console.log(`%c💩 ${prompt('feed me!')} 💩`, 'font-size: xx-large');
    },
    get sleep() {
      const siesta = Date.now();
      while (Date.now() - siesta < 5000);
    },
    get rave() {
      const lasers = () =>
        Math.random() < 0.2
          ? ['*', '@', '#', '%', '&', '!', '$'][Math.floor(Math.random() * 26)]
          : ' ';
      function* lightShow() {
        while ('still standing')
          yield Array(30)
            .fill('')
            .map(() => [
              `%c${(() => Array(60).fill(' ').map(lasers).join(''))()}`,
              // https://css-tricks.com/snippets/javascript/random-hex-color/
              `color: #${Math.floor(Math.random() * 16777215).toString(16)}`,
            ]);
      }
      projector(lightShow, { maxTime: 10000, async: false });
    },
  };
  const repeat = true;

  // --- eat, sleep, rave, repeat ---

  with (vagueRecollection) {
    do {
      eat;
      sleep;
      rave;
    } while (repeat);
  }
});

// tags: sketch, reel
