const copy = (src) =>
  Array.isArray(src)
    ? [...src] :
  src?.__proto__?.__proto__ === null
    ? Object.fromEntries(Object.entries(src).map(([k, v]) => [k, copy(v)])) :
  src;


function initializing(transitions = null) {
  if (!transitions) return 'DOCS: statelessMachine(transitions)(state)(event)';
  transitions = copy(transitions);

  return function setting(state = '') {
    if (!state) return copy(transitions);
    if (!transitions[state]) return null;

    return function transitioning(event = '') {
      if (!event) return copy(transitions[state]);

      const next = transitions[state][event];
      if (!next) return null;
      if (typeof next == 'string') return { prev: state, event, next };
      if (!next.state && !next.se) return null;

      const transition = { prev: state, event, next: next.state };
      if (next.state && !next.se) return transition;

      if (typeof next.se === 'function') next.se({ ...transition });
      else if (Array.isArray(next.se)) for (const fn of next.se) fn({ ...transition });
      return transition;
    };
  };
}


export const statelessMachine = initializing;


// tags: minibrary
