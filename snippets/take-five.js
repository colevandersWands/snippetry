// --- set the mood ---

const takeFive = new Audio('./take-five.mp3');
takeFive.loop = false;
takeFive.play();

// --- take a break ---

const FIVE_MINUTES = 300000; // milliseconds
const CLOCK_OUT = Date.now();

const offBreak = () => Date.now() - CLOCK_OUT > FIVE_MINUTES;

const getSomeFreshAir = () =>
  offBreak() ? clearInterval(onBreak) : alert('break time, take five!');

const onBreak = setInterval(getSomeFreshAir, 100);

// tags: wellbeing
