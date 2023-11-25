// This program simulates a chatbot conversation with Geluck's Le Chat.

function chatbot(input) {
  if (input.toLowerCase().includes("hello")) {
    console.log("Meow! Hello there!");
  } else if (input.toLowerCase().includes("joke")) {
    console.log("Why don't cats play poker in the wild? Too many cheetahs!");
  } else if (input.toLowerCase().includes("food")) {
    console.log("Meow! I love fish and milk!");
  } else {
    console.log("Hmm, I'm not sure what you mean. Can you meow that again?");
  }
}

while (prompt("Ask me something (or 'quit' to exit):") !== "quit") {
  chatbot(prompt("Ask me something:"));
}
