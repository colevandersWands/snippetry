// for funsole

export const emoj = (text = '') => {
  if (typeof text != 'string') console.log(text);
  else console.log( Object.entries({
      chicken: '🐔', egg:'🥚', belgium: '🇧🇪' // ...
    }).reduce((emojied, [word, emoji]) => emojied.replace(new RegExp(word,'gi'), emoji), text));
};

export default emoj;
