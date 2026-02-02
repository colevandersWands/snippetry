import { _spoken_ } from './executable-comment.mjs';

var combien = (function d_etages(y_a_t_il = 0) {
  try {
    return d_etages(y_a_t_il + 1);
  } catch (je_l_ignore) {
    return y_a_t_il;
  }
})();

setTimeout(function je_l_ignore() {
  var _ = new _spoken_({ voice: 'Thomas' });

  _["C'est"]["l'histoire"]["d'un"].homme.qui.tombe["d'un"].immeuble.de[combien].étages;
  _.Le.mec, _.au.fur.et.à.mesure.de.sa.chute, _.il.se.répète.sans.cesse.pour.se.rassurer;

  try {
    (function la_chute(etage = 0) {
      _["Jusq'ici"].tout.va.bien;
      la_chute(etage - 1);
    })(combien);
  } catch (l_atterissage) {
    _.Mais["l'important"]["n'est"].pas.la.chute;
  } finally {
    _["c'est"]["l'attérissage"];
  }
}, 100);

// tribute: la haine
