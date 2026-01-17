import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';

export class ParticleManager {
  private scene: Phaser.Scene;
  private dustEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private sparkEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private trailEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create(): void {
    this.createDustEmitter();
    this.createSparkEmitter();
    this.createTrailEmitter();
  }

  private createDustEmitter(): void {
    this.dustEmitter = this.scene.add.particles(0, 0, 'particle-dust', {
      speed: { min: 20, max: 50 },
      angle: { min: 200, max: 340 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 400,
      gravityY: 100,
      emitting: false,
    });
    this.dustEmitter.setDepth(5);
  }

  private createSparkEmitter(): void {
    this.sparkEmitter = this.scene.add.particles(0, 0, 'particle-spark', {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 300,
      gravityY: 200,
      emitting: false,
    });
    this.sparkEmitter.setDepth(50);
  }

  private createTrailEmitter(): void {
    this.trailEmitter = this.scene.add.particles(0, 0, 'particle-trail', {
      speed: { min: 10, max: 30 },
      angle: { min: 170, max: 190 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 200,
      emitting: false,
    });
    this.trailEmitter.setDepth(3);
  }

  public emitDust(x: number, y: number, count: number = 5): void {
    if (this.dustEmitter) {
      this.dustEmitter.emitParticleAt(x, y, count);
    }
  }

  public emitSpark(x: number, y: number, count: number = 10): void {
    if (this.sparkEmitter) {
      this.sparkEmitter.emitParticleAt(x, y, count);
    }
  }

  public emitJumpTrail(x: number, y: number, count: number = 3): void {
    if (this.trailEmitter) {
      this.trailEmitter.emitParticleAt(x, y, count);
    }
  }

  public startRunTrail(x: number, y: number): void {
    if (this.trailEmitter) {
      this.trailEmitter.setPosition(x, y);
      this.trailEmitter.start();
    }
  }

  public stopRunTrail(): void {
    if (this.trailEmitter) {
      this.trailEmitter.stop();
    }
  }

  public update(_delta: number): void {
  }

  public createExplosion(x: number, y: number): void {
    if (this.sparkEmitter) {
      this.sparkEmitter.setParticleTint(GAME_CONFIG.COLORS.PRIMARY);
      this.sparkEmitter.emitParticleAt(x, y, 20);
      
      this.scene.time.delayedCall(100, () => {
        this.sparkEmitter?.setParticleTint(0xffffff);
      });
    }

    if (this.dustEmitter) {
      this.dustEmitter.emitParticleAt(x, y, 10);
    }
  }

  public destroy(): void {
    this.dustEmitter?.destroy();
    this.sparkEmitter?.destroy();
    this.trailEmitter?.destroy();
  }
}
