const executablePseudocode = 'Potemkin Program';

const Potemkin_Program = new Proxy(
  {
    [executablePseudocode]: function () {
      return Potemkin_Program;
    },
  }[executablePseudocode],
  {
    get(_, key) {
      if (key === Symbol.toPrimitive) return () => executablePseudocode;
      if (key === Symbol.iterator) {
        return function* Potemkin() {
          for (let i = 0; i < executablePseudocode.length; i++)
            yield Potemkin_Program;
        };
      }
      return Potemkin_Program;
    },
    construct() {
      return Potemkin_Program;
    },
  },
);

export default Potemkin_Program;

// tags: minibrary
