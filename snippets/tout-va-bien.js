var combien = (function dEtages(yAtIl) {
  try {
    return dEtages(yAtIl + 1);
  } catch (jMenFous) {
    return yAtIl;
  }
})(0);

console.log(
  '\nC’est l’histoire d’un homme qui tombe d’un immeuble de ' +
    combien +
    ' étages.\n\n' +
    'Le mec, au fur et à mesure de sa chute, il se répète sans cesse pour se rassurer:\n\n',
);

try {
  (function laChute() {
    console.log('jusqu’ici tout va bien.');
    laChute();
  })();
} catch (lImportance) {
  lImportance.message = 'c’est l’atterrissage.';
  throw lImportance;
} finally {
  console.log('\n' + "Mais l'important n’est pas la chute," + '\n\n');
}

// credit: la haine
