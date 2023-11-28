speechSynthesis.getVoices();

export const introducing = (name = '', voiceConfig = {}) => {
  const speaker = {
    [name]: (text = '', speakConfig = {}) => {
      console.log(`%c${name}%c: ${text}`, 'font-style: italic;', '');

      const utteranceConfig = Object.assign({}, voiceConfig, speaker, speakConfig);
      if (utteranceConfig?.voice) {
        utteranceConfig.voice = speechSynthesis
          .getVoices()
          .find((voice) => voice.name === utteranceConfig.voice);
      }
      const utterance = Object.assign(
        new SpeechSynthesisUtterance(text),
        utteranceConfig,
      );

      return new Promise((res) => {
        utterance.addEventListener('end', () => res(text));
        speechSynthesis.speak(utterance);
      });
    },
  }[name];

  speaker.recite = async (textPath = '') =>
    fetch(textPath)
      .then((res) => res.text())
      .then(speaker)
      .catch(console.error);

  return speaker;
};

export const theArrivalOf = async (name = '', voiceConfig = {}, delay = 200) => {
  await new Promise((res) => setTimeout(res, delay));
  return introducing(name, voiceConfig);
};

export default introducing;

// tags: minibrary
