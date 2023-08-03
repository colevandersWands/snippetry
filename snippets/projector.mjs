const project = (frame) =>
  Array.isArray(frame)
    ? Array.isArray(frame[0])
      ? frame.forEach(project)
      : console.log(...frame)
    : console.log(frame);

const defaultConfig = {
  async: true,
  frameRate: 10,
  maxTime: Infinity,
  maxFrames: Infinity,
  clear: console.clear,
  project,
  wrap: () => {},
};

export const projector = (reel, userConfig = {}) => {
  const spool = reel();
  const config = Object.assign({}, defaultConfig, userConfig);
  const status = { frames: 0, time: 0 };

  const unspool = (frame = spool.next()) =>
    frame.done ||
    (status.time += 1000 / config.frameRate) > config.maxTime ||
    ++status.frames > config.maxFrames
      ? (config.wrap(), false)
      : (config.clear(), config.project(frame.value), true);

  if (config.async) {
    config.wrap = () => clearInterval(screening);
    const screening = setInterval(unspool, 1000 / config.frameRate);
  } else {
    while (unspool()) {
      const frameStart = Date.now();
      while (Date.now() - frameStart < 1000 / config.frameRate);
    }
  }
};

export default projector;

// tags: minibrary
