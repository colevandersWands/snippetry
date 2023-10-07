// In a realm of code, where mysteries unfold,
// A tale of variables, their stories untold.

let whispers = 'Secrets whispered in the night'; // A string of whispers, hidden from sight
let shadows = []; // An empty array, where shadows reside

// The whispers, they dance, in the realm of the night,
// And into the shadows, they take their flight.

for (let i = 0; i < whispers.length; i++) {
  let letter = whispers[i]; // Each letter, a clue to the unknown
  shadows.push(letter); // Into the shadows, the letter is thrown
}

let secret = shadows.join(''); // The shadows unite, revealing the secret

console.log('The secret is: ' + secret); // The secret is unveiled, in the console it rests

// But beware, dear coder, for the shadows deceive,
// They twist and they turn, making you believe.

let reversedSecret = secret.split('').reverse().join(''); // The secret, reversed, a trick up its sleeve

console.log('The reversed secret is: ' + reversedSecret); // The reversed secret, a puzzle to retrieve

// So delve into the code, with curiosity and might,
// Unravel the mysteries, hidden in plain sight.
