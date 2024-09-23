import config from "../config.js";
import createLevel from "./levels.js";

let background;
let scoreText;
let highScoreText;
export let levelText, level = 1, score = 0, highScore = 0;;

function create() {
  let worker = new Worker("../workers/worker.js");

  worker.onmessage = function (event) {
    const { newLevel } = event.data;
    level = newLevel;

    if (levelText) {
      levelText.setText("Nivel: " + level);
    }
  };

  background = this.add.image(0, 0, "background").setOrigin(0);
  background.setDisplaySize(config.width, config.height);
  createLevel(this, level, background);

  scoreText = this.add.text(910, 5, "Puntuación: " + score, {
    fontSize: "24px",
    fill: "#ffffff",
    backgroundColor: "#000000",
    align: "left",
  });

  highScoreText = this.add.text(540, 5, "Puntuación Máxima: " + highScore, {
    fontSize: "24px",
    fill: "#ffffff",
    backgroundColor: "#000000",
    align: "left",
  });

  levelText = this.add.text(1210, 5, "Nivel: " + level, {
    fontSize: "24px",
    fill: "#ffffff",
    backgroundColor: "#000000",
    align: "right",
  });
}

export default create;



traps = scene.physics.add.group();
for (let i = 0; i < level + 4; i++) {
  const trap = traps.create(
    Phaser.Math.Between(100, 1200),
    Phaser.Math.Between(100, 550),
    "trap"
  );
  trap.setScale(0.5);
  trap.setVelocity(
    Phaser.Math.Between(-100, 100),
    Phaser.Math.Between(-80, 400)
  );
  trap.setCollideWorldBounds(true);
  trap.setBounce(1);
}