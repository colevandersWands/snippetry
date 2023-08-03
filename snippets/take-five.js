const FIVE_MINUTES = 300000; // milliseconds
const CLOCK_OUT = Date.now();

const on_break = () => Date.now() - CLOCK_OUT < FIVE_MINUTES;

get_some_fresh_air: while (on_break()) {
  alert('break time, take 5!');
}

// tags: wellbeing
