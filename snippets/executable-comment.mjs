const unspeaker = () => unspoken;
export const unspoken = new Proxy(unspeaker, {
  get(_, comment) {
    if (comment === Symbol.toPrimitive) return () => 'unspoken';
    return unspoken;
  },
});

speechSynthesis.getVoices();
export const spoken = (function introduce(voiceConfig = {}, mute = false) {
  const speaker = new Proxy(
    function speak() {
      return speaker;
    },
    {
      get(_, comment) {
        if (comment === Symbol.toPrimitive) return () => 'spoken';
        if (comment === Symbol.iterator) return (mute = true), speaker;
        if (mute) comment === 'done' && (mute = false);
        else
          speechSynthesis.speak(
            Object.assign(new SpeechSynthesisUtterance(comment), voiceConfig),
          );
        return speaker;
      },
      construct(_, config) {
        if (config[0].voice)
          config[0].voice = speechSynthesis
            .getVoices()
            .find((voice) => voice.voiceURI === config[0].voice);
        return introduce(config[0]);
      },
    },
  );
  return speaker;
})();

export default unspoken;

// tags: minibrary, useless

// --- wait, wat? ---

const { _, l_ } = unspoken;
// const { _, l_ } = spoken;

_.This.curiosity.lets.you.write.any.chain.you.want(..._.within.JS.syntax);
_.Your.comments.will.be.executed, _.but.they["won't"].DO.anything;
_.Operators.are.now(_.sort.of).punctuation - _.with.a.little.imagination;
_.What.are.you.waiting.for?.___.Execute.your.comments['!'];

l_('@').l_('@').l_('@') <= _.snail.train;
