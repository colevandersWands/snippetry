const defaultConfig = {
  frameRate: 50,
  maxTime: Infinity,
  maxFrames: Infinity,
};

// export default
const projector = (reel, userConfig = {}) => {
  const config = Object.assign({}, defaultConfig, userConfig);

  const spool = reel();

  let frames = 0;
  let time = 0;
  const unspool = () => {
    const frame = spool.next();
    if (frame.done || time > config.maxTime || frames > config.maxFrames) {
      clearInterval(intervalId);
    } else {
      console.clear();
      if (Array.isArray(frame.value)) {
        console.log(...frame.value);
      } else {
        console.log(frame.value);
      }
      frames++;
      time += config.frameRate;
    }
  };

  const intervalId = setInterval(unspool, config.frameRate);
};

// -------- practice reels ----------

function* finishes() {
  for (const letter of ['a', 'b', 'c']) {
    yield letter;
  }
}

function* endless() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

// -------- practice reeling ----------

// projector(finishes, {frameRate: 1000});
// projector(endless, { maxTime: 4000 });
// projector(endless, { maxFrames: 100 });
