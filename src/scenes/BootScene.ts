import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.createLoadingBarAssets();
  }

  create(): void {
    this.scale.refresh();
    this.scene.start('PreloadScene');
  }

  private createLoadingBarAssets(): void {
    const bgGraphics = this.make.graphics({ x: 0, y: 0 });
    bgGraphics.fillStyle(GAME_CONFIG.COLORS.SECONDARY);
    bgGraphics.fillRect(0, 0, 400, 30);
    bgGraphics.generateTexture('loading-bar-bg', 400, 30);
    bgGraphics.destroy();

    const fillGraphics = this.make.graphics({ x: 0, y: 0 });
    fillGraphics.fillStyle(GAME_CONFIG.COLORS.PRIMARY);
    fillGraphics.fillRect(0, 0, 396, 26);
    fillGraphics.generateTexture('loading-bar-fill', 396, 26);
    fillGraphics.destroy();
  }
}
