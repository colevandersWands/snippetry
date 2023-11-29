export const noises = (
  audioContext = new (window.AudioContext || window.webkitAudioContext)(),
) => {
  const noise = {};

  noise.wave = (wave = 'sine') => {
    noise.oscillator.type = wave;
    return noise;
  };
  noise.volume = (val = 1, d = 0) => {
    noise.gainNode.gain.setValueAtTime(val, noise.audioCtx.currentTime + d / 1000);
    return noise;
  };
  noise.frequency = (val = 440, d = 0) => {
    noise.oscillator.frequency.setValueAtTime(val, noise.audioCtx.currentTime + d / 1000);
    return noise;
  };
  noise.play = ({ frequency = 440, volume = 1, wave = 'sine', delay = 0 } = {}) => {
    noise.oscillator = noise.audioCtx.createOscillator();
    noise.oscillator.connect(noise.gainNode);
    noise.wave(wave);
    noise.volume(volume, delay / 1000);
    noise.frequency(frequency);
    noise.oscillator.start(delay / 1000);
    return noise;
  };
  noise.stop = (d = 0) => {
    noise.oscillator.stop(noise.audioCtx.currentTime + d / 1000);
    return noise;
  };

  noise.oscillator = null;
  noise.audioCtx = audioContext;
  noise.gainNode = noise.audioCtx.createGain();

  noise.gainNode.connect(noise.audioCtx.destination);
  return noise;
};

export default noises;

// Original JavaScript code by Chirp Internet: www.chirpinternet.eu
//  Please acknowledge use of noise code by including this header.
// adapted from: https://www.the-art-of-web.com/javascript/creating-sounds/

// tags: minibrary
