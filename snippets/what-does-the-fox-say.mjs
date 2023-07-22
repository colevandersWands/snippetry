// This looks like a fox, right?
// Taken from here - https://ascii.co.uk/art/fox
const fox = [
  '%c',
  '%c    _,-=._              /|_/|',
  '%c`-.}       `=._,.-=-._.,  @ @._,',
  "%c   `._ _,-.   )      _,.-'",
  '%c           G.m-"^m`m\'',
  '%c',
];

export const theFoxSays = (...args) => {
  // Gets args as a string
  const joinedArgs = args.join(' ');

  // Add the bubble if there is something to log!
  if (joinedArgs.length > 0) {
    fox[1] += `        ---${'-'.repeat(joinedArgs.length)}-`;
    fox[2] += `  -(   ${joinedArgs}   )`;
    fox[3] += `           ---${'-'.repeat(joinedArgs.length)}-`;
  }

  // Log the fox!
  for (const line of fox) {
    console.log(line, 'color: firebrick');
  }
};

export default theFoxSays;

// tags: sketch, remix
// inspiration: https://tholman.com/console-dot-frog/
