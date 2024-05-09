export const say = (...scripts) => {
  for (const script of scripts) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(script));
  }
};
