const poison = confirm(
  'Pick Your Poison.\n\n- Iteration: [ok]\n- Recursion: [cancel]',
)
  ? 'iterate'
  : 'recurse';

if (poison === 'iterate') {
  while (true) {
    console.log(poison);
  }
} else if (poison === 'recurse') {
  (function bottomlessish() {
    console.log(poison);
    try {
      bottomlessish();
    } catch (_) {
      bottomlessish();
    }
  })();
} else {
  (function eternival() {
    const id = setInterval(() => (console.log(id), eternival()), 0);
  })();
}
