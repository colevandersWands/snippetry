// https://jsfiddle.net/captbaritone/x893Lqk5

var min_freq = 10;
var max_freq = 40000;
var steps_per_loop = 12;
var seconds_per_loop = 5;

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);

setVolume(0); // Initialize volume to match range input
var playing = false;

var step_speed = 1000 * seconds_per_loop / steps_per_loop;
var multiplier = Math.pow(2, 1/steps_per_loop)
var current_step = 0;
var oscillators = [];

function shepardLoop () {
    base_freq = min_freq;
    for(i = 0; base_freq < max_freq; i++) {
        if(oscillators[i]) oscillators[i].stop(0);
        freq = base_freq * Math.pow(multiplier, current_step);
        oscillator = audioCtx.createOscillator();
        oscillator.frequency.value = freq; // value in hertz
        oscillator.connect(gainNode);
        oscillator.start(0);
        oscillators[i] = oscillator;
        base_freq = base_freq * 2;
    }
    current_step = (current_step + 1) % steps_per_loop;
    setTimeout(shepardLoop, step_speed);
}

function start() {
    if(!playing) {
        playing = true;
        shepardLoop();
    }
}
function setVolume(volume) {
    gainNode.gain.value = volume / 100 / 12;
}