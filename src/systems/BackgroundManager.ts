import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

interface ParallaxLayer {
  images: Phaser.GameObjects.Image[];
  speed: number;
  y: number;
}

export class BackgroundManager {
  private scene: Phaser.Scene;
  private layers: ParallaxLayer[] = [];
  private stars: Phaser.GameObjects.Image[] = [];
  private moon!: Phaser.GameObjects.Image;
  private groundTiles: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(): void {
    this.createSkyGradient();
    this.createStars();
    this.createMoon();
    this.createBuildingLayers();
    this.createGroundTiles();
  }

  private createSkyGradient(): void {
    const graphics = this.scene.add.graphics();
    
    graphics.fillGradientStyle(
      GAME_CONFIG.COLORS.BACKGROUND,
      GAME_CONFIG.COLORS.BACKGROUND,
      GAME_CONFIG.COLORS.ACCENT,
      GAME_CONFIG.COLORS.ACCENT,
      1
    );
    graphics.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    graphics.setDepth(-100);
  }

  private createStars(): void {
    for (let i = 0; i < 30; i++) {
      const star = this.scene.add.image(
        Phaser.Math.Between(0, GAME_CONFIG.WIDTH),
        Phaser.Math.Between(0, GAME_CONFIG.HEIGHT * 0.5),
        'star'
      );
      star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
      star.setDepth(-90);
      this.stars.push(star);

      this.scene.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.2, 0.6),
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000),
      });
    }
  }

  private createMoon(): void {
    this.moon = this.scene.add.image(
      GAME_CONFIG.WIDTH - 100,
      60,
      'moon'
    );
    this.moon.setAlpha(0.9);
    this.moon.setDepth(-85);
  }

  private createBuildingLayers(): void {
    this.createBuildingLayer('building-1', 0.1, GAME_CONFIG.HEIGHT - 60, -70, 0.4);
    
    this.createBuildingLayer('building-2', 0.2, GAME_CONFIG.HEIGHT - 50, -60, 0.6);
    
    this.createBuildingLayer('building-3', 0.3, GAME_CONFIG.HEIGHT - 40, -50, 0.8);
  }

  private createBuildingLayer(
    texture: string,
    speedMultiplier: number,
    y: number,
    depth: number,
    alpha: number
  ): void {
    const images: Phaser.GameObjects.Image[] = [];
    const tileWidth = 60;
    const tilesNeeded = Math.ceil(GAME_CONFIG.WIDTH / tileWidth) + 3;

    for (let i = 0; i < tilesNeeded; i++) {
      const building = this.scene.add.image(
        i * tileWidth + Phaser.Math.Between(-10, 10),
        y,
        texture
      );
      building.setOrigin(0.5, 1);
      building.setAlpha(alpha);
      building.setDepth(depth);
      
      building.setScale(
        Phaser.Math.FloatBetween(0.8, 1.2),
        Phaser.Math.FloatBetween(0.7, 1.3)
      );
      
      images.push(building);
    }

    this.layers.push({
      images,
      speed: speedMultiplier,
      y,
    });
  }

  private createGroundTiles(): void {
    const tileWidth = 64;
    const tilesNeeded = Math.ceil(GAME_CONFIG.WIDTH / tileWidth) + 2;
    const groundY = GAME_CONFIG.HEIGHT - 16;

    for (let i = 0; i < tilesNeeded; i++) {
      const tile = this.scene.add.image(
        i * tileWidth,
        groundY,
        'ground-tile'
      );
      tile.setOrigin(0, 0.5);
      tile.setDepth(10);
      this.groundTiles.push(tile);
    }
  }

  public update(gameSpeed: number, delta: number): void {
    this.layers.forEach((layer) => {
      const moveAmount = (gameSpeed * layer.speed * delta) / 1000;
      
      layer.images.forEach((image) => {
        image.x -= moveAmount;
        
        if (image.x < -image.width) {
          const rightmost = this.getRightmostX(layer.images);
          image.x = rightmost + Phaser.Math.Between(40, 80);
        }
      });
    });

    const groundMoveAmount = (gameSpeed * delta) / 1000;
    this.groundTiles.forEach((tile) => {
      tile.x -= groundMoveAmount;
      
      if (tile.x < -64) {
        const rightmost = this.getRightmostX(this.groundTiles);
        tile.x = rightmost + 64;
      }
    });

    this.stars.forEach((star, _index) => {
      star.x -= (gameSpeed * 0.02 * delta) / 1000;
      
      if (star.x < -5) {
        star.x = GAME_CONFIG.WIDTH + 5;
        star.y = Phaser.Math.Between(0, GAME_CONFIG.HEIGHT * 0.5);
      }
    });

    this.moon.x -= (gameSpeed * 0.01 * delta) / 1000;
    if (this.moon.x < -50) {
      this.moon.x = GAME_CONFIG.WIDTH + 50;
    }
  }

  private getRightmostX(images: Phaser.GameObjects.Image[]): number {
    return Math.max(...images.map((img) => img.x));
  }
}
