// This program counts the number of times the word "meow" is entered by the user.

let meowCounter = 0;

function countMeows(input) {
  if (input.toLowerCase() === "meow") {
    meowCounter++;
    console.log("Purrfect! You said meow " + meowCounter + " times!");
  } else {
    console.log("Hmm, that's not a meow. Try again!");
  }
}

while (prompt("Enter a word (or 'quit' to exit):") !== "quit") {
  countMeows(prompt("Enter a word:"));
}
