export const runStory = async (storyTitle = '', transition = '') => {
  if (transition) console.group(`%c${transition}`, 'font-weight: bold;');
  try {
    await import(storyTitle);
  } catch (err) {
    console.error(err);
  }
  if (transition) console.groupEnd();
};

export const tellStory = (medium = console.log) =>
  async function recount(storyTitle = '', transition = '') {
    if (transition) console.group(`%c${transition}`, 'font-weight: bold;');
    try {
      await medium(await fetch(storyTitle).then((res) => res.text()));
    } catch (err) {
      console.error(err);
    }
    if (transition) console.groupEnd();
  };

export const logStory = tellStory();

export const alertStory = tellStory(alert);

export default runStory;

// tags: minibrary
