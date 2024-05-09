import { statelessMachine } from './stateless-machine.draft.mjs';

console.log(statelessMachine()); // minimal docs

// --- transitions ---

const stopight = statelessMachine({
  green: {
    change: {
      state: 'yellow',
      se: [(args) => console.log(1, args), (args) => console.log(2, args)],
    },
  },
  yellow: {
    change: 'red',
  },
  red: {
    change: {
      state: 'green',
      se: (args) => console.log(3, args),
    },
  },
});

console.log(stopight()); // transitions map

// --- states ---

console.log(stopight('orange')); // null

const yellow = stopight('yellow');
console.log(yellow()); // yellow's transitions

// --- events ---

console.log(yellow('change')); // { p, e, n }

console.log(yellow('swim')); // null

// --- callbacks ---

console.log(stopight('green')('change')); /*  1, { p, e, n }
                                              2, { p, e, n }
                                              { p, e, n }   */

console.log(stopight('red')('change')); /*  3, { p, e, n }
                                            { p, e, n }   */
