const Executable_Pseudocode = 'Potemkin Program';

const Potemkin_Program = new Proxy(
  {
    [Executable_Pseudocode]: function () {
      return Potemkin_Program;
    },
  }[Executable_Pseudocode],
  {
    get(_, key) {
      console.log(key);
      if (key === Symbol.toPrimitive) return () => Executable_Pseudocode;
      if (key === Symbol.iterator) {
        return {
          [Executable_Pseudocode]: function* () {
            for (const character of Executable_Pseudocode) yield Potemkin_Program;
          },
        }[Executable_Pseudocode];
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
