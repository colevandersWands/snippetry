const project = (frame) => Array.isArray(frame)
    ? Array.isArray(frame[0])
      ? frame.forEach(project)
      : console.log(...frame)
    : console.log(frame);

const defaultConfig = {
  frame: 0, frameRate: 10, maxFrames: Infinity,
  time: 0, maxTime: Infinity,
  async: true,
  clear: console.clear,
  project,
  wrap: () => {},
};

export const projector = (reel = function* () {}, userConfig = defaultConfig) => {
  const config = Object.assign({}, defaultConfig, userConfig);
  const spool = reel(config);

  const unspool = (frame = spool.next(spool)) => frame.done ||
    (config.time += 1000 / config.frameRate) > config.maxTime ||
    ++config.frame > config.maxFrames
      ? (config.wrap(), false)
      : (config.clear && config.clear(), config.project(frame.value), true);
  
  if (config.async) {
    config.wrap || (config.wrap = () => clearInterval(screening));
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
