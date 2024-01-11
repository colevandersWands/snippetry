setTimeout(function happyNewYear(lastYear = new Date().getFullYear()) {
  const thisYear = new Date().getFullYear();
  if (lastYear < thisYear) {
    alert(`🪩 Happy New Year 🪩\n\nGood bye ${lastYear}, hello ${thisYear}.`);
  }
  setTimeout(happyNewYear, 0, thisYear);
});
