import _ from './executable-pseudocode.mjs';
const { OrderedSet, Element } = _;

const reals = new OrderedSet((a, b) => a.getValue() < b.getValue());
const zero = new Element(0);
const one = new Element(1);

reals.add(zero);
reals.add(one);
addBetween(reals)(zero, one);

cantorize(reals);

console.log(...reals);

// --- --- --- --- --- ---

function addBetween(set) {
  return (left, right) => {
    const middle = new Element((left.getValue() + right.getValue()) / 2);
    if (!set.has(middle)) {
      set.add(middle);
      addRealsBetween(left, middle);
      addRealsBetween(middle, right);
    }
  };
}

function cantorize(incomplete, i = 0) {
  const numberToCheck = incomplete.getByOrder(i).getValue();
  numberToCheck[i] = numberToCheck[i] + 1;
  const maybeMissing = new Element(numberToCheck);
  if (!incomplete.has(maybeMissing)) {
    incomplete.add(maybeMissing);
    cantorize(incomplete, i++);
  }
}
