import {player, cursors} from "./levels.js";
import { levelText, level } from "./create.js";

export default function update() {
  player.setVelocity(0);

  levelText.setText("Nivel: " + level);

  if (cursors.left.isDown) {
      player.setVelocityX(-200);
  } else if (cursors.right.isDown) {
      player.setVelocityX(200);
  }

  if (cursors.up.isDown) {
      player.setVelocityY(-200);
  } else if (cursors.down.isDown) {
      player.setVelocityY(200);
  }
}
