const deception = {
  forever_shall: 'let',
  pursue: '=',
  eternity: '0',
  should: 'while',
  is_less_than: '<',
  add_one_to: '++',
  show_me: 'alert',
};

with (deception) {
  eval(`

${forever_shall} i ${pursue} ${eternity};

${should}( i ${is_less_than} 5 )${add_one_to} i;

${show_me}( i );

`);
}
