/*
	visit(tree, [
		{
			test: () => {},
			before: () => {},
			during: () => {},
			after: () => {}
		},
		...
	])

*/

export const visit = (_actions = null) => {
  const actions = Array.isArray(_actions)
    ? _actions
    : actions?.__proto__ === Object.prototype
    ? [_actions]
    : null;

  if (actions === null) {
    return function visiterIdentity(node = {}) {
      return tree;
    };
  }

  return function visiter(node = {}) {
    const doThis = actions.filter((action) => action(node));
  };
};
