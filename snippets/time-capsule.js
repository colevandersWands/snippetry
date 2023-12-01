(function timeCapsule(wisdom = prompt('Share some wisdom with the future:')) {
  if (wisdom) setTimeout(alert, 2147483647, wisdom);
  else timeCapsule();
})();
