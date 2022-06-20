import * as PIXI from "pixi.js";
import { Shark } from "./shark";
import sharkImage from "../img/gieter.png";
import waterImage from "../img/bg.png";

export class Game {
  private pixi: PIXI.Application;
  private loader: PIXI.Loader;
  private shark: Shark;

  constructor() {
    this.pixi = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight
    });
    document.body.appendChild(this.pixi.view);

    console.log("starting .. ?");

    this.loader = new PIXI.Loader();
    this.loader
      .add("waterTexture", waterImage)
      .add("sharkTexture", sharkImage);

    this.loader.onProgress.add((loader) => this.showProgress(loader));
    this.loader.onError.add((arg) => {
      console.error(arg);
    });
    this.loader.load(() => this.startGame());
  }

  private showProgress(p: PIXI.Loader) {
    console.log(p.progress);
  }

  private startGame() {
    let bg = new PIXI.TilingSprite(
      this.loader.resources["waterTexture"].texture!,
      this.pixi.screen.width,
      this.pixi.screen.height
    );
    this.pixi.stage.addChild(bg);

    this.shark = new Shark(
      this,
      this.loader.resources["sharkTexture"].texture!
    );
    this.pixi.stage.addChild(this.shark);

    this.pixi.ticker.add(() => this.update());
  }


  private update() {
    this.shark.swim();
  }

  private collision(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite) {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }
}