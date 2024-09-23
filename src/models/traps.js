import { showGameOverMessage } from "./messages.js";

export function hitTrap(player, trap) {
  player.setTint(0xff0000);
  this.physics.pause();

  const bubbleWidth = 150;
  const bubbleHeight = 50;
  const bubblePointerSize = 15;

  const bubble = this.add.graphics({ fillStyle: { color: 0xff0000 } });
  bubble.fillRoundedRect(trap.x - bubbleWidth / 2, trap.y - bubbleHeight - 50, bubbleWidth, bubbleHeight, 10);
  bubble.fillTriangle(trap.x - bubblePointerSize, trap.y - 50, trap.x + bubblePointerSize, trap.y - 50, trap.x, trap.y - 50 + bubblePointerSize);

  const trapMessage = this.add.text(trap.x, trap.y - 75, "¡Te atrapé!", {
    fontSize: "20px",
    fill: "#ffffff",
  }).setOrigin(0.5);

  this.time.delayedCall(2000, () => {
    bubble.destroy();
    trapMessage.destroy();
  });

  showGameOverMessage(this);
}
