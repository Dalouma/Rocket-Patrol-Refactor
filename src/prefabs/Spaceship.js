class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        // randomize movement direction (left/right)
        this.moveDir = Phaser.Math.Between(0,1) == 0 ? "left" : "right";
    }

    update() {
        // move spaceship left or right
        if(this.moveDir == "left"){
            this.x -= this.moveSpeed;
        }
        if(this.moveDir == "right"){
            this.x += this.moveSpeed;
        }

        // wrap around from both edges
        if(this.x <= 0 - this.width || this.x >= game.config.width + this.width) {
            this.reset();
        }
    }

    // position reset
    reset() {
        if(this.moveDir == "left"){
            this.x = game.config.width;
        }
        if(this.moveDir == "right"){
            this.x = 0;
        }
    }
}