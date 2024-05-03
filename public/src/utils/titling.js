export const lang = (title = '') => title.split('.').pop();

export const ext = (title = '') => '.' + lang(title);

export const name = (title = '') => title.slice(0, title.length - ext(title).length);
