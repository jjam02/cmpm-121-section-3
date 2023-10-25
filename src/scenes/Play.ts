import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;
  speed = 0.5;

  firing = false;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;

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

    this.spinner = this.add.rectangle(320, 450, 50, 50, 0x00ce8a);
  }

  update() {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown && !this.firing) {
      this.spinner!.x -= this.speed;
    }
    if (this.right!.isDown && !this.firing) {
      this.spinner!.x += this.speed;
    }

    if (this.fire!.isDown) {
      this.firing = true;
      this.tweens.add({
        targets: this.spinner,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });
    }

    if (this.firing) {
      this.spinner!.y -= 2;
      this.fireCheck();
    }
  }

  fireCheck() {
    if (this.spinner!.y < -10) {
      this.spinner!.y = 450;
      this.spinner!.x = 320;
      this.firing = false;
    }
  }
}
