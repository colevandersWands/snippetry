const calloutStack = (msg = '') =>
  // inspiration: https://github.com/angus-c/literary.js/blob/master/book/carroll/prime.js
  eval(
    msg
      .split('')
      .reduce((acc, next) => `(function ${next}() { ${acc} })()`, `${msg}()`),
  );

// console.log(calloutStack);

calloutStack('notice');

// VM4673:1 Uncaught ReferenceError: notice is not defined
//     at n (eval at calloutStack (callout-stack.js:8:3), <anonymous>:1:97)
//     at o (eval at calloutStack (callout-stack.js:8:3), <anonymous>:1:108)
//     at t (eval at calloutStack (callout-stack.js:8:3), <anonymous>:1:113)
//     at i (eval at calloutStack (callout-stack.js:8:3), <anonymous>:1:118)
//     at c (eval at calloutStack (callout-stack.js:8:3), <anonymous>:1:123)
//     at e (eval at calloutStack (callout-stack.js:8:3), <anonymous>:1:128)
//     at eval (eval at calloutStack (callout-stack.js:8:3), <anonymous>:1:133)
//     at calloutStack (<anonymous>:8:3)
//     at <anonymous>:16:13
//     at HTMLIFrameElement.evaller.onload (study-with.js:63:34)

// const calloutStack = (msg = '') =>
//   new Function(
//     'msg=""',
//     `return function ${msg.slice(0, 1)}(msg = '') {
//               msg.length === 0
//                 ? msg()
//                 : calloutStack(msg.slice(1, msg.length))
//             }`,
//   )()(msg);

// VM144:5 Uncaught TypeError: msg is not a function
//     at eval (eval at calloutStack (callout-stack.js:7:3), <anonymous>:5:19)
//     at calloutStack (<anonymous>:14:6)
//     at e (eval at calloutStack (callout-stack.js:7:3), <anonymous>:6:19)
//     at calloutStack (<anonymous>:14:6)
//     at c (eval at calloutStack (callout-stack.js:7:3), <anonymous>:6:19)
//     at calloutStack (<anonymous>:14:6)
//     at i (eval at calloutStack (callout-stack.js:7:3), <anonymous>:6:19)
//     at calloutStack (<anonymous>:14:6)
//     at t (eval at calloutStack (callout-stack.js:7:3), <anonymous>:6:19)
//     at calloutStack (<anonymous>:14:6)
