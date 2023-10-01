const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    alert(successful ? message : "nope, couldn't copy the link.\ntry again");
  } catch (err) {
    alert("nope, couldn't copy the link.\ntry again");
  }

  document.body.removeChild(textArea);
  window.scrollTo(0, 0);
};

export const copyCode = (code, message = 'copied!') => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(code);
    return;
  }

  navigator.clipboard.writeText(code).then(
    () => alert(message),
    () => fallbackCopyTextToClipboard(code),
  );
};
