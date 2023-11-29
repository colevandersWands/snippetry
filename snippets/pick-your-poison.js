const poison = confirm(`Pick Your Poison.
- Iteration: [ok]
- Recursion: [cancel]`)
  ? 'iterate'
  : 'recurse';

if (poison === 'iterate') {
  while (true) {
    console.log(poison);
  }
} else if (poison === 'recurse') {
  (function bottomless_ish() {
    console.log(poison);
    try {
      bottomless_ish();
    } catch (_) {
      bottomless_ish();
    }
  })();
} else {
  (function nextInterval() {
    const id = setInterval(() => {
      console.log(id);
      nextInterval();
    });
  })();
}

// tags: wuzzle
