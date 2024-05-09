/*
  // 'use strict';
*/

const YOLO = 'YOLO';

const walkTheTalk = (motto = YOLO) =>
  prompt(`${motto}!`) || (alert(`${motto} harder!`), walkTheTalk(motto));

const shipit = (code = `"${YOLO}!`) => {
  try {
    alert(eval(code));
  } catch (err) {
    alert(`${err.name}: ${err.message}\n\n${YOLO}!`);
  } finally {
    shipit(walkTheTalk(YOLO));
  }
};

shipit(walkTheTalk(YOLO));

// tags: yolo
