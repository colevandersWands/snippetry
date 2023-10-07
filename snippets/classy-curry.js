const classy = (Thing, { args = [], length = Thing.length } = {}) =>
  function curry(arg) {
    return args.length === length - 1
      ? new Thing(...args, arg)
      : classy(Thing, { args: args.concat(arg) });
  };

// ---   ---   ---   ---   ---   ---   ---

class TrafficRules {
  constructor(optional, flexible, creative) {
    this.optional = optional;
    this.flexible = flexible;
    this.creative = creative;
  }
  get description() {
    return `The traffic rules here are${
			this.creative ? '' : 'not '} creative,${
      this.flexible ? '' : 'not '} flexible, and${
			this.optional ? '' : 'not '} optional.`;
  }
}

console.log(
	classy(TrafficRules)(true)(true)(true).description
);

// tags: wuzzle