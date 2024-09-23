import preload from "./scenes/preload.js";
import create from "./scenes/create.js";
import update from "./scenes/update.js";

const config = {
    width: 1360,
    height: 678,
    parent: "game-container",
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



export default config;  