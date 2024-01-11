const lastYear = new Date().getFullYear();
let thisYear = lastYear;

while (lastYear === thisYear) thisYear = new Date().getFullYear();

alert('🪩 Happy New Year 🪩');
