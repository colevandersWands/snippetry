// coAIthored from Claude
function instrumentFunction(fn) {
  const callTree = { name: fn.name, calls: [] };
  let currentNode = callTree;

  function wrapped(...args) {
    const node = { name: fn.name, args, calls: [], parent: currentNode };
    currentNode.calls.push(node);

    const prevNode = currentNode;
    currentNode = node;

    try {
      const result = fn.apply(this, args);
      node.result = result;
      return result;
    } catch (error) {
      node.error = error;
      throw error;
    } finally {
      currentNode = prevNode;
    }
  }

  wrapped.callTree = callTree;

  return wrapped;
}

// Example usage:
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const instrumentedFibonacci = instrumentFunction(fibonacci);
const result = instrumentedFibonacci(4);

console.log(JSON.stringify(instrumentedFibonacci.callTree, null, 2));
