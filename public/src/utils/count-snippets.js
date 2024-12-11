let counterval = 0;

export const countSnippets = (countTo = 0) => {
  if (counterval) clearInterval(counterval);

  let counted = 0;
  counterval = setInterval(function countingSnippets() {
    document.title = 'Snippetry #' + counted;
    if (++counted > countTo) clearInterval(counterval);
  }, 1000);
};
