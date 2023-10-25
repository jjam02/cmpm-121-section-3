import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;
  speed = 0.5;

  firing = false;

  starfield?: Phaser.GameObjects.TileSprite;
  player?: Phaser.GameObjects.Shape;
  enemy1?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.player = this.add.rectangle(320, 450, 50, 50, 0x00ce8a);

    this.enemy1 = this.add.rectangle(
      this.game.config.width as number,
      210,
      50,
      20,
      0xff0000,
    );
  }

  update() {
    if (this.checkCollision(this.player!, this.enemy1!)) {
      this.player?.setFillStyle(0xffff00);
    } else {
      this.player?.setFillStyle(0x00ce8a);
    }

    this.starfield!.tilePositionX -= 4;

    this.enemy1!.x -= 0.6;

    if (this.enemy1!.x <= 0) {
      this.enemy1!.x = 640;
    }

    if (this.left!.isDown && !this.firing) {
      this.player!.x -= this.speed;
    }
    if (this.right!.isDown && !this.firing) {
      this.player!.x += this.speed;
    }

    if (this.fire!.isDown) {
      this.firing = true;
      this.tweens.add({
        targets: this.player,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });
    }

    if (this.firing) {
      this.player!.y -= 2;
      this.fireCheck();
    }
  }

  fireCheck() {
    if (this.player!.y < -10) {
      this.player!.y = 450;
      this.player!.x = 320;
      this.firing = false;
    }
  }

  checkCollision(
    player: Phaser.GameObjects.Shape,
    enemy: Phaser.GameObjects.Shape,
  ) {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.height + player.y > enemy.y
    ) {
      return true;
    } else {
      return false;
    }
  }
}
