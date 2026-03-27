// https://gist.github.com/livoras/9d995948b412e4c22776

/**
 * @param {Object} settings
 *                 - {String} current
 *                 - {Object} states
 *                 - {Object} actions
 * @constructor
 */
function StateMachine(settings) {
  this._current = settings.initState
  this.actions = settings.actions
  this.states = settings.states
}

let prototype = StateMachine.prototype

prototype.emit = function(eventName) {
  let state = this.states[this._current]
  let transition = state[eventName]
  if (!transition) {
    throw new Error(`Event(${eventName}) of current ` +
      `state(${this._current}) doesn't exist.`)
  }
  let oldState = this._current
  let newState = transition.to
  this._current = newState
  transition.actions.forEach((fnName) => {
    this.actions[fnName].call(this, oldState, newState)
  })
}

prototype.getState = function() {
  return this._current
}

export default StateMechine

// ============================= traffic light demo =============================
let trafficLightState = new StateMachine({
  initState: "init", // Initial State
  
  // All possible states. And describes the events make from current state to another state
  // and actions should be done after the event.
  states: {
    init: { // from state
      start: { // event name
        to: "yellow", // to state
        actions: ["countYellow"] // actions should be done
      },
    },

    yellow: {
      timeout: {
        to: "red",
        actions: ["countRed"]
      }
    },

    red: {
      timeout: {
        to: "green",
        actions: ["countGreen"]
      }
    },

    green: {
      timeout: {
        to: "yellow",
        actions: ["countYellow"]
      }
    }
  },

  // All actions
  actions: {
    countRed: function() {
      console.log("Red!")
      setTimeout(() => {
        this.emit("timeout")
      }, 3000)
    },
    countGreen: function() {
      console.log("Green!")
      setTimeout(() => {
        this.emit("timeout")
      }, 4000)
    },
    countYellow: function() {
      console.log("Yellow!")
      setTimeout(() => {
        this.emit("timeout")
      }, 1000)
    }
  }
})

trafficLightState.emit("start")