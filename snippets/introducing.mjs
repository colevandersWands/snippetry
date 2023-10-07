speechSynthesis.getVoices();

export const introducing = (name = '', voiceConfig = {}) => {
  const speaker = {
    [name]: (text = '', speakConfig = {}) => {
      console.log(`%c${name}%c: ${text}`, 'font-style: italic;', '');

      const utteranceConfig = Object.assign({}, voiceConfig, speaker[name], speakConfig);
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
  };
  return speaker[name];
};

export const theArrivalOf = async (name = '', voiceConfig = {}, delay = 200) => {
  await new Promise((res) => setTimeout(res, delay));
  return introducing(name, voiceConfig);
};

export default introducing;

// tags: minibrary
