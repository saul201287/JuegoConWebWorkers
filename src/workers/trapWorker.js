self.onmessage = function (event) {
  const { trapX, trapY, message } = event.data;

  self.postMessage({
    message,
    x: trapX,
    y: trapY - 45,
  });
};
