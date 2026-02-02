// TODO: smarter transcribing logic than .join
const transcribe = (transcript) => transcript.join(' ');

export const _written_ = (function write(transcript = [], offRecord = false) {
  const Written = new Proxy(
    function Writer(...parentheticals) {
      transcript.push(`(${transcribe(parentheticals)})`);
      return Written;
    },
    {
      get(_, word) {
        if (word === Symbol.toPrimitive) return () => transcribe(transcript);
        if (word === Symbol.iterator) return (offRecord = true), Written;
        if (offRecord) return word === 'done' && (offRecord = false), Written;
        return Written;
      },
      construct(_, _transcript) {
        return write(_transcript || transcript);
      },
    },
  );
  return Written;
})();

export default _written_;

// tags: coAIthored
