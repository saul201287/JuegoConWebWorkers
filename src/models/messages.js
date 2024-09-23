import { nextLevel } from "./init.js";

export function showTrapMessage(scene, trap, message) {
  const bubbleWidth = 150;
  const bubbleHeight = 40;
  const bubblePointerSize = 5;
  const offsetY = 10; 
  const messageOffsetY = 40; 

  const bubble = scene.add.graphics({ fillStyle: { color: 0xff0000 } });
  bubble.fillRoundedRect(
    trap.x - bubbleWidth / 2,
    trap.y - bubbleHeight - offsetY - messageOffsetY, 
    bubbleWidth,
    bubbleHeight,
    10
  );

  bubble.fillTriangle(
    trap.x - bubblePointerSize,
    trap.y - offsetY - messageOffsetY, 
    trap.x + bubblePointerSize,
    trap.y - offsetY - messageOffsetY,
    trap.x,
    trap.y - offsetY + bubblePointerSize - messageOffsetY
  );

  const trapMessage = scene.add
    .text(trap.x, trap.y -72, message, {
      fontSize: "20px",
      fill: "#ffffff",
    })
    .setOrigin(0.5);

  scene.time.delayedCall(
    5000,
    () => {
      trapMessage.destroy();
      bubble.destroy();
      scene.physics.pause();
    },
    [],
    scene
  );
}


export function showGameOverMessage(scene) {
  const gameOverText = scene.add
    .text(650, 325, "¡Has perdido! Haz clic para reiniciar", {
      fontSize: "42px",
      fill: "#a52811",
      backgroundColor: "#000000",
    })
    .setOrigin(0.5)
    .setInteractive();

  gameOverText.on("pointerdown", () => {
    gameOverText.destroy();
    scene.scene.restart();
    scene.physics.pause();
  });
}

export function showNextLevelButton(scene, level) {
  const startButton = scene.add
    .text(650, 325, "¡Siguiente Nivel! " + (level + 1), {
      fontSize: "42px",
      fill: "#0f3c7d",
      backgroundColor: "#000000",
    })
    .setOrigin(0.5)
    .setInteractive();

  startButton.on("pointerdown", () => {
    startButton.destroy();
    nextLevel(scene);
  });
}
