// Ce programme affiche une animation ASCII art de Le Chat.

const frames = [
  `
   /\\_/\\
  ( o.o )
   > ^ <
  `,
  `
   /\\_/\\
  ( o.o )
   > - <
  `,
  `
   /\\_/\\
  ( o.o )
   > o <
  `,
];

function animerChat() {
  for (let i = 0; i < frames.length; i++) {
    console.clear();
    console.log(frames[i]);
    attendre(500); // Attendre 500 millisecondes avant d'afficher la prochaine image
  }
}

function attendre(ms) {
  const debut = Date.now();
  let maintenant = debut;
  while (maintenant - debut < ms) {
    maintenant = Date.now();
  }
}

animerChat();
