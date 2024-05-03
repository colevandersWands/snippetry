import('./projector.mjs').then(({ projector }) => {
  
  const aBeat = {
    get eat() {
      console.log(`%c💩 ${prompt('feed me!')} 💩`, 'font-size: xx-large');
    },
    get sleep() {
      const siesta = Date.now();
      while (Date.now() - siesta < 2000);
    },
    get rave() {
      const lasers = () =>  Math.random() < 0.2
          ? ['*', '@', '#', '%', '&', '!', '$'][Math.floor(Math.random() * 26)]
          : ' ';
      projector(function* lightShow() {
        while ('still standing') {
          yield Array(30).fill('')
            .map(() => [
              `%c${(() => Array(60).fill(' ').map(lasers).join(''))()}`,
              `color: #${Math.floor(Math.random() * 16777215).toString(16)}`,
            ]);
        }
      }, { maxTime: 2000, async: false });
    },
    repeat: true
  };

  
  with (aBeat) { do {

      eat;
      sleep;
      rave;         } while (
      repeat

  )}

});

// tags: sketch, reel, the fun parts

// colors credit: https://css-tricks.com/snippets/javascript/random-hex-color/