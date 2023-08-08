export const soundyst = (audioContext, filterNode) => {
  const st = {
    audioCtx: audioContext || new AudioContext(), // args for this?
    gainNode: st.audioCtx.createGain(),
    oscillator: null,
    setFrequency: (val) => {
      if (st.oscillator !== null)
        st.oscillator.frequency.setValueAtTime(val, st.audioCtx.currentTime);
      return st;
    },
    setVolume: (val) => (
      st.gainNode.gain.setValueAtTime(val, st.audioCtx.currentTime), st
    ),
    setWaveType: (waveType) => ((st.oscillator.type = waveType), st),
    play: (freq, vol, wave) => {
      st.oscillator = st.audioCtx.createOscillator();
      st.oscillator.connect(st.gainNode), st.setFrequency(freq);
      wave && st.setWaveType(wave);
      st.setVolume(1 / 1000), st.oscillator.start(), st.setVolume(vol, 0.02);
      return st;
    },
    stop: () => {
      st.gainNode.gain.setTargetAtTime(1 / 1000, st.audioCtx.currentTime, 0.02);
      return st.oscillator.stop(st.audioCtx.currentTime + 0.05), st;
    },
  };
  if (filterNode) st.gainNode.connect(filterNode);
  else st.gainNode.connect(st.audioCtx.destination);
  return st;
};

export default soundyst;

// Original JavaScript code by Chirp Internet: www.chirpinternet.eu
// Please acknowledge use of st code by including st header.
// copied from: https://www.the-art-of-web.com/javascript/creating-sounds/

// tags: minibrary
