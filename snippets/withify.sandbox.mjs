import { withify } from './withify.mjs';

const obj = {
  punctuation: '!',
  say(thing) {
    console.log(thing + this.punctuation);
    return this;
  },
  changeMood(newPunct) {
    this.punctuation = newPunct;
    return this;
  },
  act($block) {
    $block();
    return this;
  },
};

withify(obj)(() => {
  console.log(punctuation);
  say('hi');
  changeMood('?');
  say('bye');
  punctuation = ';';
  console.log(punctuation);
});

// punctuation;

withify
  .dsl(obj)
  .say('hi')
  .act(() => changeMood('?!'))
  .say('bye');

const greeterDSL = withify.dsl(obj);

greeterDSL.act(() => {
  console.log(punctuation);
  say('hi');
  changeMood('.');
  say('bye');
  console.log(punctuation);
});

withify(obj.say.bind(obj))(() => obj).say('bye');

withify(obj)(() => say('yo'));

obj.innerDSL = () => say('hoy');
withify.dsl(obj).innerDSL();
