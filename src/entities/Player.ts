import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export class Player {
  private scene: Phaser.Scene;
  private sprite!: Phaser.Physics.Arcade.Sprite;
  private jumpCount: number = 0;
  private isOnGround: boolean = false;
  private isDead: boolean = false;
  private shieldActive: boolean = false;
  private shieldSprite?: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.createSprite(x, y);
    this.createAnimations();
  }

  private createSprite(x: number, y: number): void {
    this.sprite = this.scene.physics.add.sprite(x, y, 'player-idle');
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setGravityY(GAME_CONFIG.GRAVITY);
    
    this.sprite.setSize(
      GAME_CONFIG.PLAYER.WIDTH * 0.7,
      GAME_CONFIG.PLAYER.HEIGHT * 0.9
    );
    this.sprite.setOffset(
      GAME_CONFIG.PLAYER.WIDTH * 0.15,
      GAME_CONFIG.PLAYER.HEIGHT * 0.1
    );
  }

  private createAnimations(): void {
    if (!this.scene.anims.exists('player-run')) {
      this.scene.anims.create({
        key: 'player-run',
        frames: [
          { key: 'player-run-0' },
          { key: 'player-run-1' },
          { key: 'player-run-2' },
          { key: 'player-run-3' },
        ],
        frameRate: 12,
        repeat: -1,
      });
    }

    if (!this.scene.anims.exists('player-idle')) {
      this.scene.anims.create({
        key: 'player-idle',
        frames: [{ key: 'player-idle' }],
        frameRate: 1,
        repeat: -1,
      });
    }

    if (!this.scene.anims.exists('player-jump')) {
      this.scene.anims.create({
        key: 'player-jump',
        frames: [{ key: 'player-jump' }],
        frameRate: 1,
        repeat: 0,
      });
    }

    if (!this.scene.anims.exists('player-dead')) {
      this.scene.anims.create({
        key: 'player-dead',
        frames: [{ key: 'player-dead' }],
        frameRate: 1,
        repeat: 0,
      });
    }

    this.sprite.play('player-run');
  }

  public update(_time: number, _delta: number): void {
    if (this.isDead) return;

    if (this.isOnGround) {
      if (this.sprite.anims.currentAnim?.key !== 'player-run') {
        this.sprite.play('player-run');
      }
    } else {
      if (this.sprite.anims.currentAnim?.key !== 'player-jump') {
        this.sprite.play('player-jump');
      }
    }

    if (this.shieldSprite && this.shieldActive) {
      this.shieldSprite.setPosition(this.sprite.x, this.sprite.y - GAME_CONFIG.PLAYER.HEIGHT / 2);
    }
  }

  public jump(): boolean {
    if (this.isDead) return false;

    if (this.jumpCount < GAME_CONFIG.PLAYER.MAX_JUMPS) {
      const velocity = this.jumpCount === 0 
        ? GAME_CONFIG.PLAYER.JUMP_VELOCITY 
        : GAME_CONFIG.PLAYER.DOUBLE_JUMP_VELOCITY;
      
      this.sprite.setVelocityY(velocity);
      this.jumpCount++;
      this.isOnGround = false;
      
      this.sprite.play('player-jump');
      
      return true;
    }
    
    return false;
  }

  public land(): void {
    this.jumpCount = 0;
    this.isOnGround = true;
    this.sprite.play('player-run');
  }

  public die(): void {
    this.isDead = true;
    this.sprite.play('player-dead');
    this.sprite.setVelocity(0, -200);
    this.sprite.setTint(0xff0000);
    
    if (this.shieldSprite) {
      this.shieldSprite.destroy();
      this.shieldSprite = undefined;
    }

    this.scene.tweens.add({
      targets: this.sprite,
      angle: 360,
      duration: 1000,
      ease: 'Power2',
    });
  }

  public isInAir(): boolean {
    return !this.isOnGround;
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public activateShield(): void {
    if (this.shieldActive) return;

    this.shieldActive = true;
    
    this.shieldSprite = this.scene.add.sprite(
      this.sprite.x,
      this.sprite.y - GAME_CONFIG.PLAYER.HEIGHT / 2,
      'powerup-shield'
    );
    this.shieldSprite.setScale(2);
    this.shieldSprite.setAlpha(0.7);
    this.shieldSprite.setTint(GAME_CONFIG.COLORS.NEON_CYAN);

    this.scene.tweens.add({
      targets: this.shieldSprite,
      alpha: 0.4,
      scale: 2.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  public removeShield(): void {
    this.shieldActive = false;
    
    if (this.shieldSprite) {
      this.scene.tweens.add({
        targets: this.shieldSprite,
        alpha: 0,
        scale: 3,
        duration: 200,
        onComplete: () => {
          this.shieldSprite?.destroy();
          this.shieldSprite = undefined;
        },
      });
    }
  }

  public hasShield(): boolean {
    return this.shieldActive;
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }
}
