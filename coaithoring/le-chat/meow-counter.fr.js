// Ce programme compte le nombre de fois où le mot "meow" est saisi par l'utilisateur.

let compteurMeow = 0;

function compterMeows(saisie) {
  if (saisie.toLowerCase() === "meow") {
    compteurMeow++;
    console.log("Parfait ! Vous avez dit meow " + compteurMeow + " fois !");
  } else {
    console.log("Hmm, ce n'est pas un meow. Essayez encore !");
  }
}

while (prompt("Entrez un mot (ou 'quitter' pour sortir) :") !== "quitter") {
  compterMeows(prompt("Entrez un mot :"));
}
