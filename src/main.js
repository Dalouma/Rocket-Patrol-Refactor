/*
Name: David Amaya
Mod title: Rocket Patrol 2
Time working on project: 5 hours, 50 mins

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
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
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