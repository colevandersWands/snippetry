import { spoken, unspoken } from './executable-comment.mjs';

const _ = unspoken;
const __ = spoken;

// __.Hello.Tom;
// __.What.a.nice.hat(_.for.a.loser);

const __Robert__ = new __({ voice: 'Organ', pitch: 2, rate: 0.5 });
const __Alice__ = new __({ pitch: 2 });

setTimeout(() => {
  __Robert__.Am.I.a.frenchman.from.Quebec?._;
  __Alice__.No.Robert;
  __Robert__.Awww.damn(':(').that.was.always.my.dream;
}, 50);
