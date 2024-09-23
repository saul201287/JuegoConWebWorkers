self.onmessage = function (event) {
  const { score, level } = event.data;

  const newLevel = level + 1;
  const newScore = score + 5;
  self.postMessage({ newLevel, newScore });
};
