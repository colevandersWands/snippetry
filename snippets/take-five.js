const FIVE_MINUTES = 300000; // milliseconds

const clock_out = Date.now();

const on_break = () => Date.now() - clock_out < FIVE_MINUTES;

get_some_fresh_air: while (on_break()) {
  alert('break time, take 5!');
}
