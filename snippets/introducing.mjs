speechSynthesis.getVoices();

export default function introducing(name = '', voiceConfig = {}) {
  const speaker = {
    [name]: (text = '', speakConfig = {}) => {
      console.log(`%c${name}%c: ${text}`, 'font-style: italic;', '');

      const utteranceConfig = Object.assign(
        {},
        voiceConfig,
        speaker[name],
        speakConfig,
      );
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
}

// tags: minibrary
