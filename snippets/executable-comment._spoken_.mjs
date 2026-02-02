speechSynthesis.getVoices();

export const _spoken_ = (function introduce(voiceConfig = {}, mute = false) {
  const Spoken = new Proxy(
    function Speaker(...asides) {
      return Spoken;
    },
    {
      get(_, comment, __) {
        if (comment === Symbol.toPrimitive) return () => '_spoken_';
        if (comment === Symbol.iterator) return (mute = true), Spoken;
        if (mute) return comment === 'done' && (mute = false), Spoken;
        speechSynthesis.speak(
          Object.assign(new SpeechSynthesisUtterance(comment), voiceConfig),
        );
        return Spoken;
      },
      construct(_, args = [{}]) {
        if (args[0]?.voice)
          args[0].voice = speechSynthesis
            .getVoices()
            .find((voice) => voice.name === args[0].voice);
        return introduce(args[0] || {});
      },
    },
  );
  return Spoken;
})();

export default _spoken_;
