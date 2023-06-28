const shipit = (motto = '') => {
  try {
    alert(eval(prompt(`${motto}!`)));
  } catch (err) {
    alert(`${err.name}: ${err.message}\n\n${motto}!`);
    shipit(motto);
  }
};

shipit('YOLO');

// tags: yolo
