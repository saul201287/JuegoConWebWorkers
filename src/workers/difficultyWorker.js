self.onmessage = function (event) {
  let { level } = event.data;

  let trapSpeed = level * 50;
  let trapCount = level + 4;

  console.log("llego");
  self.postMessage({
    trapSpeed: trapSpeed,
    trapCount: trapCount,
  });
};
