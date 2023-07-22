const storyInAStory = async (narrativeTitle = '') => {
  console.group(`%c${narrativeTitle}`, 'font-weight: bold;');
  try {
    await import(narrativeTitle);
  } catch (err) {
    console.error(err);
  }
  console.groupEnd();
};

export { storyInAStory };
export default storyInAStory;

// tags: minibrary
