class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        //this.isFiring = false;
    }

    preload() {
        // load spritesheet
        this.load.spritesheet("explosion", "./assets/explosion.png", {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 4});
        this.load.spritesheet("enemyBig", "./assets/enemy-big.png", {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 1});
        this.load.spritesheet("enemySmall", "./assets/enemy-small.png", {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        // load images
        this.load.image("rocket", "./assets/rocket.png");
        this.load.image("spaceBG", "./assets/Space Background.png");
        this.load.image("planetBG", "./assets/Planet Background.png");
    }

    create() {
        // add background music
        this.bgm = this.sound.add("music", {volume: 0.1});
        this.bgm.play();
        // add bakgrouond sprites
        this.starfield = this.add.tileSprite(0, 0, 640, 480, "spaceBG").setOrigin(0,0);
        this.planets = this.add.tileSprite(0, 0, 640, 480, "planetBG").setOrigin(0,0);
        // Top UI bg
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2 - 10, 0x181a47).setOrigin(0,0);
        // black bars
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x000).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x000).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x000).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x000).setOrigin(0,0);
        // score borders
        this.add.rectangle(borderUISize + borderPadding - 5, borderUISize + borderPadding*2 - 5, 110, 46, 0x000).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize - borderPadding + 5, borderUISize + borderPadding*2 - 5, 110, 46, 0x000).setOrigin(1,0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, "rocket").setOrigin(0.5,0);
        // add spaceschips
        this.ship01 = new Spaceship(this, game.config.width/2, borderUISize*4, "enemyBig", 0, 30).setOrigin(0.5);
        this.ship02 = new Spaceship(this, game.config.width/2, borderUISize*5 + borderPadding*2, "enemyBig", 0, 20).setOrigin(0.5);
        this.ship03 = new Spaceship(this, game.config.width/2, borderUISize*6 + borderPadding*4, "enemyBig", 0, 10).setOrigin(0.5);
        this.ship04 = new Speeder(this, game.config.width/2, borderUISize*7 + borderPadding*6, "enemySmall", 0, 50).setOrigin(0.5);
        this.ship01.angle = -90;
        this.ship02.angle = -90;
        this.ship03.angle = -90;
        this.ship04.angle = -90;
        if(this.ship01.moveDir == "left"){
            this.ship01.angle = 90;
        }
        if(this.ship02.moveDir == "left"){
            this.ship02.angle = 90;
        }
        if(this.ship03.moveDir == "left"){
            this.ship03.angle = 90;
        }
        if(this.ship04.moveDir == "left"){
            this.ship04.angle = 90;
        }
        
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", {start: 0, end: 4, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: "moveEnemyBig",
            frames: this.anims.generateFrameNumbers("enemyBig", {start: 0, end: 1, first: 0}),
            repeat: -1,
            frameRate: 30
        })
        this.ship01.anims.play("moveEnemyBig");
        this.ship02.anims.play("moveEnemyBig");
        this.ship03.anims.play("moveEnemyBig");

        // initialize score
        this.p1Score = 0;

        // display score config
        let scoreConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        };
        // score display
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        scoreConfig.fixedWidth = 0;
        // FIRE UI
        scoreConfig.backgroundColor = "#0000";
        scoreConfig.color = "#FFFFFF";
        this.fireUI = this.add.text(game.config.width/2, borderUISize + borderPadding*2, "FIRE", scoreConfig);
        this.fireUI.setVisible(false);
        // High Score text
        scoreConfig.fixedWidth = 100;
        scoreConfig.backgroundColor = "#004cff";
        scoreConfig.color = "#000";
        if(this.game.settings.difficulty == "easy"){
            this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2, highscore, scoreConfig).setOrigin(1,0);
        }
        if(this.game.settings.difficulty == "hard"){
            this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2, highscoreExpert, scoreConfig).setOrigin(1,0);
        }

        // GAME OVER flag
        this.gameOver = false;

        // game timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            // reset score config
            //scoreConfig.backgroundColor = "#F3B141";
            scoreConfig.color = "#FFFFFF";
            this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, "Press (R) to Restart or <- for Menu", scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        // timer text
        scoreConfig.color = "#FFFFFF";
        scoreConfig.backgroundColor = "#0000";
        this.gameTimer = this.add.text(borderUISize + borderPadding + 110, borderUISize + borderPadding*2, `Time: ${game.settings.gameTimer/1000}`, scoreConfig);
        // speed up variable
        this.speedUp = false;
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play("sfx_select");
            this.bgm.stop();
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.bgm.stop();
            this.scene.start("menuScene");
        }
        // background scroll
        this.starfield.tilePositionX -= 1;
        this.planets.tilePositionX -= 1.3;
        // move sprites
        if(!this.gameOver){
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        // Game timer
        this.gameTimer.text = `Time: ${Phaser.Math.CeilTo(this.clock.getOverallRemainingSeconds())}`;
        // speed up after 30 seconds
        if(this.speedUp == false && this.clock.getElapsedSeconds() > 30){
            this.ship01.moveSpeed += 2;
            this.ship02.moveSpeed += 2;
            this.ship03.moveSpeed += 2;
            this.ship04.moveSpeed += 2;
            this.speedUp = true;
        }
        // FIRE UI
        if(this.p1Rocket.isFiring == true && !this.isFiring){
            this.fireUI.setVisible(true);
        }else{
            this.fireUI.setVisible(false);
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if(rocket.x < ship.x + ship.width/2 && rocket.x + rocket.width > ship.x - ship.width/2 &&
           rocket.y < ship.y + ship.height/2 && rocket.height + rocket.y > ship.y - ship.height/2) {
            return true;
        }else{
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0.5);
        boom.anims.play("explode");             // play explode animation
        boom.on("animationcomplete", () => {    // callback after anim completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        })
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        // update high score
        if(game.settings.difficulty == "easy" && highscore < this.p1Score){
            highscore = this.p1Score;
            this.scoreRight.text = highscore;
        }
        if(this.game.settings.difficulty == "hard" && highscoreExpert < this.p1Score){
            highscoreExpert = this.p1Score;
            this.scoreRight.text = highscoreExpert;
        }
        // explode sfx
        let nboom = Phaser.Math.Between(1,4);
        this.sound.play(`boom${nboom}`, {volume: 0.5});
    }
}