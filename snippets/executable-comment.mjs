const unspeaker = () => unspoken;
export const unspoken = new Proxy(unspeaker, {
  get(_, comment) {
    return comment === Symbol.toPrimitive ? () => 'unspoken' : unspoken;
  },
});

speechSynthesis.getVoices();
export const Spoken = (function introduce(voiceConfig = {}, mute = false) {
  const spoken = new Proxy(
    function speaker() {
      return spoken;
    },
    {
      get(_, comment, __) {
        if (comment === Symbol.toPrimitive) return () => 'Spoken';
        if (comment === Symbol.iterator) return (mute = true), spoken;
        if (mute) return comment === 'done' && (mute = false), spoken;
        speechSynthesis.speak(
          Object.assign(new SpeechSynthesisUtterance(comment), voiceConfig),
        );
        return spoken;
      },
      construct(_, args = []) {
        if (args[0]?.voice)
          args[0].voice = speechSynthesis
            .getVoices()
            .find((voice) => voice.name === args[0].voice);
        return introduce(args[0] || {});
      },
    },
  );
  return spoken;
})();

export default unspoken;

// tags: minibrary

// --- wait, wat? ---

const { _ } = unspoken;
// const { _ } = Spoken;

_.This.curiosity.lets.you.write.any.chain.you.want(..._.within.JS.syntax);
_.Your.comments.will.be.executed, _.but.they["won't"].DO.anything;
_.Operators.are.now(_.sort.of).punctuation - _.with.a.little.imagination;
_.What.are.you.waiting.for?.___.Execute.your.comments['!'];
