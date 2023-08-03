export const runStory = async (storyTitle = '', transition = storyTitle) => {
  if (transition) console.group(`%c${transition}`, 'font-weight: bold;');
  try {
    await import(storyTitle);
  } catch (err) {
    console.error(err);
  }
  if (transition) console.groupEnd();
};

export const logStory = async (storyTitle = '', transition = '') => {
  if (transition) console.group(`%c${transition}`, 'font-weight: bold;');
  try {
    console.log(await fetch(storyTitle).then((res) => res.text()));
  } catch (err) {
    console.error(err);
  }
  if (transition) console.groupEnd();
};

export const alertStory = async (storyTitle = '', transition = '') => {
  try {
    alert(`${transition}${await fetch(storyTitle).then((res) => res.text())}`);
  } catch (err) {
    alert(err.toString());
  }
};

export default { runStory, logStory, alertStory };

// tags: minibrary
