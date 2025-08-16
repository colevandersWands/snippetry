import { withify } from './withify.mjs';

const transparency = {
  remember_that: 'let',
  stores: '=',
  as_long_as: 'while',
  is_less_than: '<',
  add_one_to: '++',
  show_me: 'alert',
};

withify(transparency)(() => {
  eval(`

${remember_that} i ${stores} 0;

${as_long_as}( i ${is_less_than} 5 )${add_one_to} i;

${show_me}( i );

`);
});
