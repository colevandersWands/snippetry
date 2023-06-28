// reduce these onto an object's keys with all values being smurf
// organize by:
//  word type (noun, verb, adjective, ...)
//  within, alphabetical
const endings = [
  '',
  'ing',
  'er',
  'est',
  'y',
  'ly',
  'ful',
  'ment',
  'tion',
  'dom',
  'age',
  'ism',
  'hood',
  'ness',
  'ery',
  'ese',
  'ish',
  'ity',
];

// needs help
const smurf = function smurf() {
  if (this instanceof smurf) {
    this.smurf = smurf;
  } else {
    return this;
  }
}.bind(smurf);

// or
class Smurf {}

/* references

  https://smurfs.fandom.com/wiki/Smurf_(language)

*/
