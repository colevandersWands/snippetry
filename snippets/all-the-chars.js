const allTheChars = [];

let i = 0;
let next = '';

while (!allTheChars.includes(next)) {
  allTheChars.push(next);
  next = String.fromCharCode(i++);
}

console.log(allTheChars.join(''));
