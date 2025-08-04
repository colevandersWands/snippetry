export const namojify = (fn, emoji = '❔') => ({ [emoji]: (...args) => fn(...args) }[emoji]);
