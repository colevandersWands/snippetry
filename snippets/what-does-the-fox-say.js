theFoxSays('kwak', 'kwak', 'kwak');

function theFoxSays(...args) {
  // This looks like a fox, right?
  // Taken from here - https://ascii.co.uk/art/fox
  const fox = [
    '%c%c',
    '%c    _,-=._              /|_/|%c',
    '%c`-.}       `=._,.-=-._.,  @ @._,%c',
    "%c   `._ _,-.   )      _,.-'%c",
    '%c           G.m-"^m`m\'%c',
    '%c%c',
  ];

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
    console.log(line, 'color: firebrick', '');
  }
}

// credit: https://tholman.com/console-dot-frog/
// tags: sketch
