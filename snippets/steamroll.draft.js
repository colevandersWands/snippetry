// how to find the line number in an error?
// otherwise set a global listener

window.addEventListener('error', (e) => {
  console.log(e);
});

steamroll('asdf');

function steamroll(code, refactors) {
  code = code || '';
  refactors = refactors || [];

  try {
    eval(code);
  } catch (err) {
    console.error(err);
  }
}

// inspiration: https://github.com/mattdiamond/fuckitjs
