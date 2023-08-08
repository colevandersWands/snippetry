var mu = {
  wholism: {
    get reductionism() {
      return { mu };
    },
  },
  reductionism: {
    get wholism() {
      return { mu };
    },
  },
};

mu; // wholism, reductionism

mu.wholism; // reductionism
mu.reductionism; // wholism

mu.wholism.reductionism; // mu
mu.reductionism.wholism; // mu

mu.wholism.reductionism.mu;
mu.reductionism.wholism.mu;

// remix: https://blog.p-petrov.com/assets/images/imgs_geb/mu.png
// credit: Douglas Hofstadter
// tags: wuzzle
