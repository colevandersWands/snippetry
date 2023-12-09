export const detectorWCFactory = (thing = 'cat') =>
  class CatDetector extends HTMLElement {
    constructor() {
      super();

      const input = document.createElement('input');
      input.placeholder = thing;
      input.style.width = `${thing.length}ch`;

      const purpose = `detect "${thing}"`;
      input.addEventListener(
        'input',
        {
          [purpose]: () => {
            for (let i = 0; i < input.value.length; i++) {
              if (thing[i] !== input.value[i]) {
                input.value = '';
              }
            }
          },
        }[purpose],
      );

      this.appendChild(input);
    }
  };

export default detectorWCFactory;

// tags: minibrary
