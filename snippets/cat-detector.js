do {
  var maybeCat = prompt('please enter "cat"');
} while (!maybeCat);

if (maybeCat !== 'cat') {
  alert('"' + maybeCat + '" is not a cat');
} else {
  alert('thank you for the cat');
}
