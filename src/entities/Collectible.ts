import Phaser from 'phaser';

export type CollectibleType = 'coin' | 'shield' | 'magnet' | 'speed';

export class Collectible {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private type: CollectibleType;
  private collected: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: CollectibleType
  ) {
    this.scene = scene;
    this.type = type;
    this.sprite = this.createSprite(x, y, type);
    this.setupAnimations();
    this.addFloatingEffect();
  }

  private createSprite(
    x: number,
    y: number,
    type: CollectibleType
  ): Phaser.Physics.Arcade.Sprite {
    let texture: string;

    switch (type) {
      case 'coin':
        texture = 'coin-0';
        break;
      case 'shield':
        texture = 'powerup-shield';
        break;
      case 'magnet':
        texture = 'powerup-magnet';
        break;
      case 'speed':
        texture = 'powerup-speed';
        break;
      default:
        texture = 'coin-0';
    }

    const sprite = this.scene.physics.add.sprite(x, y, texture);
    sprite.setOrigin(0.5);
    sprite.setData('type', type);

    return sprite;
  }

  private setupAnimations(): void {
    if (this.type === 'coin') {
      if (!this.scene.anims.exists('coin-spin')) {
        this.scene.anims.create({
          key: 'coin-spin',
          frames: [
            { key: 'coin-0' },
            { key: 'coin-1' },
            { key: 'coin-2' },
            { key: 'coin-3' },
            { key: 'coin-4' },
            { key: 'coin-5' },
          ],
          frameRate: 10,
          repeat: -1,
        });
      }
      
      this.sprite.play('coin-spin');
    } else {
      this.scene.tweens.add({
        targets: this.sprite,
        alpha: 0.6,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private addFloatingEffect(): void {
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  public update(speed: number, delta: number): void {
    this.sprite.x -= (speed * delta) / 1000;
  }

  public moveTowardsPlayer(playerX: number, playerY: number, delta: number): void {
    const dx = playerX - this.sprite.x;
    const dy = playerY - this.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const speed = 500;
      this.sprite.x += (dx / distance) * speed * (delta / 1000);
      this.sprite.y += (dy / distance) * speed * (delta / 1000);
    }
  }

  public isOffScreen(): boolean {
    return this.sprite.x < -this.sprite.width;
  }

  public destroy(): void {
    this.collected = true;
    this.sprite.destroy();
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getType(): CollectibleType {
    return this.type;
  }

  public isCollected(): boolean {
    return this.collected;
  }
}
