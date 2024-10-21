const hog = '🐖';
const hogpile = hog + 'pile';

({  [hog]: function () { try { this[hog]() } catch (pile) {
     pile.name = hogpile + '!';
     pile.message = pile.message.replace('call stack', hogpile);
     console.error(pile);
}}})[hog]();

// tags: wuzzle, useless