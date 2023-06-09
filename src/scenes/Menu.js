class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load background
        this.load.image("titleBG", "./assets/Title Art.png");
        // load audio
        this.load.audio("sfx_select", "./assets/blip_select12.wav");
        this.load.audio("sfx_rocket", "./assets/rocket_shot.wav");
        this.load.audio("boom1", "./assets/boom1.wav");
        this.load.audio("boom2", "./assets/boom2.wav");
        this.load.audio("boom3", "./assets/boom3.wav");
        this.load.audio("boom4", "./assets/boom4.wav");
        // load bgm
        // https://patrickdearteaga.com/arcade-music/
        // track 3: "Intergalactic Odyssey"
        this.load.audio("music", "./assets/Intergalactic Odyssey.ogg");
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                difficulty: "easy",
                spaceshipSpeed: 3,
                speederSpeed: 6,
                gameTimer: 60000
            };
            this.sound.play("sfx_select");
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                difficulty: "hard",
                spaceshipSpeed: 4,
                speederSpeed: 7,
                gameTimer: 45000
            };
            this.sound.play("sfx_select");
            this.scene.start("playScene");
        }
    }

    create() {
        // show title art
        this.titleScreen = this.add.tileSprite(0, 0, 640, 480, "titleBG").setOrigin(0,0);

        // menu text config
        let menuConfig= {
            fontFamily: "Courier",
            fontSize: "28px",
            //backgroundColor: "#F3B141",
            backgroundColor: "#000",
            //color: "#843605",
            color: "#FFFFFF",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize*2 - borderPadding*2, "ROCKET PATROL", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "Use <--> arrows to move & (F) to fire", menuConfig).setOrigin(0.5);
        //menuConfig.backgroundColor = "#00FF00";
        //menuConfig.color = "#000";
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 
        "Press <- for Novice or -> for Expert", menuConfig).setOrigin(0.5);

        // show high score
        //menuConfig.backgroundColor = "#004cff";
        menuConfig.fontSize = "24px";
        this.add.text(game.config.width/2, game.config.height - borderUISize - borderPadding, `High Score: ${highscore}(Easy), ${highscoreExpert}(Expert)`, menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
}