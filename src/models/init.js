import { showTrapMessage, showGameOverMessage, showNextLevelButton } from './messages.js';
import preload from "../scenes/preload.js"

const config = {
  width: 1360,
  height: 678,
  parent: "pantalla",
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
let score = 0;
let highScore = 0;
let scoreText,
  highScoreText,
  player,
  cursors,
  traps,
  walls,
  goal,
  level = 1;
let background;
let levelText;
let isImmune = false;  
let bonusBox;        
let difficultyWorker;
const backgrounds = [
  "background",
  "background2",
  "background3",
  "background4",
  "background5",
  "background6",
];
let currentBackgroundIndex = 0;
let worker, trapWorker;

var game = new Phaser.Game(config);



function create() {
  worker = new Worker("../../src/workers/worker.js");
  trapWorker = new Worker("../../src/workers/trapWorker.js");
  difficultyWorker = new Worker("../../src/workers/difficultyWorker.js");

  worker.onmessage = function (event) {
    const { newLevel, newScore } = event.data;
    level = newLevel;
    score = newScore;

    levelText.setText("Nivel: " + level);
    scoreText.setText("Puntuación: " + score);

    if (score > highScore) {
      highScore = score;
    }

    highScoreText.setText("Puntuación Máxima: " + highScore);

    this.physics.pause();

    this.time.delayedCall(
      500,
      () => {
        this.scene.restart();
        this.physics.resume();
      },
      [],
      this
    );
  }.bind(this);

  background = this.add.image(0, 0, "background").setOrigin(0);
  background.setDisplaySize(config.width, config.height);
  createLevel(this, level);

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

function createLevel(scene, level) {
  player = scene.physics.add
    .sprite(50, 50, "player")
    .setCollideWorldBounds(true);
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

  let positionValid = false;
  let bonusBoxX, bonusBoxY;

  while (!positionValid) {
    bonusBoxX = Phaser.Math.Between(100, 1200);
    bonusBoxY = Phaser.Math.Between(100, 550);
    
    positionValid = true;
    walls.children.iterate((wall) => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(
          new Phaser.Geom.Rectangle(bonusBoxX, bonusBoxY, 32, 32), 
          wall.getBounds())) {
        positionValid = false; 
      }
    });
  }
  bonusBox = scene.physics.add.staticSprite(bonusBoxX, bonusBoxY, "box");
  bonusBox.setScale(0.1); 
  bonusBox.refreshBody(); 

  traps = scene.physics.add.group();
  difficultyWorker.postMessage({ level });

  difficultyWorker.onmessage = function(event) {
    const { trapSpeed, trapCount } = event.data;

    

    for (let i = 0; i < trapCount; i++) {
      const trap = traps.create(
        Phaser.Math.Between(100, 1200),
        Phaser.Math.Between(100, 550),
        "trap"
      );
      trap.setScale(0.5);
      
      const speedX = Phaser.Math.Between(-trapSpeed, trapSpeed);
      const speedY = Phaser.Math.Between(-80, 450);
      trap.setVelocity(speedX, speedY);
      
      trap.setCollideWorldBounds(true);
      trap.setBounce(1);  
    }
  };
 console.log(traps);
 
  scene.physics.add.collider(player, walls);
  scene.physics.add.overlap(player, traps, hitTrap, null, scene);
  scene.physics.add.overlap(player, goal, reachGoal, null, scene);
  scene.physics.add.overlap(player, bonusBox, collectBonus, null, scene);
  scene.physics.add.collider(bonusBox, walls);

  cursors = scene.input.keyboard.createCursorKeys();

  currentBackgroundIndex = Phaser.Math.Between(0, backgrounds.length - 1);
  background.setTexture(backgrounds[currentBackgroundIndex]);
  background.setDisplaySize(config.width, config.height);
}

function collectBonus(player, bonusBox) {
  bonusBox.destroy();  
  activateImmunity(player);
}


function activateImmunity(player) {
  isImmune = true;
  player.setTint(0x00ff00); 

  immunityTimer = player.scene.time.delayedCall(3000, () => {
    isImmune = false;
    player.clearTint();  
  });
}

function update() {
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

function reachGoal(player, goal) {
  goal.destroy();
  this.physics.pause();
  showNextLevelButton(this, level);
}

function hitTrap(player, trap) {
  if (!isImmune) {  
    player.setTint(0xff0000);
    this.physics.pause();

    trapWorker.postMessage({
      trapX: trap.x,
      trapY: trap.y,
      message: "¡Te atrapé!",
    });

    trapWorker.onmessage = function (event) {
      const { message, x, y } = event.data;
      showTrapMessage(this, trap, message); 
    }.bind(this);

    showGameOverMessage(this); 
    level = 1; 
    score = 0; 
  }
}

export function nextLevel(scene) {
  worker.postMessage({ score, level });
  worker.onmessage = function (event) {
    const { newLevel, newScore } = event.data;

    level = newLevel;
    score = newScore;
    if (score > highScore) {
      highScore = score;
      highScoreText.setText("Puntuación maxima: " + highScore);
    }

    levelText.setText("Nivel: " + level);
    scoreText.setText("Puntuación: " + score);

    scene.scene.restart();
    scene.physics.resume();
  };
  isImmune = false;
  scene.physics.pause();
}
