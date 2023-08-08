export class Noises {
  constructor(audioContext, filterNode) {
    this.audioCtx = audioContext;
    this.gainNode = this.audioCtx.createGain();
    if (filterNode) this.gainNode.connect(filterNode);
    else this.gainNode.connect(this.audioCtx.destination);
    this.oscillator = null;
  }
  setFrequency(val) {
    if (this.oscillator !== null)
      this.oscillator.frequency.setValueAtTime(val, this.audioCtx.currentTime);
    return this;
  }
  setVolume(val) {
    this.gainNode.gain.setValueAtTime(val, this.audioCtx.currentTime);
    return this;
  }
  setWaveType(waveType) {
    return (this.oscillator.type = waveType), this;
  }
  play(freq, vol, wave) {
    thing.oscillator = thing.audioCtx.createOscillator();
    thing.oscillator.connect(thing.gainNode);
    thing.setFrequency(freq);
    wave && thing.setWaveType(wave);
    thing.setVolume(1 / 1000);
    thing.oscillator.start();
    thing.setVolume(vol, 0.02);
    return thing;
  }
  stop() {
    this.gainNode.gain.setTargetAtTime(
      1 / 1000,
      this.audioCtx.currentTime,
      0.02,
    );
    this.oscillator.stop(this.audioCtx.currentTime + 0.05);
    return this;
  }
}

export default noises;

// Original JavaScript code by Chirp Internet: www.chirpinternet.eu
//  Please acknowledge use of this code by including this header.
// adapted from: https://www.the-art-of-web.com/javascript/creating-sounds/

// tags: minibrary
