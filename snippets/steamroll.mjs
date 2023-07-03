export const steamroll = (code = '', refactors = []) => {
  const refactor = { goodCode: code };
  refactors.push(refactor);

  const sandbox = document.createElement('iframe');

  sandbox.addEventListener('load', () => {
    sandbox.contentWindow.addEventListener('error', ({ lineno, error }) => {
      const lines = code.split('\n');
      (refactor.badCode = refactor.goodCode), delete refactor.goodCode;
      refactor.error = error;
      refactor.guilty = lines.splice(lineno - 1, 1).pop();

      steamroll(lines.join('\n'), refactors);
    });

    const fingersCrossed = document.createElement('script');
    fingersCrossed.innerHTML = code;
    sandbox.contentDocument.body.appendChild(fingersCrossed);
  });

  document.body.appendChild(sandbox);

  return refactors;
};

export default steamroll;

// inspiration: https://github.com/mattdiamond/fuckitjs
