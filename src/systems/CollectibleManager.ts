import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { Collectible, CollectibleType } from '../entities/Collectible';

export class CollectibleManager {
  private scene: Phaser.Scene;
  private coins: Collectible[] = [];
  private powerups: Collectible[] = [];
  private coinGroup!: Phaser.Physics.Arcade.Group;
  private powerupGroup!: Phaser.Physics.Arcade.Group;
  private magnetActive: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(): void {
    this.coinGroup = this.scene.physics.add.group({
      allowGravity: false,
    });

    this.powerupGroup = this.scene.physics.add.group({
      allowGravity: false,
    });
  }

  public update(speed: number, delta: number): void {
    const playerPos = this.getPlayerPosition();

    this.updateCollectibles(this.coins, this.coinGroup, speed, delta, playerPos);

    this.updateCollectibles(this.powerups, this.powerupGroup, speed, delta);

    this.trySpawnCoins(speed);
    this.trySpawnPowerup(speed);
  }

  private updateCollectibles(
    collectibles: Collectible[],
    group: Phaser.Physics.Arcade.Group,
    speed: number,
    delta: number,
    playerPos?: { x: number; y: number }
  ): void {
    collectibles.forEach((collectible, _index) => {
      collectible.update(speed, delta);

      if (this.magnetActive && playerPos && collectible.getType() === 'coin') {
        const sprite = collectible.getSprite();
        const distance = Phaser.Math.Distance.Between(
          sprite.x,
          sprite.y,
          playerPos.x,
          playerPos.y
        );

        if (distance < 200) {
          collectible.moveTowardsPlayer(playerPos.x, playerPos.y, delta);
        }
      }
    });

    for (let i = collectibles.length - 1; i >= 0; i--) {
      if (collectibles[i].isOffScreen()) {
        group.remove(collectibles[i].getSprite(), true, true);
        collectibles[i].destroy();
        collectibles.splice(i, 1);
      }
    }
  }

  private trySpawnCoins(_speed: number): void {
    const spawnGap = Phaser.Math.Between(150, 300);
    const rightmostX = this.getRightmostCoinX();

    if (rightmostX < GAME_CONFIG.WIDTH - spawnGap) {
      if (Math.random() < 0.4) {
        this.spawnCoinPattern();
      }
    }
  }

  private spawnCoinPattern(): void {
    const patterns = ['line', 'arc', 'zigzag'];
    const pattern = Phaser.Utils.Array.GetRandom(patterns);
    const startX = GAME_CONFIG.WIDTH + 50;
    const baseY = GAME_CONFIG.HEIGHT - 100;

    switch (pattern) {
      case 'line':
        this.spawnCoinLine(startX, baseY, 5);
        break;
      case 'arc':
        this.spawnCoinArc(startX, baseY, 5);
        break;
      case 'zigzag':
        this.spawnCoinZigzag(startX, baseY, 5);
        break;
    }
  }

  private spawnCoinLine(startX: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      this.spawnCoin(startX + i * 30, y);
    }
  }

  private spawnCoinArc(startX: number, baseY: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const arcHeight = Math.sin(progress * Math.PI) * 50;
      this.spawnCoin(startX + i * 30, baseY - arcHeight);
    }
  }

  private spawnCoinZigzag(startX: number, baseY: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const yOffset = (i % 2 === 0) ? 0 : -30;
      this.spawnCoin(startX + i * 30, baseY + yOffset);
    }
  }

  private spawnCoin(x: number, y: number): void {
    const coin = new Collectible(this.scene, x, y, 'coin');
    this.coins.push(coin);
    this.coinGroup.add(coin.getSprite());
  }

  private trySpawnPowerup(_speed: number): void {
    const spawnGap = Phaser.Math.Between(1000, 2000);
    const rightmostX = this.getRightmostPowerupX();

    if (rightmostX < GAME_CONFIG.WIDTH - spawnGap && Math.random() < 0.02) {
      this.spawnPowerup();
    }
  }

  private spawnPowerup(): void {
    const types: CollectibleType[] = ['shield', 'magnet', 'speed'];
    const type = Phaser.Utils.Array.GetRandom(types);
    const x = GAME_CONFIG.WIDTH + 50;
    const y = GAME_CONFIG.HEIGHT - Phaser.Math.Between(80, 150);

    const powerup = new Collectible(this.scene, x, y, type);
    this.powerups.push(powerup);
    this.powerupGroup.add(powerup.getSprite());
  }

  private getRightmostCoinX(): number {
    if (this.coins.length === 0) return 0;
    return Math.max(...this.coins.map((c) => c.getSprite().x));
  }

  private getRightmostPowerupX(): number {
    if (this.powerups.length === 0) return 0;
    return Math.max(...this.powerups.map((p) => p.getSprite().x));
  }

  private getPlayerPosition(): { x: number; y: number } | undefined {
    const gameScene = this.scene as any;
    if (gameScene.getPlayer) {
      return gameScene.getPlayer().getPosition();
    }
    return undefined;
  }

  public activateMagnet(duration: number): void {
    this.magnetActive = true;
    
    this.scene.time.delayedCall(duration, () => {
      this.magnetActive = false;
    });
  }

  public getCoinGroup(): Phaser.Physics.Arcade.Group {
    return this.coinGroup;
  }

  public getPowerupGroup(): Phaser.Physics.Arcade.Group {
    return this.powerupGroup;
  }

  public clear(): void {
    this.coins.forEach((coin) => coin.destroy());
    this.powerups.forEach((powerup) => powerup.destroy());
    this.coins = [];
    this.powerups = [];
    this.coinGroup.clear(true, true);
    this.powerupGroup.clear(true, true);
  }
}
