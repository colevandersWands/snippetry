var globalArray = objectToEntries(globalThis);

function objectToEntries(obj, visited) {
  visited || (visited = []);
  visited.push(obj);
  var keys = Reflect.ownKeys(obj);
  var entries = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (typeof value === 'object') {
      if (visited.indexOf(value) !== -1) {
        // use cached value
      } else {
        value = objectToEntries(value, visited);
      }
    }
    entries.push([key, obj[key]]);
  }

  return entries;
}
