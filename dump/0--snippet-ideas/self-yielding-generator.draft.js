// https://github.com/denysdovhan/wtfjs@a-generator-which-yields-itself

function* f() {
  yield f;
}

// https://stackoverflow.com/a/34108006
