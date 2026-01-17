import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { Obstacle, ObstacleType } from '../entities/Obstacle';

export class ObstacleManager {
  private scene: Phaser.Scene;
  private obstacles: Obstacle[] = [];
  private obstacleGroup!: Phaser.Physics.Arcade.Group;
  private minSpawnDistance: number = GAME_CONFIG.OBSTACLES.MIN_GAP;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(): void {
    this.obstacleGroup = this.scene.physics.add.group({
      allowGravity: false,
    });
  }

  public update(speed: number, delta: number): void {
    this.obstacles.forEach((obstacle) => {
      obstacle.update(speed, delta);
    });

    this.obstacles = this.obstacles.filter((obstacle) => {
      if (obstacle.isOffScreen()) {
        this.obstacleGroup.remove(obstacle.getSprite(), true, true);
        obstacle.destroy();
        return false;
      }
      return true;
    });

    this.trySpawnObstacle(speed);
  }

  private trySpawnObstacle(_speed: number): void {
    const spawnDistance = Phaser.Math.Between(
      this.minSpawnDistance,
      GAME_CONFIG.OBSTACLES.MAX_GAP
    );

    const rightmostX = this.getRightmostObstacleX();
    
    if (rightmostX < GAME_CONFIG.WIDTH - spawnDistance) {
      this.spawnObstacle();
    }
  }

  private spawnObstacle(): void {
    const type = this.getRandomObstacleType();
    const x = GAME_CONFIG.WIDTH + 50;
    let y: number;

    switch (type) {
      case 'bird':
        y = GAME_CONFIG.HEIGHT - Phaser.Math.Between(100, 180);
        break;
      case 'cactus':
      case 'rock':
      case 'spike':
      default:
        y = GAME_CONFIG.HEIGHT - 32;
        break;
    }

    const obstacle = new Obstacle(this.scene, x, y, type);
    this.obstacles.push(obstacle);
    this.obstacleGroup.add(obstacle.getSprite());
  }

  private getRandomObstacleType(): ObstacleType {
    const types: ObstacleType[] = ['cactus', 'rock', 'bird', 'spike'];
    const weights = [0.35, 0.25, 0.25, 0.15];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < types.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return types[i];
      }
    }
    
    return 'cactus';
  }

  private getRightmostObstacleX(): number {
    if (this.obstacles.length === 0) return 0;
    
    return Math.max(...this.obstacles.map((o) => o.getSprite().x));
  }

  public getGroup(): Phaser.Physics.Arcade.Group {
    return this.obstacleGroup;
  }

  public getObstacles(): Obstacle[] {
    return this.obstacles;
  }

  public clear(): void {
    this.obstacles.forEach((obstacle) => {
      obstacle.destroy();
    });
    this.obstacles = [];
    this.obstacleGroup.clear(true, true);
  }
}
