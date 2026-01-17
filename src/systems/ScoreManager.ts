import Phaser from 'phaser';
import { GAME_CONFIG, EVENTS } from '../config';

export class ScoreManager {
  private scene: Phaser.Scene;
  private score: number = 0;
  private highScore: number = 0;
  private coins: number = 0;
  private distanceMultiplier: number = 0.1;
  private milestones: number[] = [100, 250, 500, 1000, 2500, 5000, 10000];
  private reachedMilestones: Set<number> = new Set();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(): void {
    this.loadHighScore();
    this.score = 0;
    this.coins = 0;
    this.reachedMilestones.clear();
  }

  public updateDistance(distance: number): void {
    const previousScore = this.score;
    this.score = Math.floor(distance * this.distanceMultiplier);

    this.milestones.forEach((milestone) => {
      if (this.score >= milestone && !this.reachedMilestones.has(milestone)) {
        this.reachedMilestones.add(milestone);
        this.scene.events.emit(EVENTS.SCORE_MILESTONE, milestone);
        this.showMilestoneEffect(milestone);
      }
    });

    if (this.score !== previousScore) {
      this.scene.events.emit(EVENTS.SCORE_UPDATE, this.score);
    }
  }

  public addCoins(amount: number): void {
    this.coins += amount;
    this.score += amount * GAME_CONFIG.COLLECTIBLES.COIN_VALUE;
  }

  private showMilestoneEffect(milestone: number): void {
    const text = this.scene.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 50,
      `${milestone} POINTS!`,
      {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffd700',
        stroke: '#000000',
        strokeThickness: 4,
      }
    );
    text.setOrigin(0.5);
    text.setDepth(100);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 50,
      alpha: 0,
      scale: 1.5,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });

    this.scene.cameras.main.flash(200, 255, 215, 0, false);
  }

  public saveHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('pixelRunner_highScore', this.highScore.toString());
      this.scene.events.emit(EVENTS.HIGHSCORE_NEW, this.highScore);
    }
  }

  private loadHighScore(): void {
    const saved = localStorage.getItem('pixelRunner_highScore');
    this.highScore = saved ? parseInt(saved, 10) : 0;
  }

  public getScore(): number {
    return this.score;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  public getCoins(): number {
    return this.coins;
  }

  public isNewHighScore(): boolean {
    return this.score > this.highScore;
  }

  public getFormattedScore(): string {
    return this.score.toString().padStart(6, '0');
  }

  public getFormattedHighScore(): string {
    return Math.max(this.score, this.highScore).toString().padStart(6, '0');
  }
}
