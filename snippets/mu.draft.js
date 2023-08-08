// variable name is 'mu'
// the only value stored is 'mu'
// the two keys are 'whol' & 'rede'
//  but somehow defined by each other
// reflect
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect

// ----------

class Mu {
  get Reductionism() {
    // debugger;
    return this instanceof Reductionism ? new Wholism() : new Reductionism();
  }
  get Wholism() {
    // debugger;
    return this instanceof Wholism ? new Reductionism() : new Wholism();
  }
}
class Wholism extends Mu {}
class Reductionism extends Mu {}

const r = new Reductionism();
const w = new Wholism();

console.log(r.Wholism, w.Reductionism);

// --------

// class Reductionism extends Mu {}
// class Mu extends Wholism {}
// class Wholism extends Reductionism {}

// -------

// const mu = new String('mu');
// // Object.setPrototypeOf(mu, mu);
// mu.__proto__.__proto__ = mu;
// console.log(mu.__proto__.__proto__);

// ----------

// but where's the mu in this?2
//  reflect?
// const wholism = () => reductionism;
// const reductionism = () => wholism;

// ----------

// not so much, maybe clases?
// mu = {
//   get wholism() {
//     return this;
//   },
//   get reductionism() {
//     return this;
//   },
// };

// console.log(mu.wholism);

// t

// --- generator? ---

// ------ simple object references ------

const reductionism = {
  get wholism() {
    return mu;
  },
};
const wholism = {
  get reductionism() {
    return mu;
  },
};
const mu = {
  wholism: reductionism,
  reductionism: wholism,
};

// const reductionism = mu;
// const wholism = mu;
// const mu = {
//   get reductionism() {
//     return wholism;
//   },
//   get wholism() {
//     return reductionism;
//   },
// };

// const mu = {
//   wholism: {
//     get reductionism() {
//       return { mu };
//     },
//   },
//   reductionism: {
//     get wholism() {
//       return { mu };
//     },
//   },
// };

// const mu = {
//   wholism: { reductionism: { mu } },
//   reductionism: { wholism: { mu } },
// };
