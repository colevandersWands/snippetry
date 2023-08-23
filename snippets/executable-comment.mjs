const unspeaker = () => _unspoken_;
export const _unspoken_ = new Proxy(unspeaker, {
  get(_, comment) {
    return comment === Symbol.toPrimitive ? () => 'unspoken' : _unspoken_;
  },
});

speechSynthesis.getVoices();
export const _Spoken_ = (function introduce(voiceConfig = {}, mute = false) {
  const Spoken = new Proxy(
    function Speaker() {
      return Spoken;
    },
    {
      get(_, comment, __) {
        if (comment === Symbol.toPrimitive) return () => 'Spoken';
        if (comment === Symbol.iterator) return (mute = true), Spoken;
        if (mute) return comment === 'done' && (mute = false), Spoken;
        speechSynthesis.speak(
          Object.assign(new SpeechSynthesisUtterance(comment), voiceConfig),
        );
        return Spoken;
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
  return Spoken;
})();

export default _unspoken_;

// tags: minibrary

// --- wait, wat? ---

const { _ } = _unspoken_;
// const { _ } = _Spoken_;

_.This.curiosity.lets.you.write.any.chain.you.want(..._.within.JS.syntax);
_.Your.comments.will.be.executed, _.but.they["won't"].DO.anything;
_.Operators.are.now(_.sort.of).punctuation - _.with.a.little.imagination;
_.What.are.you.waiting.for?.___.Execute.your.comments['!'];
