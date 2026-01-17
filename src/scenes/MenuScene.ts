import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export class MenuScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private startButton!: Phaser.GameObjects.Container;
  private stars: Phaser.GameObjects.Image[] = [];

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    this.createBackground();
    this.createTitle();
    this.createMenu();
    this.createHighScore();
    this.setupInput();
    this.startAnimations();
  }

  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillGradientStyle(
      GAME_CONFIG.COLORS.BACKGROUND,
      GAME_CONFIG.COLORS.BACKGROUND,
      GAME_CONFIG.COLORS.ACCENT,
      GAME_CONFIG.COLORS.ACCENT,
      1
    );
    bg.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    for (let i = 0; i < 50; i++) {
      const star = this.add.image(
        Phaser.Math.Between(0, GAME_CONFIG.WIDTH),
        Phaser.Math.Between(0, GAME_CONFIG.HEIGHT * 0.7),
        'star'
      );
      star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
      this.stars.push(star);
    }

    this.add.image(GAME_CONFIG.WIDTH - 80, 60, 'moon').setAlpha(0.8);

    for (let i = 0; i < 10; i++) {
      const buildingType = `building-${Phaser.Math.Between(1, 3)}`;
      const building = this.add.image(
        i * 100 + Phaser.Math.Between(-20, 20),
        GAME_CONFIG.HEIGHT - 80,
        buildingType
      );
      building.setOrigin(0.5, 1);
      building.setAlpha(0.5);
    }

    for (let i = 0; i < Math.ceil(GAME_CONFIG.WIDTH / 64) + 1; i++) {
      this.add.image(i * 64, GAME_CONFIG.HEIGHT - 16, 'ground-tile').setOrigin(0, 0.5);
    }
  }

  private createTitle(): void {
    const centerX = GAME_CONFIG.WIDTH / 2;

    this.add.text(centerX + 4, 84, 'PIXEL RUNNER', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#000000',
    }).setOrigin(0.5);

    this.titleText = this.add.text(centerX, 80, 'PIXEL RUNNER', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#e94560',
      stroke: '#0f3460',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(centerX, 130, 'RETRO EDITION', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#00fff5',
    }).setOrigin(0.5);
  }

  private createMenu(): void {
    const centerX = GAME_CONFIG.WIDTH / 2;
    const centerY = GAME_CONFIG.HEIGHT / 2 + 20;

    this.startButton = this.createButton(centerX, centerY, 'START GAME', () => {
      this.startGame();
    });

    this.add.text(centerX, centerY + 80, 'Press SPACE or TAP to jump', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#eaeaea',
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 100, 'Double jump available!', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffd700',
    }).setOrigin(0.5);
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.image(0, 0, 'button');
    bg.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5);

    container.add([bg, buttonText]);

    bg.on('pointerover', () => {
      container.setScale(1.1);
      buttonText.setColor('#ffd700');
    });

    bg.on('pointerout', () => {
      container.setScale(1);
      buttonText.setColor('#ffffff');
    });

    bg.on('pointerdown', callback);

    return container;
  }

  private createHighScore(): void {
    const highScore = this.getHighScore();
    
    this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT - 60,
      `HIGH SCORE: ${highScore}`,
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffd700',
      }
    ).setOrigin(0.5);
  }

  private setupInput(): void {
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.startGame();
    });

    this.input.keyboard?.on('keydown-ENTER', () => {
      this.startGame();
    });
  }

  private startAnimations(): void {
    this.tweens.add({
      targets: this.titleText,
      y: this.titleText.y - 10,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    this.stars.forEach((star, index) => {
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.2, 0.8),
        duration: Phaser.Math.Between(1000, 3000),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: index * 50,
      });
    });

    this.tweens.add({
      targets: this.startButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private startGame(): void {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }

  private getHighScore(): number {
    const saved = localStorage.getItem('pixelRunner_highScore');
    return saved ? parseInt(saved, 10) : 0;
  }
}
