rm_rf(Array);

rm_rf(globalThis);

function rm_rf(thing) {
  try {
    Reflect.ownKeys(thing);
  } finally {
  }
}
