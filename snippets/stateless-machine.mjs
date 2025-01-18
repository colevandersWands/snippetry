const DOCS = `statelessMachine(transitions)(state)(event)

transitions -> { 
  state: { event: state }, 
  state: { event: { state, act: ({ prev, event, next}) => {} } } 
  state: { event: { state, act: [() => {}, () => {}, ...] } } 
}`;

const copy = (src) =>
  Array.isArray(src)
    ? src.map(copy)
    : src?.__proto__?.__proto__ === null
    ? Object.fromEntries(Object.entries(src).map(([k, v]) => [k, copy(v)]))
    : src;

export function statelessMachine(_transitions = null) {
  if (!_transitions) return `\n\n---\n\nDOCS: ${DOCS}\n\n---\n\n`;
  const transitions = copy(_transitions);

  return function setting(state = '') {
    if (!state) return copy(transitions);
    if (!transitions[state]) return null;

    return function transitioning(event = '') {
      if (!event) return copy(transitions[state]);

      const next = transitions[state][event];
      if (!next) return null;
      if (typeof next == 'string') return { prev: state, event, next };
      if (!next.state && !next.act) return null;

      const transition = { prev: state, event, next: next.state };
      if (next.state && !next.act) return transition;

      if (typeof next.act === 'function') next.act({ ...transition });
      else if (Array.isArray(next.act)) for (const fn of next.act) fn({ ...transition });
      return transition;
    };
  };
}

// tags: minibrary
