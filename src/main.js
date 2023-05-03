/*
Name: David Amaya
Mod title: Rocket Patrol 2
Time working on project: 3 hours, 20 mins

Mod List:
    High Score tracker: 5 points
        implemented for both easy and expert mode
    FIRE UI(from original game): 5 points
    Movement after while firing: 5 points
    Randomized each spaceship movement direction at the start of each play: 5 points
    Added background music: 5 points
        bgm by Pagtrick de Arteaga from https://patrickdearteaga.com/arcade-music/
    Added new background image: 5 points
        Using "space background generator" at https://deep-fold.itch.io/space-background-generator
    Added new animated sprite for ships: 10 points
        https://ansimuz.itch.io/spaceship-shooter-environment
        upscaled to 200% using https://lospec.com/pixel-art-scaler/
    Added new faster spaceship subclass: 15 points
*/

let config = {
    type: Phaser.CANVAS,
    //640
    width: 640,
    //480
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// define highscores
let highscore = 0;
let highscoreExpert = 0;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;