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
        this.load.image("spaceship", "./assets/spaceship.png");
        this.load.image("spaceBG", "./assets/Space Background.png");
    }

    create() {
        // add background music
        this.bgm = this.sound.add("music", {volume: 0.1});
        this.bgm.play();
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, "spaceBG").setOrigin(0,0);
        // green UI bg
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0);
        // white bars
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0);
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
        // checking size
        //console.log(`ship 1 width is ${this.ship01.width}`);
        //console.log(`ship 1 height is ${this.ship01.height}`);
        //console.log(`ship 4 width is ${this.ship04.width}`);
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

        // checking size
        console.log(`ship 1 width is ${this.ship01.width}`);
        console.log(`ship 1 height is ${this.ship01.height}`);

        // initialize score
        this.p1Score = 0;

        // display score
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
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        scoreConfig.fixedWidth = 0;
        // FIRE UI
        this.fireUI = this.add.text(game.config.width/2, borderUISize + borderPadding*2, "FIRE", scoreConfig);
        this.fireUI.setVisible(false);
        // High Score text
        scoreConfig.backgroundColor = "#004cff";
        scoreConfig.color = "#000";
        if(this.game.settings.difficulty == "easy"){
            this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2, highscore, scoreConfig).setOrigin(1,0);
        }
        if(this.game.settings.difficulty == "hard"){
            this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding*2, highscoreExpert, scoreConfig).setOrigin(1,0);
        }
        // reset score config
        scoreConfig.backgroundColor = "#F3B141";
        scoreConfig.color = "#843605";
      

        // GAME OVER flag
        this.gameOver = false;

        // game timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, "Press (R) to Restart or <- for Menu", scoreConfig).setOrigin(0.5);
            this.bgm.stop();
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play("sfx_select");
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // background scroll
        this.starfield.tilePositionX -= 1;
        // move sprites
        if(!this.gameOver){
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
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
        this.sound.play("sfx_explosion");
    }
}