var combien = (function d_etages(y_a_t_il) {
  try {
    return d_etages(y_a_t_il + 1);
  } catch (je_l_ignore) {
    return y_a_t_il;
  }
})(0);

console.log(
  '\n' +
    'C’est l’histoire d’un homme qui tombe d’un immeuble de ' +
    combien +
    ' étages.' +
    '\n\n' +
    'Le mec, au fur et à mesure de sa chute, il se répète sans cesse pour se rassurer:' +
    '\n\n',
);

try {
  (function la_chute() {
    console.log('jusqu’ici tout va bien.');
    la_chute();
  })();
} catch (l_importance) {
  l_importance.message = 'c’est l’atterrissage.';
  throw l_importance;
} finally {
  console.log('\n' + "Mais l'important n’est pas la chute," + '\n\n');
}

// credit: la haine
