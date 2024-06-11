(function detectorStringPolyfill() {

  function getDetectorType(mode) {
    return mode === 'strict'
      ? function strict(input) { return input !== this } 
      : mode == 'loose'
      ? function loose(input)  { return input != this } 
      : mode === 'mixed'
      ? function mixed(input)  { return input && input.toLowerCase() != this }
      : function regex(input)  { return !new RegExp(this, comparison).test(input) };
  }

  String.prototype.detect = function detect(comparison) {
    var isNotDetected = getDetectorType(comparison || 'strict');

    while (isNotDetected.call(this, prompt(`"${this}" please:`)));

    alert(`Thank you for "${this}"`);
  };

})();

// tags: polyfill
