// variable name is 'mu'
// the only value stored is 'mu'
// the two keys are 'whol' & 'rede'
//  but somehow defined by each other
// !!  reflect
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

// https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.IEpeeWykfDy_wVjvK7vkbwHaFM%26pid%3DApi&f=1&ipt=56cc492262d99d03355a67f077fe81f82294d9fe9d833d737b488de925b889f0&ipo=images
