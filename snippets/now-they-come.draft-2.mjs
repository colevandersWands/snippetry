/* 
keep track of who they spoke up for and didn't
have them stand stand beside you
and the others are gone
*/

var them, next, you, spokeOut;

// find a word that woks better than "transgender"
them = ['trust', 'transgender', 'immigrant', 'Palestinian'];

silence: while (them.shift()) {
  next = 'Now they come for the ' + them[0] + 's, ';
  spokeOut = !confirm(next);

  if (spokeOut) {
    alert(next + 'and you spoke out— \n			Even if you are not a ' + them[0] + '.');
    break silence;
  } else {
    alert(next + 'and you do not speak out— \n			Even if you are a ' + them[0] + '.');
  }
}

you = 'Now they come for you—';
if (spokeOut) {
  you += 'and those you spoke for stand beside you.';
} else {
  you += 'and there is no one left to speak for you.';
}

alert(you);
