import { deepFlatObj } from './deep-flat-obj.draft.mjs';

export const testObj = {
  string: '',
  number: 0,
  boolean: false,
  arrow: () => {},
  notArrow: function () {},
  nested: {
    string: '',
    number: 0,
    boolean: false,
    arrow: () => {},
    notArrow: function () {},
    nested: {},
  },
};

testObj.cyclical = testObj
testObj.nested.cyclical = testObj

console.log(deepFlatObj(testObj));
