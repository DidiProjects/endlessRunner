import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export class PreloadScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Image;
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingUI();
    this.setupLoadingEvents();
    this.generateGameAssets();
  }

  create(): void {
    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene');
    });
  }

  private createLoadingUI(): void {
    const centerX = GAME_CONFIG.WIDTH / 2;
    const centerY = GAME_CONFIG.HEIGHT / 2;

    this.add.image(centerX, centerY, 'loading-bar-bg');

    this.loadingBar = this.add.image(
      centerX - 198,
      centerY,
      'loading-bar-fill'
    );
    this.loadingBar.setOrigin(0, 0.5);
    this.loadingBar.setScale(0, 1);

    this.loadingText = this.add.text(centerX, centerY + 50, 'LOADING...', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#e94560',
    });
    this.loadingText.setOrigin(0.5);

    this.add.text(centerX, centerY - 80, 'PIXEL RUNNER', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#e94560',
      stroke: '#0f3460',
      strokeThickness: 4,
    }).setOrigin(0.5);
  }

  private setupLoadingEvents(): void {
    this.load.on('progress', (value: number) => {
      this.loadingBar.setScale(value, 1);
      this.loadingText.setText(`LOADING... ${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      this.loadingText.setText('COMPLETE!');
    });
  }

  private generateGameAssets(): void {
    this.generatePlayerSprites();
    this.generateObstacleSprites();
    this.generateBackgroundElements();
    this.generateUIElements();
    this.generateCollectibles();
    this.generateParticles();
  }

  private generatePlayerSprites(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    
    graphics.clear();
    this.drawPixelCharacter(graphics, GAME_CONFIG.COLORS.NEON_CYAN);
    graphics.generateTexture('player-idle', 32, 48);

    for (let i = 0; i < 4; i++) {
      graphics.clear();
      this.drawPixelCharacter(graphics, GAME_CONFIG.COLORS.NEON_CYAN, i);
      graphics.generateTexture(`player-run-${i}`, 32, 48);
    }

    graphics.clear();
    this.drawPixelCharacterJump(graphics, GAME_CONFIG.COLORS.NEON_CYAN);
    graphics.generateTexture('player-jump', 32, 48);

    graphics.clear();
    this.drawPixelCharacterDead(graphics, GAME_CONFIG.COLORS.PRIMARY);
    graphics.generateTexture('player-dead', 32, 48);

    graphics.destroy();
  }

  private drawPixelCharacter(
    graphics: Phaser.GameObjects.Graphics,
    color: number,
    frame: number = 0
  ): void {
    const legOffset = Math.sin((frame / 4) * Math.PI * 2) * 4;

    graphics.fillStyle(color);
    graphics.fillRect(8, 12, 16, 20);

    graphics.fillStyle(color);
    graphics.fillRect(10, 2, 12, 12);

    graphics.fillStyle(0x000000);
    graphics.fillRect(12, 6, 3, 3);
    graphics.fillRect(18, 6, 3, 3);

    graphics.fillStyle(0xffffff);
    graphics.fillRect(13, 7, 1, 1);
    graphics.fillRect(19, 7, 1, 1);

    graphics.fillStyle(color);
    graphics.fillRect(8, 32, 6, 14 + legOffset);
    graphics.fillRect(18, 32, 6, 14 - legOffset);

    graphics.fillRect(2, 14, 6, 4);
    graphics.fillRect(24, 14, 6, 4);
  }

  private drawPixelCharacterJump(
    graphics: Phaser.GameObjects.Graphics,
    color: number
  ): void {
    graphics.fillStyle(color);
    graphics.fillRect(8, 12, 16, 20);

    graphics.fillRect(10, 2, 12, 12);

    graphics.fillStyle(0x000000);
    graphics.fillRect(12, 6, 3, 3);
    graphics.fillRect(18, 6, 3, 3);

    graphics.fillStyle(0xffffff);
    graphics.fillRect(13, 7, 1, 1);
    graphics.fillRect(19, 7, 1, 1);

    graphics.fillStyle(color);
    graphics.fillRect(6, 32, 8, 8);
    graphics.fillRect(18, 32, 8, 8);

    graphics.fillRect(0, 8, 6, 4);
    graphics.fillRect(26, 8, 6, 4);
  }

  private drawPixelCharacterDead(
    graphics: Phaser.GameObjects.Graphics,
    color: number
  ): void {
    graphics.fillStyle(color);
    graphics.fillRect(4, 20, 24, 12);

    graphics.fillRect(2, 16, 10, 10);

    graphics.fillStyle(0x000000);
    graphics.fillRect(4, 18, 2, 2);
    graphics.fillRect(4, 22, 2, 2);
    graphics.fillRect(8, 18, 2, 2);
    graphics.fillRect(8, 22, 2, 2);
  }

  private generateObstacleSprites(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    graphics.clear();
    this.drawPixelCactus(graphics);
    graphics.generateTexture('obstacle-cactus', 24, 48);

    graphics.clear();
    this.drawPixelRock(graphics);
    graphics.generateTexture('obstacle-rock', 32, 24);

    for (let i = 0; i < 2; i++) {
      graphics.clear();
      this.drawPixelBird(graphics, i);
      graphics.generateTexture(`obstacle-bird-${i}`, 32, 24);
    }

    graphics.clear();
    this.drawPixelSpike(graphics);
    graphics.generateTexture('obstacle-spike', 24, 32);

    graphics.destroy();
  }

  private drawPixelCactus(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(GAME_CONFIG.COLORS.NEON_GREEN);
    
    graphics.fillRect(8, 8, 8, 40);
    
    graphics.fillRect(0, 16, 8, 6);
    graphics.fillRect(0, 8, 4, 8);
    
    graphics.fillRect(16, 24, 8, 6);
    graphics.fillRect(20, 16, 4, 8);

    graphics.fillStyle(0x228b22);
    graphics.fillRect(10, 10, 2, 36);
    graphics.fillRect(2, 18, 2, 4);
    graphics.fillRect(18, 26, 2, 4);
  }

  private drawPixelRock(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x696969);
    
    graphics.fillRect(4, 8, 24, 16);
    graphics.fillRect(8, 4, 16, 4);
    graphics.fillRect(8, 24, 16, 4);

    graphics.fillStyle(0x808080);
    graphics.fillRect(8, 8, 4, 4);
    graphics.fillRect(20, 12, 4, 4);

    graphics.fillStyle(0x404040);
    graphics.fillRect(12, 16, 8, 4);
  }

  private drawPixelBird(
    graphics: Phaser.GameObjects.Graphics,
    frame: number
  ): void {
    graphics.fillStyle(GAME_CONFIG.COLORS.PRIMARY);
    
    graphics.fillRect(8, 8, 16, 10);
    
    graphics.fillRect(24, 6, 8, 8);
    
    graphics.fillStyle(GAME_CONFIG.COLORS.GOLD);
    graphics.fillRect(28, 10, 4, 4);
    
    graphics.fillStyle(0x000000);
    graphics.fillRect(26, 8, 2, 2);
    
    graphics.fillStyle(GAME_CONFIG.COLORS.PRIMARY);
    if (frame === 0) {
      graphics.fillRect(12, 0, 8, 8);
    } else {
      graphics.fillRect(12, 18, 8, 6);
    }
    
    graphics.fillRect(0, 10, 8, 6);
  }

  private drawPixelSpike(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0x808080);
    
    graphics.fillTriangle(12, 0, 0, 32, 24, 32);
    
    graphics.fillStyle(0xc0c0c0);
    graphics.fillTriangle(12, 4, 4, 28, 12, 28);
  }

  private generateBackgroundElements(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    graphics.clear();
    graphics.fillStyle(GAME_CONFIG.COLORS.SECONDARY);
    graphics.fillRect(0, 0, 64, 32);
    graphics.fillStyle(GAME_CONFIG.COLORS.ACCENT);
    graphics.fillRect(0, 0, 64, 4);
    graphics.fillStyle(0x0a0a14);
    for (let i = 0; i < 8; i++) {
      graphics.fillRect(i * 8 + 2, 8 + (i % 3) * 4, 4, 4);
    }
    graphics.generateTexture('ground-tile', 64, 32);

    graphics.clear();
    this.drawPixelBuilding(graphics, 60, 120, GAME_CONFIG.COLORS.ACCENT);
    graphics.generateTexture('building-1', 60, 120);

    graphics.clear();
    this.drawPixelBuilding(graphics, 40, 80, GAME_CONFIG.COLORS.SECONDARY);
    graphics.generateTexture('building-2', 40, 80);

    graphics.clear();
    this.drawPixelBuilding(graphics, 50, 100, 0x0a0a1a);
    graphics.generateTexture('building-3', 50, 100);

    graphics.clear();
    graphics.fillStyle(0xffffff);
    graphics.fillRect(0, 0, 2, 2);
    graphics.generateTexture('star', 2, 2);

    graphics.clear();
    this.drawPixelMoon(graphics);
    graphics.generateTexture('moon', 40, 40);

    graphics.destroy();
  }

  private drawPixelBuilding(
    graphics: Phaser.GameObjects.Graphics,
    width: number,
    height: number,
    color: number
  ): void {
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, width, height);

    graphics.fillStyle(GAME_CONFIG.COLORS.GOLD);
    const windowSize = 6;
    const windowGap = 10;
    const startX = 5;
    const startY = 10;

    for (let y = startY; y < height - windowGap; y += windowGap) {
      for (let x = startX; x < width - windowGap; x += windowGap) {
        if (Math.random() > 0.3) {
          graphics.fillRect(x, y, windowSize, windowSize);
        }
      }
    }

    graphics.fillStyle(0x000000);
    graphics.fillRect(0, 0, width, 4);
  }

  private drawPixelMoon(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(0xffffcc);
    graphics.fillCircle(20, 20, 18);

    graphics.fillStyle(0xccccaa);
    graphics.fillCircle(12, 14, 4);
    graphics.fillCircle(26, 22, 3);
    graphics.fillCircle(18, 28, 2);
  }

  private generateUIElements(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    graphics.clear();
    graphics.fillStyle(GAME_CONFIG.COLORS.PRIMARY);
    graphics.fillRoundedRect(0, 0, 200, 50, 8);
    graphics.fillStyle(GAME_CONFIG.COLORS.NEON_PINK);
    graphics.fillRoundedRect(4, 4, 192, 42, 6);
    graphics.generateTexture('button', 200, 50);

    graphics.clear();
    graphics.fillStyle(GAME_CONFIG.COLORS.ACCENT);
    graphics.fillRoundedRect(0, 0, 300, 200, 12);
    graphics.lineStyle(4, GAME_CONFIG.COLORS.PRIMARY);
    graphics.strokeRoundedRect(2, 2, 296, 196, 10);
    graphics.generateTexture('panel', 300, 200);

    graphics.clear();
    this.drawPixelHeart(graphics);
    graphics.generateTexture('heart', 16, 16);

    graphics.destroy();
  }

  private drawPixelHeart(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(GAME_CONFIG.COLORS.PRIMARY);
    graphics.fillRect(2, 4, 4, 4);
    graphics.fillRect(10, 4, 4, 4);
    graphics.fillRect(0, 6, 16, 6);
    graphics.fillRect(2, 12, 12, 2);
    graphics.fillRect(4, 14, 8, 2);
    graphics.fillRect(6, 16, 4, 2);
  }

  private generateCollectibles(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    for (let i = 0; i < 6; i++) {
      graphics.clear();
      this.drawPixelCoin(graphics, i);
      graphics.generateTexture(`coin-${i}`, 16, 16);
    }

    graphics.clear();
    this.drawPixelShield(graphics);
    graphics.generateTexture('powerup-shield', 24, 24);

    graphics.clear();
    this.drawPixelMagnet(graphics);
    graphics.generateTexture('powerup-magnet', 24, 24);

    graphics.clear();
    this.drawPixelSpeedBoost(graphics);
    graphics.generateTexture('powerup-speed', 24, 24);

    graphics.destroy();
  }

  private drawPixelCoin(
    graphics: Phaser.GameObjects.Graphics,
    frame: number
  ): void {
    const widthScale = Math.abs(Math.cos((frame / 6) * Math.PI));
    const width = Math.max(2, Math.floor(14 * widthScale));
    const x = 8 - width / 2;

    graphics.fillStyle(GAME_CONFIG.COLORS.GOLD);
    graphics.fillRect(x, 2, width, 12);

    if (width > 4) {
      graphics.fillStyle(0xffa500);
      graphics.fillRect(x + 2, 4, width - 4, 8);
    }
  }

  private drawPixelShield(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(GAME_CONFIG.COLORS.NEON_CYAN);
    graphics.fillRect(4, 0, 16, 4);
    graphics.fillRect(0, 4, 24, 12);
    graphics.fillRect(4, 16, 16, 4);
    graphics.fillRect(8, 20, 8, 4);

    graphics.fillStyle(0x00cccc);
    graphics.fillRect(8, 4, 8, 12);
  }

  private drawPixelMagnet(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(GAME_CONFIG.COLORS.PRIMARY);
    graphics.fillRect(0, 0, 8, 16);
    graphics.fillRect(16, 0, 8, 16);
    graphics.fillRect(0, 16, 24, 8);

    graphics.fillStyle(0xff0000);
    graphics.fillRect(0, 0, 8, 4);
    graphics.fillStyle(0x0000ff);
    graphics.fillRect(16, 0, 8, 4);
  }

  private drawPixelSpeedBoost(graphics: Phaser.GameObjects.Graphics): void {
    graphics.fillStyle(GAME_CONFIG.COLORS.NEON_GREEN);
    
    graphics.fillRect(12, 0, 8, 4);
    graphics.fillRect(8, 4, 8, 4);
    graphics.fillRect(4, 8, 16, 4);
    graphics.fillRect(8, 12, 8, 4);
    graphics.fillRect(4, 16, 8, 4);
    graphics.fillRect(0, 20, 8, 4);
  }

  private generateParticles(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    graphics.clear();
    graphics.fillStyle(0xcccccc);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle-dust', 8, 8);

    graphics.clear();
    graphics.fillStyle(GAME_CONFIG.COLORS.GOLD);
    graphics.fillRect(2, 0, 4, 8);
    graphics.fillRect(0, 2, 8, 4);
    graphics.generateTexture('particle-spark', 8, 8);

    graphics.clear();
    graphics.fillStyle(GAME_CONFIG.COLORS.NEON_CYAN);
    graphics.fillRect(0, 0, 4, 4);
    graphics.generateTexture('particle-trail', 4, 4);

    graphics.destroy();
  }
}
