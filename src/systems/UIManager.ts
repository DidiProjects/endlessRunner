import Phaser from 'phaser';
import { GAME_CONFIG, EVENTS } from '../config';
import { ScoreManager } from './ScoreManager';

export class UIManager {
  private scene: Phaser.Scene;
  private scoreManager: ScoreManager;
  
  private scoreText!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;
  private coinText!: Phaser.GameObjects.Text;
  private coinIcon!: Phaser.GameObjects.Image;
  
  private pauseContainer?: Phaser.GameObjects.Container;
  
  private gameOverContainer?: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, scoreManager: ScoreManager) {
    this.scene = scene;
    this.scoreManager = scoreManager;
  }

  public create(): void {
    this.createScoreDisplay();
    this.createCoinDisplay();
    this.setupEventListeners();
  }

  private createScoreDisplay(): void {
    this.scoreText = this.scene.add.text(
      GAME_CONFIG.WIDTH - 20,
      20,
      'SCORE: 000000',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
    this.scoreText.setOrigin(1, 0);
    this.scoreText.setDepth(100);
    this.scoreText.setScrollFactor(0);

    this.highScoreText = this.scene.add.text(
      GAME_CONFIG.WIDTH - 20,
      45,
      `HI: ${this.scoreManager.getFormattedHighScore()}`,
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffd700',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
    this.highScoreText.setOrigin(1, 0);
    this.highScoreText.setDepth(100);
    this.highScoreText.setScrollFactor(0);
  }

  private createCoinDisplay(): void {
    this.coinIcon = this.scene.add.image(30, 25, 'coin-0');
    this.coinIcon.setDepth(100);
    this.coinIcon.setScrollFactor(0);

    this.coinText = this.scene.add.text(
      50,
      20,
      'x 0',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffd700',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );
    this.coinText.setDepth(100);
    this.coinText.setScrollFactor(0);
  }

  private setupEventListeners(): void {
    this.scene.events.on(EVENTS.COIN_COLLECTED, () => {
      this.animateCoinCollected();
    });

    this.scene.events.on(EVENTS.POWERUP_COLLECTED, (type: string) => {
      this.showPowerupNotification(type);
    });
  }

  public update(): void {
    this.scoreText.setText(`SCORE: ${this.scoreManager.getFormattedScore()}`);
    this.highScoreText.setText(`HI: ${this.scoreManager.getFormattedHighScore()}`);
    this.coinText.setText(`x ${this.scoreManager.getCoins()}`);
  }

  private animateCoinCollected(): void {
    this.scene.tweens.add({
      targets: [this.coinIcon, this.coinText],
      scale: 1.3,
      duration: 100,
      yoyo: true,
    });
  }

  private showPowerupNotification(type: string): void {
    const messages: Record<string, string> = {
      shield: 'SHIELD ACTIVATED!',
      magnet: 'COIN MAGNET!',
      speed: 'SPEED BOOST!',
    };

    const colors: Record<string, string> = {
      shield: '#00fff5',
      magnet: '#e94560',
      speed: '#39ff14',
    };

    const text = this.scene.add.text(
      GAME_CONFIG.WIDTH / 2,
      80,
      messages[type] || 'POWERUP!',
      {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: colors[type] || '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      }
    );
    text.setOrigin(0.5);
    text.setDepth(100);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });
  }

  public showPauseMenu(): void {
    if (this.pauseContainer) return;

    this.pauseContainer = this.scene.add.container(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2
    );
    this.pauseContainer.setDepth(200);

    const overlay = this.scene.add.rectangle(
      0,
      0,
      GAME_CONFIG.WIDTH,
      GAME_CONFIG.HEIGHT,
      0x000000,
      0.7
    );
    overlay.setOrigin(0.5);

    const panel = this.scene.add.image(0, 0, 'panel');

    const pauseText = this.scene.add.text(0, -60, 'PAUSED', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#e94560',
      stroke: '#000000',
      strokeThickness: 4,
    });
    pauseText.setOrigin(0.5);

    const resumeText = this.scene.add.text(
      0,
      20,
      'Press ESC or P to resume',
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
      }
    );
    resumeText.setOrigin(0.5);

    this.pauseContainer.add([overlay, panel, pauseText, resumeText]);
  }

  public hidePauseMenu(): void {
    if (this.pauseContainer) {
      this.pauseContainer.destroy();
      this.pauseContainer = undefined;
    }
  }

  public showGameOver(score: number, highScore: number, coins: number): void {
    this.gameOverContainer = this.scene.add.container(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2
    );
    this.gameOverContainer.setDepth(200);

    const overlay = this.scene.add.rectangle(
      0,
      0,
      GAME_CONFIG.WIDTH,
      GAME_CONFIG.HEIGHT,
      0x000000,
      0.8
    );
    overlay.setOrigin(0.5);

    const gameOverText = this.scene.add.text(0, -80, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: '40px',
      color: '#e94560',
      stroke: '#000000',
      strokeThickness: 6,
    });
    gameOverText.setOrigin(0.5);

    const scoreText = this.scene.add.text(0, -20, `SCORE: ${score}`, {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
    });
    scoreText.setOrigin(0.5);

    const isNewHighScore = score >= highScore;
    const highScoreLabel = isNewHighScore ? 'NEW HIGH SCORE!' : `HIGH SCORE: ${highScore}`;
    const highScoreColor = isNewHighScore ? '#ffd700' : '#aaaaaa';
    
    const highScoreText = this.scene.add.text(0, 20, highScoreLabel, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: highScoreColor,
    });
    highScoreText.setOrigin(0.5);

    const coinsText = this.scene.add.text(0, 55, `COINS: ${coins}`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffd700',
    });
    coinsText.setOrigin(0.5);

    const restartText = this.scene.add.text(
      0,
      100,
      'Press SPACE or TAP to restart',
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#00fff5',
      }
    );
    restartText.setOrigin(0.5);

    this.scene.tweens.add({
      targets: restartText,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.gameOverContainer.add([
      overlay,
      gameOverText,
      scoreText,
      highScoreText,
      coinsText,
      restartText,
    ]);

    this.setupRestartInput();
  }

  private setupRestartInput(): void {
    const restartHandler = () => {
      this.scene.events.emit(EVENTS.GAME_RESTART);
    };

    this.scene.input.keyboard?.once('keydown-SPACE', restartHandler);
    this.scene.input.keyboard?.once('keydown-ENTER', restartHandler);
    this.scene.input.once('pointerdown', restartHandler);
  }

  public hideGameOver(): void {
    if (this.gameOverContainer) {
      this.gameOverContainer.destroy();
      this.gameOverContainer = undefined;
    }
  }
}
