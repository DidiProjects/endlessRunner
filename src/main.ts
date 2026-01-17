import Phaser from 'phaser';
import { GAME_CONFIG } from './config';
import { BootScene, PreloadScene, MenuScene, GameScene } from './scenes';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  parent: 'game-container',
  backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 400, height: 200 },
    max: { width: 1600, height: 800 },
  },
  scene: [BootScene, PreloadScene, MenuScene, GameScene],
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
};

const game = new Phaser.Game(config);

export default game;
