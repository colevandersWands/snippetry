const defaultConfig = {
  args: [],
  frameRate: 50,
  maxTime: Infinity,
  maxFrames: Infinity,
};

const project = (frame) =>
  Array.isArray(frame) ? console.log(...frame) : console.log(frame);

export default function projector(reel, userConfig = {}) {
  const config = Object.assign({}, defaultConfig, userConfig);
  const spool = reel();

  let frames = 0;
  let time = 0;
  let intervalId;
  const unspool = () => {
    const frame = spool.next();
    if (frame.done || time > config.maxTime || frames > config.maxFrames) {
      clearInterval(intervalId);
    } else {
      console.clear();
      if (Array.isArray(frame.value)) {
        frame.value.forEach(project);
      } else {
        project(frame.value);
      }
      frames++;
      time += config.frameRate;
    }
  };

  intervalId = setInterval(unspool, config.frameRate, ...config.args);
}

// tags: minibrary
