import Phaser from 'phaser';

export type ObstacleType = 'cactus' | 'rock' | 'bird' | 'spike';

export class Obstacle {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private type: ObstacleType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: ObstacleType
  ) {
    this.scene = scene;
    this.type = type;
    this.sprite = this.createSprite(x, y, type);
    this.setupAnimations();
  }

  private createSprite(
    x: number,
    y: number,
    type: ObstacleType
  ): Phaser.Physics.Arcade.Sprite {
    let texture: string;
    let originY = 1;

    switch (type) {
      case 'cactus':
        texture = 'obstacle-cactus';
        break;
      case 'rock':
        texture = 'obstacle-rock';
        break;
      case 'bird':
        texture = 'obstacle-bird-0';
        originY = 0.5;
        break;
      case 'spike':
        texture = 'obstacle-spike';
        break;
      default:
        texture = 'obstacle-cactus';
    }

    const sprite = this.scene.physics.add.sprite(x, y, texture);
    sprite.setOrigin(0.5, originY);
    sprite.setImmovable(true);
    
    this.adjustHitbox(sprite, type);

    return sprite;
  }

  private adjustHitbox(
    sprite: Phaser.Physics.Arcade.Sprite,
    type: ObstacleType
  ): void {
    switch (type) {
      case 'cactus':
        sprite.setSize(16, 40);
        sprite.setOffset(4, 8);
        break;
      case 'rock':
        sprite.setSize(28, 20);
        sprite.setOffset(2, 4);
        break;
      case 'bird':
        sprite.setSize(28, 16);
        sprite.setOffset(2, 4);
        break;
      case 'spike':
        sprite.setSize(16, 28);
        sprite.setOffset(4, 4);
        break;
    }
  }

  private setupAnimations(): void {
    if (this.type === 'bird') {
      if (!this.scene.anims.exists('bird-fly')) {
        this.scene.anims.create({
          key: 'bird-fly',
          frames: [
            { key: 'obstacle-bird-0' },
            { key: 'obstacle-bird-1' },
          ],
          frameRate: 8,
          repeat: -1,
        });
      }
      
      this.sprite.play('bird-fly');
    }
  }

  public update(speed: number, delta: number): void {
    this.sprite.x -= (speed * delta) / 1000;

    if (this.type === 'bird') {
      this.sprite.y += Math.sin(this.scene.time.now / 200) * 0.5;
    }
  }

  public isOffScreen(): boolean {
    return this.sprite.x < -this.sprite.width;
  }

  public destroy(): void {
    this.sprite.destroy();
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getType(): ObstacleType {
    return this.type;
  }
}
