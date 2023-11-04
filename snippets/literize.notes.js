// ... interesting and related

// https://github.com/ericelliott/rfx

// var rfx = function rfx(signature) {
//   var sig = signature.toString();

//   return function (subject) {
//     return Object.assign(subject, {
//       rfx: Object.assign(
//         function rfx() {
//           /* eslint-disable no-console */
//           console.log(sig);
//         },
//         {
//           signature: sig,
//         },
//       ),
//     });
//   };
// };

// rfx = rfx(
//   '/*\n' +
//     '  Take an rtype type description and a subject (curried), and return \n' +
//     '  the function augmented with supplied documentation. \n' +
//     '*/\n' +
//     'rfx(signature) => (subject: s) => s & {\n' +
//     '  rfx(), effects(log signature to console)\n' +
//     '} & {\n' +
//     '  signature: string\n' +
//     '}',
// )(rfx);

var rfx = function rfx(signature) {
  var sig = signature.toString();

  return function (subject) {
    // do this without obj.ass
    return Object.assign(subject, {
      rfx: Object.assign(
        function rfx() {
          /* eslint-disable no-console */
          console.log(sig);
        },
        {
          signature: sig,
        },
      ),
    });
  };
};

rfx = rfx(
  '/*\n' +
    '  Take an rtype type description and a subject (curried), and return \n' +
    '  the function augmented with supplied documentation. \n' +
    '*/\n' +
    'rfx(signature) => (subject: s) => s & {\n' +
    '  rfx(), effects(log signature to console)\n' +
    '} & {\n' +
    '  signature: string\n' +
    '}',
)(rfx);

// ----------------

// const add2 = rfx`
// // Take two values, a & b, and return the sum.
// add2(a: n, b: n) => Number
// `((a, b) => a + b);

// const add2 = rfx(`
// // Take two values, a & b, and return the sum.
// add2(a: n, b: n) => Number
// `)((a, b) => a + b);

const add2 = rfx`
// Take two values, a & b, and return the sum.
add2(a: n, b: n) => Number
`((a, b) => a + b);

add2.rfx(); // logs tagged description to the console.
console.log(add2.rfx.signature);
