import noises from './noises.mjs';

const { play, stop } = noises();

// https://www.the-art-of-web.com/javascript/creating-sounds/#section_4q
play(587.3, 0.5, 'sine').stop(250);
play(587.3, 0.5, 'sine', 300).stop(350);
play(659.3, 0.5, 'sine', 400).stop(550);
play(587.3, 0.5, 'sine', 600).stop(750);
play(784.0, 0.5, 'sine', 800).stop(950);
// play(740.0, 0.5, 'sine', 1000).stop(1400);
play(740.0, 0.5, 'sine', 1000), setTimeout(stop, 1400);
