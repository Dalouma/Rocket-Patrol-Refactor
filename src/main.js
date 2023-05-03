/*
Name: David Amaya
Mod title: Rocket Patrol: Galaxy
Time working on project: ~ 14 hours

Mod List:
    5 pts: High Score tracker
        implemented for both easy and expert mode
    5 pts: FIRE UI(from original game)
    5 pts: Movement after while firing
    5 pts: Randomized each spaceship movement direction at the start of each play
    5 pts: Added background music
        bgm by Pagtrick de Arteaga from https://patrickdearteaga.com/arcade-music/
    5 pts: Added new background image
        Using "space background generator" at https://deep-fold.itch.io/space-background-generator
    10 pts: Added new animated sprite for ships
        https://ansimuz.itch.io/spaceship-shooter-environment
        upscaled to 200% using https://lospec.com/pixel-art-scaler/
    15 pts: Added new faster spaceship subclass
    10 pts: Added 4 new explosion sounds
        https://mixkit.co/free-sound-effects/explosion/
        https://freesound.org/people/MusicLegends/sounds/344303/
        https://freesound.org/people/kutejnikov/sounds/522209/
        https://freesound.org/people/alphatrooper18/sounds/362423/
    10 pts: Paralax scrolling for background
    10 pts: Added timer
    5 pts: speed up after 30 seconds
    10 pts: UI and Menu art
        generated art with https://deep-fold.itch.io/space-background-generator
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