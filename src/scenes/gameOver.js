export function showGameOverMessage(scene) {
    const gameOverText = scene.add.text(650, 325, "¡Has perdido! Haz clic para reiniciar", {
        fontSize: "42px",
        fill: "#a52811",
        backgroundColor: "#000000",
    })
    .setOrigin(0.5)
    .setInteractive();

    gameOverText.on("pointerdown", () => {
        gameOverText.destroy();
        scene.scene.restart();
        scene.physics.resume();
        level = 1;
        score = 0;
    });
}

export function showNextLevelButton(scene) {
    const startButton = scene.add.text(650, 325, "¡Siguiente Nivel! " + (level + 1), {
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

function nextLevel(scene) {
    worker.postMessage({ level });
    level++;
    levelText.setText("Nivel: " + level);
    score += 5;

    if (score > highScore) {
        highScore = score;
    }

    scoreText.setText("Puntuación: " + score);
    highScoreText.setText("Puntuación Máxima: " + highScore);

    scene.physics.resume();
    scene.scene.restart();
}
