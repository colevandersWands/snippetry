// somehow prompt for this list
// 	ask for "what you are not"?
// how topically political to be?
//  replace the originals with modern analogues
// trust is gone before the program begins
var them = ['trust', 'socialist', 'trade unionist', 'Jew'];
// trans, immigrants, Palestinian

var spokeOut;
// to shift trust at the beginning? do/while? or cleverer logic?
//  keep the logic simple, speak with variable names, syntax and structure
silence: while (them.shift()) {
  // not right that the default "ok" is to speak
  var next = 'Now they come for the ' + them[0] + 's, ';
  spokeOut = !confirm(next);
  if (spokeOut) {
    alert(next + 'and you spoke out— \n			Even if you are not a ' + them[0] + '.');
    break silence;
  } else {
    alert(
      next + 'and you do not speak out— \n			Even if you are a ' + them[0] + '.',
    );
  }
} 

// variable name about bifurcating futures based on your choice
var __ = 'Now they come for you—';
if (spokeOut) {
  __ += 'and those you spoke for stand beside you.';
} else {
  __ += 'and there is no one left to speak for you.';
}

alert(__);
