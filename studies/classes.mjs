// import tracedLog from '../snippets/log.mjs';
import togglog from '../snippets/togglog.mjs';

// const log = togglog({ out: tracedLog });
const log = togglog();

/* 
	haven't used these yet, why not?
		i prefer functional minibraries
		classes are longer
		i'm not a huge fan of OOP modeling

	what is possible that i'm missing?
		fun/pun modeling
		?
*/

// ---   ---   ---   ---   ---   ---   ---   ---

{
  log.label = 'spering: '
  log.on;

  class Huh {
    a;
    #b;
    static c;

    constructor() {}

    get x() {}
    set x(_) {}
    y() {}

    [Symbol.iterator]() {}
  }

  log(Object.keys(Huh));
  log(Object.getOwnPropertyNames(Huh));
  log(Object.getOwnPropertySymbols(Huh));
}
