/*  abondoning draft
  makes more sense to accept a constructor like Array
  then wrap its prototype methods as static methods
  -> namespace.mjs
*/

(function trainingWheels() {
  const ignoreKeys = new Set([
    'caller',
    'callee',
    'arguments',
    'length',
    'name',
    'prototype',
  ]);

  function defineGlobalFunctions({
    obj = {},
    nameSoFar = '',
    prefix = '$',
    visited = new Set(),
  } = {}) {
    if (visited.has(obj)) return;
    else visited.add(obj);

    const toTrain = Reflect.ownKeys(obj).filter((key) => !ignoreKeys.has(key));

    if (obj === Array) console.log(obj, toTrain);

    for (const key of toTrain) {
      if (key[0] === '_') continue;

      let value;
      try {
        value = obj[key];
      } catch (err) {
        // console.log('noop:', key, value, err);
      }
      if (value === obj) continue;

      if (
        key &&
        typeof key !== 'symbol' &&
        Object(value) === value &&
        value !== obj
      ) {
        const newNameSoFar = `${nameSoFar}${
          key[0].toUpperCase() + key.slice(1, key.length)
        }`;
        // console.log('new name so far:', newNameSoFar);
        defineGlobalFunctions({
          obj: value,
          nameSoFar: newNameSoFar,
          prefix,
          visited,
        });
        // if (value.prototype) {
        //   defineGlobalFunctions({
        //     obj: value.prototype,
        //     nameSoFar: newNameSoFar,
        //     prefix,
        //     visited,
        //   });
        // }
      }

      if (typeof value === 'function' && typeof key !== 'symbol') {
        const trainingWheel = (that, ...args) => value.apply(that, ...args);
        const wheelName = `${prefix}${nameSoFar}${
          key[0].toUpperCase() + key.slice(1, key.length)
        }`;
        // console.log('wheel name:', wheelName);
        globalThis[wheelName] = trainingWheel;
      }
    }
  }

  defineGlobalFunctions({ obj: globalThis });

  // tags: polyfill

  console.log(globalThis);

  $ConsoleLog(
    $ArrayJoin(
      $ArrayMap(['TRAINING', 'WHEELS', 'INSTALLED'], (s) =>
        $StringToLowerCase(s),
      ),
    ),
    ' ',
  );
})();
