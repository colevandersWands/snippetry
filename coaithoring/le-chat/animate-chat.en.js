// This program displays an animated ASCII art of Le Chat.

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

function animateChat() {
  for (let i = 0; i < frames.length; i++) {
    console.clear();
    console.log(frames[i]);
    wait(500); // Wait for 500 milliseconds before displaying the next frame
  }
}

function wait(ms) {
  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

animateChat();
