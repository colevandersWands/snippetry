theFrogSays('quack', 'kwak');

function theFrogSays(...args) {
  // This looks like a frog, right?
  // Taken from here - http://chris.com/ascii/index.php?art=animals/frogs
  const frog = [
    '%c%c',
    '%c         _,-.  %c',
    "%c ,-. ,--'  o ) %c",
    "%c \\(,' '  ,,-' %c",
    '%c,-.\\-.__,\\\\_%c',
    "%c\\(`--'    `\\ %c",
    '%c%c',
  ];

  // Gets args as a string
  const joinedArgs = args.join(' ');

  // Add the bubble if there is something to log!
  if (joinedArgs.length > 0) {
    frog[1] += `   ---${'-'.repeat(joinedArgs.length)}-`;
    frog[2] += `-(   ${joinedArgs}   )`;
    frog[3] += `    ---${'-'.repeat(joinedArgs.length)}-`;
  }

  // Log the frog!
  for (const line of frog) {
    console.log(line, 'color: green', '');
  }
}

// credit: https://tholman.com/console-dot-frog/
// tags: sketch
