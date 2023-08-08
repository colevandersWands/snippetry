// Original JavaScript code by Chirp Internet: www.chirpinternet.eu
// Please acknowledge use of this code by including this header.
// copied from: https://www.the-art-of-web.com/javascript/creating-sounds/

export class Noises {
  constructor(audioContext, filterNode) {
    this.audioCtx = audioContext;
    this.gainNode = this.audioCtx.createGain();

    if (filterNode) {
      // run output through extra filter (already connected to audioContext)
      this.gainNode.connect(filterNode);
    } else {
      this.gainNode.connect(this.audioCtx.destination);
    }

    this.oscillator = null;
  }

  setFrequency(val) {
    if (this.oscillator !== null) {
      this.oscillator.frequency.setValueAtTime(val, this.audioCtx.currentTime);
    }
    return this;
  }

  setVolume(val) {
    this.gainNode.gain.setValueAtTime(val, this.audioCtx.currentTime);
    return this;
  }

  setWaveType(waveType) {
    this.oscillator.type = waveType;
    return this;
  }

  play(freq, vol, wave) {
    this.oscillator = this.audioCtx.createOscillator();
    this.oscillator.connect(this.gainNode);
    this.setFrequency(freq);
    if (wave) {
      this.setWaveType(wave);
    }
    this.setVolume(1 / 1000);

    this.oscillator.start();
    this.setVolume(vol, 0.02);

    return this;
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
