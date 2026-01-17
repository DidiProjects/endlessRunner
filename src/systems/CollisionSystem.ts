import Phaser from 'phaser';

export class CollisionSystem {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public checkCollision(
    sprite1: Phaser.Physics.Arcade.Sprite,
    sprite2: Phaser.Physics.Arcade.Sprite
  ): boolean {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2);
  }

  public checkPreciseCollision(
    sprite1: Phaser.Physics.Arcade.Sprite,
    sprite2: Phaser.Physics.Arcade.Sprite,
    shrinkFactor: number = 0.8
  ): boolean {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    const shrunkBounds1 = new Phaser.Geom.Rectangle(
      bounds1.x + bounds1.width * (1 - shrinkFactor) / 2,
      bounds1.y + bounds1.height * (1 - shrinkFactor) / 2,
      bounds1.width * shrinkFactor,
      bounds1.height * shrinkFactor
    );

    const shrunkBounds2 = new Phaser.Geom.Rectangle(
      bounds2.x + bounds2.width * (1 - shrinkFactor) / 2,
      bounds2.y + bounds2.height * (1 - shrinkFactor) / 2,
      bounds2.width * shrinkFactor,
      bounds2.height * shrinkFactor
    );

    return Phaser.Geom.Intersects.RectangleToRectangle(shrunkBounds1, shrunkBounds2);
  }

  public checkCollectionRange(
    playerSprite: Phaser.Physics.Arcade.Sprite,
    collectibleSprite: Phaser.Physics.Arcade.Sprite,
    range: number = 30
  ): boolean {
    const distance = Phaser.Math.Distance.Between(
      playerSprite.x,
      playerSprite.y,
      collectibleSprite.x,
      collectibleSprite.y
    );

    return distance < range;
  }

  public getCollisionDirection(
    movingSprite: Phaser.Physics.Arcade.Sprite,
    staticSprite: Phaser.Physics.Arcade.Sprite
  ): 'top' | 'bottom' | 'left' | 'right' | 'none' {
    const movingBounds = movingSprite.getBounds();
    const staticBounds = staticSprite.getBounds();

    if (!Phaser.Geom.Intersects.RectangleToRectangle(movingBounds, staticBounds)) {
      return 'none';
    }

    const overlapX = Math.min(
      movingBounds.right - staticBounds.left,
      staticBounds.right - movingBounds.left
    );
    const overlapY = Math.min(
      movingBounds.bottom - staticBounds.top,
      staticBounds.bottom - movingBounds.top
    );

    if (overlapX < overlapY) {
      return movingBounds.centerX < staticBounds.centerX ? 'right' : 'left';
    } else {
      return movingBounds.centerY < staticBounds.centerY ? 'bottom' : 'top';
    }
  }

  public enableDebugVisualization(): void {
    this.scene.physics.world.createDebugGraphic();
  }

  public disableDebugVisualization(): void {
    this.scene.physics.world.debugGraphic?.clear();
  }
}
