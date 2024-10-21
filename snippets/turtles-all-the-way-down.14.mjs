await fetch('./turtles-all-the-way-down.13.js')
  .then((res) => res.text())
  .then((turts) => eval('globalThis.' + turts))
  .catch(console.error);

while ('🐢🐢' in turtles) turtles = turtles['🐢🐢'];
