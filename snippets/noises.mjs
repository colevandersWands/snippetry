const AudioContext = window.AudioContext || window.webkitAudioContext;

export const noises = (audioContext) => {
  const st = {};

  st.audioCtx = audioContext || new AudioContext();
  st.gainNode = st.audioCtx.createGain();
  st.oscillator = null;

  st.play = (freq = 440, vol = 1, wave = 'sine', d = 0) => {
    st.oscillator = st.audioCtx.createOscillator();
    st.oscillator.connect(st.gainNode), st.setFrequency(freq);
    st.setWaveType(wave);
    st.setVolume(0.001);
    st.setVolume(0.001, d / 1000);
    st.oscillator.start(d / 1000);
    st.setVolume(vol, d / 1000);
    return st;
  };
  st.stop = (d = 0) => {
    st.gainNode.gain.setTargetAtTime(0.001, st.audioCtx.currentTime + d, 0.02);
    return st.oscillator.stop(st.audioCtx.currentTime + d / 1000), st;
  };
  st.setFrequency = (val = 440, d = 0) => {
    st?.oscillator.frequency.setValueAtTime(
      val,
      st.audioCtx.currentTime + d / 1000,
    );
    return st;
  };
  st.setVolume = (val = 1, d = 0) => (
    st.gainNode.gain.setValueAtTime(val, st.audioCtx.currentTime + d / 1000), st
  );
  st.setWaveType = (waveType = 'sine') => ((st.oscillator.type = waveType), st);

  st.gainNode.connect(st.audioCtx.destination);
  return st;
};

export default noises;

// Original JavaScript code by Chirp Internet: www.chirpinternet.eu
//  Please acknowledge use of st code by including this header.
// adapted from: https://www.the-art-of-web.com/javascript/creating-sounds/

// tags: minibrary
