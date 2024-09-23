import config from "../config.js";
import { showGameOverMessage, showNextLevelButton } from "../models/messages.js";

export let player, walls, traps, goal, scoreText, highScoreText, cursors;
let currentBackgroundIndex = 0;
const backgrounds = [
  "background",
  "background2",
  "background3",
  "background4",
  "background5",
];

function createLevel(scene, level, background) {
  player = scene.physics.add.sprite(50, 50, "player").setCollideWorldBounds(true);
  player.setScale(1);

  walls = scene.physics.add.staticGroup();
  walls.create(400, 300, "wall").setScale(2).refreshBody();
  walls.create(200, 500, "wall");
  walls.create(600, 100, "wall");
  walls.create(100, 200, "wall");
  walls.create(700, 400, "wall");

  for (let i = 0; i < level * 2; i++) {
    walls.create(
      Phaser.Math.Between(100, 1200),
      Phaser.Math.Between(100, 550),
      "wall"
    );
  }

  goal = scene.physics.add.staticSprite(1250, 600, "goal");

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

  scene.physics.add.collider(player, walls);
  scene.physics.add.overlap(player, goal, () => reachGoal(scene, goal, level), null);
  scene.physics.add.overlap(player, traps, () => hitTrap(player, scene, traps), null);

  cursors = scene.input.keyboard.createCursorKeys();

  currentBackgroundIndex = Phaser.Math.Between(0, backgrounds.length - 1);
  background.setTexture(backgrounds[currentBackgroundIndex]);
  background.setDisplaySize(config.width, config.height);
}

function reachGoal(scene, goal, level) {
  goal.destroy();
  scene.physics.pause();
  showNextLevelButton(scene, level);
}

function hitTrap(player,scene, trap) {
  player.setTint(0xff0000);
  scene.physics.pause();

  const bubbleWidth = 150;
  const bubbleHeight = 50;
  const bubblePadding = 10;
  const bubblePointerSize = 15;

  const bubble = scene.add.graphics({ fillStyle: { color: 0xff0000 } });

  bubble.fillRoundedRect(
    trap.x - bubbleWidth / 2,
    trap.y - bubbleHeight - 50,
    bubbleWidth,
    bubbleHeight,
    10
  );

  bubble.fillTriangle(
    trap.x - bubblePointerSize,
    trap.y - 50,
    trap.x + bubblePointerSize,
    trap.y - 50,
    trap.x,
    trap.y - 50 + bubblePointerSize
  );

  const trapMessage = scene.add
    .text(trap.x, trap.y - 75, "¡Te atrapé!", {
      fontSize: "20px",
      fill: "#ffffff",
    })
    .setOrigin(0.5);

  scene.time.delayedCall(
    2000,
    () => {
      bubble.destroy();
      trapMessage.destroy();
    },
    [],
    scene
  );

  showGameOverMessage(scene);
}

export default createLevel;
