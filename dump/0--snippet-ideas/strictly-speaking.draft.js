// some play on strict mode features
//  turn it on half way through?

/*
  Indirect eval would not inherit the strictness of the surrounding context, and would only be in strict mode if the source string itself has a "use strict" directive.
  JS - Copy to Clipboard
  function strictContext() {
    "use strict";
    eval?.(`with (Math) console.log(PI);`);
  }
  function strictContextStrictEval() {
    "use strict";
    eval?.(`"use strict"; with (Math) console.log(PI);`);
  }
  strictContext(); // Logs 3.141592653589793
  strictContextStrictEval(); // Throws a SyntaxError because the source string is in strict mode


  On the other hand, direct eval inherits the strictness of the invoking context.
  JS -  Copy to Clipboard
  function nonStrictContext() {
    eval(`with (Math) console.log(PI);`);
  }
  function strictContext() {
    "use strict";
    eval(`with (Math) console.log(PI);`);
  }
  nonStrictContext(); // Logs 3.141592653589793
  strictContext(); // Throws a SyntaxError because it's in strict mode


  var-declared variables and function declarations would go into the surrounding scope if the source string is not interpreted in strict mode — for indirect eval, they become global variables. If it's a direct eval in a strict mode context, or if the eval source string itself is in strict mode, then var and function declarations do not "leak" into the surrounding scope.
  JS- Copy to Clipboard
  // Neither context nor source string is strict,
  // so var creates a variable in the surrounding scope
  eval("var a = 1;");
  console.log(a); // 1
  // Context is not strict, but eval source is strict,
  // so b is scoped to the evaluated script
  eval("'use strict'; var b = 1;");
  console.log(b); // ReferenceError: b is not defined

  function strictContext() {
    "use strict";
    // Context is strict, but this is indirect and the source
    // string is not strict, so c is still global
    eval?.("var c = 1;");
    // Direct eval in a strict context, so d is scoped
    eval("var d = 1;");
  }
  strictContext();
  console.log(c); // 1
  console.log(d); // ReferenceError: d is not defined
*/
