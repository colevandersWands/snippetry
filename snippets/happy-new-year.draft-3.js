count_down: {
  let thisYear = new Date().getFullYear();

  setInterval(function happyNewYear() {
    const lastYear = thisYear;
    thisYear = new Date().getFullYear();
    if (lastYear < thisYear) {
      alert(`🪩 Happy New Year 🪩\n\nGood bye ${lastYear}, hello ${thisYear}.`);
    }
  });
}
