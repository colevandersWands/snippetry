// Ce programme simule une conversation avec un chatbot à la manière de Geluck's Le Chat.

function chatbot(saisie) {
  if (saisie.toLowerCase().includes("bonjour")) {
    console.log("Meow ! Bonjour !");
  } else if (saisie.toLowerCase().includes("blague")) {
    console.log("Pourquoi les chats ne jouent-ils pas au poker dans la nature ? Trop de guépards !");
  } else if (saisie.toLowerCase().includes("nourriture")) {
    console.log("Meow ! J'adore le poisson et le lait !");
  } else {
    console.log("Hmm, je ne suis pas sûr de comprendre. Pouvez-vous répéter en miaulant ?");
  }
}

while (prompt("Posez-moi une question (ou 'quitter' pour sortir) :") !== "quitter") {
  chatbot(prompt("Posez-moi une question :"));
}
