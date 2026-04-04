/* break into many wonderful snippets
  a function that is different if `new`d or called normally
    potato-potato.js

*/

// can't modify top-level state properties after app is initiated
// can directly modify state by passing in functions that return partial states
// call without 'new' to get a basic currying app
// call with 'new' to build a self-logging meta-app
//  the log is an array accessible only by 'this.log' in convolution.prototype.meta
//  can extend/modify meta access by overwriting convolution.prototype.meta
//  in meta you have access by 'this' to an object bound within each app instance
//  modifying meta applies directly to all self-logging instances in current runtime by inheritance
//  'this' is really just an object bound
//    you can use it to keep any notes about the instance by passing payloads through instance()
//    and handling them in meta
//    the only thing you can't mess with is the .log it will always be there, and it will be an array
// to kill meta access for each instance, simply have conv.proto.meta redirect 'this's __proto__
//  to resurrect meta, call inst('meta') will give you a pointer to the bound meta
//    Object.setPrototypeOf(instance('meta'), convolution.prototype)  will fix it
// initializing actions not an object leaves the app with no methods, but still able to accept partial state functions
// initializing with state not an object leaves 'no state here' as the permanant state
// can turn bound this into a full oop program that feels almost functional by {action: '', args: []}
// assume people don't use both in a note

// ------ using .meta ------

const papp = new convolution();
convolution.prototype.meta = function () {
  this.a = 0;
  this.add = (x) => this.a + x;
};
papp({ e: 4 }); //-> undefined
convolution.prototype.meta = function (args) {
  return this[args.act](args.args);
};
convolution.prototype.meta = function () {
  this.a = 0;
  this.add = function (x) {
    return this.a + x;
  };
};
papp({ args: 3, act: "add" }); //-> undefined
convolution.prototype.meta = function (args) {
  return this[args.act](args.args);
};
papp({ args: 3, act: "add" }); //-> 3

// ------ the thing ------

// {state:{}, actions:{f}, methods:{f}, functions:{f}, name:anything} -> framework instance
function convolution(args) {
  let clean_args = {};
  if (isObject(args)) {
    clean_args.state = isObject(args.state) ? args.state : "no state here";

    clean_args.actions = isObject(args.actions)
      ? args.actions
      : "no actions here";
    clean_args.methods = isObject(args.methods)
      ? args.methods
      : "no methods here";
    clean_args.functions = isObject(args.functions)
      ? args.functions
      : "no functions here";
    clean_args.routines = isObject(args.routines)
      ? args.routines
      : "no routines here";

    clean_args.name = args.name !== undefined ? args.name : "no name here";
  } else {
    clean_args.state = "no state here";

    clean_args.actions = "no actions here";
    clean_args.methods = "no methods here";
    clean_args.functions = "no functions here";
    clean_args.routines = "no routines here";

    clean_args.name = "no name here";
  }

  let meta;
  const newed = this instanceof convolution;
  if (newed) {
    meta = this;
    meta.log = log;
    meta.state = clean_args.state;
    meta.actions = clean_args.actions;
    meta.methods = clean_args.methods;
    meta.functions = clean_args.functions;
    meta.routines = clean_args.routines;
    meta.name = clean_args.name;
  } else {
    meta = "no meta here";
  }

  let instance;
  with (clean_args) {
    instance = function me(arg) {
      // update state directly by passing in partial states
      // return the instance itself for chaining
      if (isObject(arg)) {
        update_state(arg, state);

        return me;

        // calls args with a copy of state
        //  allows updating state with curried functions
      } else if (arg instanceof Function) {
        try {
          const result = arg(copy(state));
          if (result instanceof Error) {
            throw result;
          } else {
            return me(result);
          }
        } catch (err) {
          throw err;
        }

        // seeds a pipeline with a copy of state
        // passes on final result for state update
      } else if (arg instanceof Array) {
        let last_result = copy(state);
        for (const item of arg) {
          if (item instanceof Function) {
            last_result = item(last_result);
          } else {
            last_result = copy(item);
          }
        }
        me(last_result);

        /* free-variable 'this' cache
        you can bind your instance to an object
        call it with one
        or set it as a property in different objects
          for more flexibility
        caches are logged by reference
          since they're temporary and dynamic
          it makes sense to know which one was active
          rather than what was in it
        many initializations, one shared cache
        eventually, make this work in node as well
      */
      } else if (arg === "cache") {
        if (this instanceof Window) {
          return "no cache here";
        } else {
          return this;
        }

        // return a copy of the log
      } else if (arg === "log") {
        return copy(log);

        // return a copy of the state
      } else if (arg === "state") {
        return copy(state);

        // return a copy of the name
      } else if (arg === "name") {
        return name;

        // return a reference to all pre-installed
        //  functions, actions, methods
      } else if (arg === "stories") {
        return { actions, methods, functions, routines };

        // explicitly nothing
      } else if (arg === undefined) {
        return null;

        // return meta object, if it exists
        // like an admin-level access to all live instances
        //  can't modify properties, but can state & log
      } else if (arg === "meta") {
        if (newed) {
          if (!(meta instanceof convolution)) {
            return "you killed meta";
          } else {
            return meta;
          }
        } else {
          return meta;
        }

        // add a note to the log and return the log
      } else {
        return copy(log);
      }
    };

    // allows to insert note into log whenever a thing is done
    //  inserts the note and returns a reference to the instance
    instance.note = function (arg) {
      log.push(arg);
      return this;
    };

    // sets meta as prototype of an object
    if (newed) {
      instance.enmeta = function (obj) {
        return Object.setPrototypeOf(obj, meta);
      };
    }

    // binding sets the cache on a new copy of the instance
    instance.cache = function (cache, id) {
      if (!isObject(cache)) {
        return new Error("cache must be an object");
      }
      const bound_to_cache = Function.prototype.bind.call(instance, cache);
      const methoded = Object.setPrototypeOf(bound_to_cache, this);
      methoded.id = id;
      return methoded;
    };

    // cool things can be done with caches
    if (isObject(routines)) {
      for (const _routine in routines) {
        if (routines[_routine] instanceof Function) {
          function wrapper() {
            const result = routines[_routine].call(this, ...arguments);
            return result;
          }
          instance[_routine] = wrapper;
        }
      }
    }

    // wraps all actions, functions, methods, curried or bound functions
    //  anywhere anything happens to state, you will know
    function log_wrapper(wrapped, name) {
      return function () {
        const result = wrapped(...arguments);

        if (result instanceof Error) {
          throw result;
        } else {
          update_state(result, state);
          if (this instanceof Window) {
            return copy(state); // if bound or curried function
          } else {
            return this;
          }
        }
      };
    }

    if (isObject(state)) {
      // attach a currying method
      instance.curring = function (func, name) {
        if (func instanceof Function) {
          const to_wrap = func(state);
          return log_wrapper(to_wrap, name ? name : "something curried");
        } else {
          throw new Error("can only curry functions");
        }
      };

      instance.binding = function (func, name) {
        if (func instanceof Function) {
          const to_wrap = func.bind(state);
          return log_wrapper(to_wrap, name ? name : "something bound");
        } else {
          throw new Error("can only bind functions");
        }
      };
    }

    // do not allow top-level modifications of state
    if (isObject(functions)) {
      // attach pure functions
      for (const _function in functions) {
        if (functions[_function] instanceof Function) {
          const story = _function;
          const functionow = functions[_function];
          const to_wrap = functionow.bind(null, copy(state));
          instance[_function] = log_wrapper(to_wrap, story);
        }
      }
    }

    // do not allow top-level modifications of state
    if (isObject(actions)) {
      // attach action curriers
      for (const action in actions) {
        if (actions[action] instanceof Function) {
          const actionow = actions[action](state);
          const story = action;
          instance[action] = log_wrapper(actionow, story);
        }
      }
    }

    // read-only access to snapshot of state via 'this'
    if (isObject(methods)) {
      // attach bound methods
      for (const method in methods) {
        if (methods[method] instanceof Function) {
          const story = method;
          function to_wrap() {
            const bound_to_state = methods[method].bind(copy(state));
            return bound_to_state(...arguments);
          }
          instance[method] = log_wrapper(to_wrap, story);
        }
      }
    }
  } // end with

  // freeze and return instance so it can't be modified later
  return Object.freeze(instance);

  // closed utility functions
  // by side-effect, to preserve pointers
  function update_state(parstate, state) {
    if (isObject(parstate)) {
      const state_keys = Object.keys(state);
      // console.log(state_keys)
      for (let key of state_keys) {
        // console.log('in')
        // console.log('s: '+state[key], 'p: '+parstate[key]);
        if (parstate.hasOwnProperty(key)) {
          state[key] = parstate[key];
        }
      }
    }
  }
  function copy(thing) {
    if (isObject(thing)) {
      const clone = {};
      for (const key in thing) {
        if (thing !== null && typeof thing === "object") {
          clone[key] = copy(thing[key]);
        } else {
          clone[key] = thing[key];
        }
      }
      return clone;
    } else if (thing instanceof Array) {
      const clone = [];
      for (const item of thing) {
        if (thing !== null && typeof thing === "object") {
          clone.push(copy(item));
        } else {
          clone.push(item);
        }
      }
      return clone;
    } else {
      return thing;
    }
  }
  function isObject(val) {
    if (val === null || typeof val !== "object" || val instanceof Array) {
      return false;
    } else {
      return typeof val === "function" || typeof val === "object";
    }
  }
}

convolution.prototype.word = () => "word";
convolution.prototype.meta = function (pie) {
  return { meta: this, pie, word: this.word() };
  /*
                                  passing an array to your app will cause it to call this methods.
                                    the array will be spread into this function
                                  'this' inside here will be set to your app's 'meta' with a property
                                  pointing to state, actions, methods, functions, log & name
                                  as well as access to anything else attached to this prototype

                                  so in this function you can write any meta-script you please
                                  simply develop your own meta function and reassign it here

                                  or overwrite 'meta' on any cache-bound instance for different metaing
                                */
};

/*  a thing
  can't have undefined in a state property or it goes away
  say in docs use null for explicitly nothing?
  or find a way around this?
    i like null as a separate thing
*/
