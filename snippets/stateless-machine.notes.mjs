const transitions = {
  stateN: {
    eventX: {
      cb: [()=>{}] || ()=>{},
      next: 'stateM',
    },
  },
};

/* - nope, not worried about all this
Definition 2.2.1 A finite automaton is a 5-tuple M = (Q, Σ, δ, q, F ), where 
  1. Q is a finite set, whose elements are called states,
  2. Σ is a finite set, called the alphabet; the elements of Σ are called symbols, 3. δ : Q × Σ → Q is a function, called the transition function,
  4. q is an element of Q; it is called the start state,
  5. F is a subset of Q; the elements of F are called accept states.
*/
