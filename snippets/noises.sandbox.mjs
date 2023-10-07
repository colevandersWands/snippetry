import noises from './noises.mjs';

const { play, stop } = noises();

// https://www.the-art-of-web.com/javascript/creating-sounds/#section_4q
play({ frequency: 587.3 }).stop(250);
play({ frequency: 587.3, delay: 300 }).stop(350);
play({ frequency: 659.3, delay: 400 }).stop(550);
play({ frequency: 587.3, delay: 600 }).stop(750);
play({ frequency: 784.0, delay: 800 }).stop(950);
// play({ frequency: 740.0, delay: 1000 }).stop(1400);
play({ frequency: 740.0, delay: 1000 }), setTimeout(stop, 1400);
