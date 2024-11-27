export const ExecutablePseudocode = new Proxy(
  function PotemkinProgram() {
    return ExecutablePseudocode;
  },
  {
    get(_, key) {
      console.log(key);
      if (key === Symbol.toPrimitive) return () => 'Potemkin Program';
      if (key === Symbol.iterator)
        return function* PotemkinProgram() {
          for (const _ of 'Potemkin Program') yield ExecutablePseudocode;
        };

      return ExecutablePseudocode;
    },
    construct() {
      return ExecutablePseudocode;
    },
  },
);

export default ExecutablePseudocode;

// tags: minibrary
