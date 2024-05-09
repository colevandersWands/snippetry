export const namoji = (fn, emoji = '❔') => ({ [emoji]: (...args) => fn(...args) }[emoji]);
