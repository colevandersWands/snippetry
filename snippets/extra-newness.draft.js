// https://github.com/denysdovhan/wtfjs#extra-newness

class Foo extends Function {
  constructor(val) {
    super();
    this.prototype.val = val;
  }
}

new new Foo(':D')().val; // -> ':D'

//

new new Foo(':D')().val(new newFooInstance()).val;
veryNewFooInstance.val;

//

class Foo extends Function {
  constructor(val) {
    super(`
      this.val = arguments[0];
    `);
    this.prototype.val = val;
  }
}

var foo = new new Foo(':D')('D:');
foo.val; // -> 'D:'
delete foo.val; // remove the instance prop 'val', deferring back to the prototype's 'val'.
foo.val; // -> ':D'
