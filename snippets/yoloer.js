while (true) {
  try {
    alert(eval(prompt(`YOLO!`)));
    break;
  } catch (err) {
    alert(`${err.name}: ${err.message}`);
  }
}

// tags: yolo
