export const turtlje = (c = document.createElement('canvas')) => {
  c = typeof c === 'string' ? document.getElementById(c) : c;
  const pad = c.getContext('2d');
  const state = { col: 'black', width: 1, deg: 0, x: c.width / 2, y: c.height / 2 };
  const turtle = {
    backward: (pixels) => forward(-pixels),
    color: (col) => ((state.col = col), turtle),
    dot: (diameter) => {
      pad.beginPath();
      pad.arc(state.x, state.y, diameter / 2, 0, 2 * Math.PI);
      pad.fillStyle = state.col;
      pad.lineWidth = state.width;
      pad.fill();
      return turtle; },
    forward: (pixels) => {
      pad.beginPath();
      pad.moveTo(state.x, state.y);
      state.x += -Math.cos((state.deg / 180) * Math.PI) * pixels;
      state.y += -Math.sin((state.deg / 180) * Math.PI) * pixels;
      pad.lineTo(state.x, state.y);
      pad.strokeStyle = state.col;
      pad.lineWidth = state.width;
      pad.stroke();
      return turtle; },
    goto: (x, y) => {
      state.x = x + c.width / 2;
      state.y = y + c.height / 2;
      return turtle; },
    left: (deg) => turtle.right(-deg),
    right: (deg) => {
      state.deg = (deg + state.deg) % 360;
      return turtle; },
    width: (pixels) => {
      state.width = pixels;
      return turtle; },
  };
  return { _pad: pad, _state: state, ...turtle };
};

export default turtlje;

// tags: minibrary
