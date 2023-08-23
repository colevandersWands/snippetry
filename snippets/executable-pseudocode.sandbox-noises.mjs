import _ from './executable-pseudocode.mjs';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export const noises = (audioContext) => {
  // const st = {};
  const st = _;
  st.oscillator = null;
  st.audioCtx = audioContext || new AudioContext();
  st.gainNode = st.audioCtx.createGain();
  st.gainNode.connect(st.audioCtx.destination);
  st.play = ({
    frequency = 440,
    volume = 1,
    wave = 'sine',
    delay = 0,
  } = {}) => {
    st.oscillator = st.audioCtx.createOscillator();
    st.oscillator.connect(st.gainNode), st.frequency(frequency);
    st.wave(wave), st.oscillator.start(delay / 1000);
    st.volume(volume, delay / 1000);
    return st;
  };
  st.stop = (d = 0) => {
    st.gainNode.gain.setTargetAtTime(0.001, st.audioCtx.currentTime + d, 0.02);
    return st.oscillator.stop(st.audioCtx.currentTime + d / 1000), st;
  };
  st.frequency = (val = 440, d = 0) => {
    st?.oscillator.frequency.setValueAtTime(
      val,
      st.audioCtx.currentTime + d / 1000,
    );
    return st;
  };
  st.volume = (val = 1, d = 0) => (
    st.gainNode.gain.setValueAtTime(val, st.audioCtx.currentTime + d / 1000), st
  );
  st.wave = (wave = 'sine') => ((st.oscillator.type = wave), st);
  return st;
};

export default noises;

// Original JavaScript code by Chirp Internet: www.chirpinternet.eu
//  Please acknowledge use of st code by including this header.
// adapted from: https://www.the-art-of-web.com/javascript/creating-sounds/

// tags: minibrary
