// --- class ---

class StateMachine {
  constructor(initialState, transitions) {
    this.state = initialState;
    this.transitions = transitions;
  }

  transition(event) {
    const nextState = this.transitions[this.state][event];
    if (nextState) {
      this.state = nextState;
      return true;
    }
    return false;
  }

  currentState() {
    return this.state;
  }
}

// Example usage:
const transitions = {
  off: { switchOn: 'on' },
  on: { switchOff: 'off', reset: 'off' },
};

const machine = new StateMachine('off', transitions);
console.log(machine.currentState()); // Output: "off"
console.log(machine.transition('switchOn')); // Output: true
console.log(machine.currentState()); // Output: "on"
console.log(machine.transition('reset')); // Output: true
console.log(machine.currentState()); // Output: "off"

// --- functional ---

const createStateMachine = (initialState, transitions) => {
  let currentState = initialState;

  const transition = (event) => {
    const nextState = transitions[currentState][event];
    if (nextState) {
      currentState = nextState;
      return true;
    }
    return false;
  };

  const currentStateFn = () => currentState;

  return { transition, currentState: currentStateFn };
};

// Example usage:
const transitions = {
  off: { switchOn: 'on' },
  on: { switchOff: 'off', reset: 'off' },
};

const machine = createStateMachine('off', transitions);
console.log(machine.currentState()); // Output: "off"
console.log(machine.transition('switchOn')); // Output: true
console.log(machine.currentState()); // Output: "on"
console.log(machine.transition('reset')); // Output: true
console.log(machine.currentState()); // Output: "off"
