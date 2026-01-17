import Phaser from 'phaser';
import { GAME_CONFIG, EVENTS } from '../config';
import { Player } from '../entities/Player';
import {
  ObstacleManager,
  CollectibleManager,
  BackgroundManager,
  CollisionSystem,
  ScoreManager,
  UIManager,
  ParticleManager,
} from '../systems';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  
  private obstacleManager!: ObstacleManager;
  private collectibleManager!: CollectibleManager;
  private backgroundManager!: BackgroundManager;
  private scoreManager!: ScoreManager;
  private uiManager!: UIManager;
  private particleManager!: ParticleManager;
  
  private gameSpeed: number = GAME_CONFIG.SPEED.INITIAL;
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  private distanceTraveled: number = 0;

  private ground!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.resetGameState();
    this.createBackground();
    this.createGround();
    this.createPlayer();
    this.initializeManagers();
    this.setupCollisions();
    this.setupInput();
    this.setupEvents();
    
    this.cameras.main.fadeIn(500);
  }

  update(time: number, delta: number): void {
    if (this.isGameOver || this.isPaused) return;

    this.updateGameSpeed(delta);

    this.backgroundManager.update(this.gameSpeed, delta);
    this.player.update(time, delta);
    this.obstacleManager.update(this.gameSpeed, delta);
    this.collectibleManager.update(this.gameSpeed, delta);
    this.particleManager.update(delta);

    this.distanceTraveled += (this.gameSpeed * delta) / 1000;
    this.scoreManager.updateDistance(this.distanceTraveled);
    this.uiManager.update();
  }

  private resetGameState(): void {
    this.gameSpeed = GAME_CONFIG.SPEED.INITIAL;
    this.isGameOver = false;
    this.isPaused = false;
    this.distanceTraveled = 0;
  }

  private createBackground(): void {
    this.backgroundManager = new BackgroundManager(this);
    this.backgroundManager.create();
  }

  private createGround(): void {
    this.ground = this.physics.add.staticGroup();
    
    const groundY = GAME_CONFIG.HEIGHT - 16;
    for (let i = 0; i < Math.ceil(GAME_CONFIG.WIDTH / 64) + 2; i++) {
      const tile = this.ground.create(i * 64, groundY, 'ground-tile');
      tile.setOrigin(0, 0.5);
      tile.refreshBody();
    }
  }

  private createPlayer(): void {
    this.player = new Player(
      this,
      GAME_CONFIG.PLAYER.START_X,
      GAME_CONFIG.HEIGHT - 80
    );
  }

  private initializeManagers(): void {
    this.particleManager = new ParticleManager(this);
    this.particleManager.create();

    this.obstacleManager = new ObstacleManager(this);
    this.obstacleManager.create();

    this.collectibleManager = new CollectibleManager(this);
    this.collectibleManager.create();

    this.scoreManager = new ScoreManager(this);
    this.scoreManager.create();

    this.uiManager = new UIManager(this, this.scoreManager);
    this.uiManager.create();

    new CollisionSystem(this);
  }

  private setupCollisions(): void {
    this.physics.add.collider(this.player.getSprite(), this.ground, () => {
      if (this.player.isInAir()) {
        this.player.land();
        this.particleManager.emitDust(
          this.player.getSprite().x,
          this.player.getSprite().y + GAME_CONFIG.PLAYER.HEIGHT / 2
        );
      }
    });

    this.physics.add.overlap(
      this.player.getSprite(),
      this.obstacleManager.getGroup(),
      (_playerSprite, obstacle) => {
        this.handleObstacleCollision(obstacle as Phaser.Physics.Arcade.Sprite);
      }
    );

    this.physics.add.overlap(
      this.player.getSprite(),
      this.collectibleManager.getCoinGroup(),
      (_playerSprite, coin) => {
        this.handleCoinCollection(coin as Phaser.Physics.Arcade.Sprite);
      }
    );

    this.physics.add.overlap(
      this.player.getSprite(),
      this.collectibleManager.getPowerupGroup(),
      (_playerSprite, powerup) => {
        this.handlePowerupCollection(powerup as Phaser.Physics.Arcade.Sprite);
      }
    );
  }

  private setupInput(): void {
    this.input.keyboard?.on('keydown-SPACE', () => this.handleJump());
    this.input.keyboard?.on('keydown-UP', () => this.handleJump());
    this.input.keyboard?.on('keydown-W', () => this.handleJump());
    
    this.input.keyboard?.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard?.on('keydown-P', () => this.togglePause());

    this.input.on('pointerdown', () => {
      if (!this.isGameOver) {
        this.handleJump();
      }
    });
  }

  private setupEvents(): void {
    this.events.on(EVENTS.PLAYER_DIE, this.handleGameOver, this);
    this.events.on(EVENTS.GAME_RESTART, this.restartGame, this);

    this.events.on('shutdown', () => {
      this.events.off(EVENTS.PLAYER_DIE, this.handleGameOver, this);
      this.events.off(EVENTS.GAME_RESTART, this.restartGame, this);
    });
  }

  private handleJump(): void {
    if (this.isGameOver || this.isPaused) return;
    
    if (this.player.jump()) {
      this.particleManager.emitJumpTrail(
        this.player.getSprite().x,
        this.player.getSprite().y + GAME_CONFIG.PLAYER.HEIGHT / 2
      );
    }
  }

  private handleObstacleCollision(obstacle: Phaser.Physics.Arcade.Sprite): void {
    if (this.isGameOver) return;
    
    if (this.player.hasShield()) {
      this.player.removeShield();
      obstacle.destroy();
      this.particleManager.emitSpark(obstacle.x, obstacle.y);
      return;
    }

    this.events.emit(EVENTS.COLLISION_DETECTED);
    this.gameOver();
  }

  private handleCoinCollection(coin: Phaser.Physics.Arcade.Sprite): void {
    if (!coin.active) return;
    
    this.scoreManager.addCoins(1);
    this.particleManager.emitSpark(coin.x, coin.y);
    coin.destroy();
    
    this.events.emit(EVENTS.COIN_COLLECTED);
  }

  private handlePowerupCollection(powerup: Phaser.Physics.Arcade.Sprite): void {
    if (!powerup.active) return;
    
    const powerupType = powerup.getData('type') as string;
    
    switch (powerupType) {
      case 'shield':
        this.player.activateShield();
        break;
      case 'magnet':
        this.collectibleManager.activateMagnet(GAME_CONFIG.COLLECTIBLES.POWERUP_DURATION);
        break;
      case 'speed':
        this.gameSpeed = Math.min(this.gameSpeed * 1.5, GAME_CONFIG.SPEED.MAX);
        this.time.delayedCall(GAME_CONFIG.COLLECTIBLES.POWERUP_DURATION, () => {
          this.gameSpeed = Math.max(this.gameSpeed / 1.5, GAME_CONFIG.SPEED.INITIAL);
        });
        break;
    }

    this.particleManager.emitSpark(powerup.x, powerup.y);
    powerup.destroy();
    
    this.events.emit(EVENTS.POWERUP_COLLECTED, powerupType);
  }

  private updateGameSpeed(delta: number): void {
    if (this.gameSpeed < GAME_CONFIG.SPEED.MAX) {
      this.gameSpeed += GAME_CONFIG.SPEED.INCREMENT * (delta / 1000);
    }
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.physics.pause();
      this.uiManager.showPauseMenu();
      this.events.emit(EVENTS.GAME_PAUSE);
    } else {
      this.physics.resume();
      this.uiManager.hidePauseMenu();
      this.events.emit(EVENTS.GAME_RESUME);
    }
  }

  private gameOver(): void {
    this.isGameOver = true;
    this.player.die();
    this.physics.pause();
    
    this.cameras.main.shake(300, 0.02);
    
    this.cameras.main.flash(200, 255, 0, 0);

    this.scoreManager.saveHighScore();

    this.time.delayedCall(1000, () => {
      this.uiManager.showGameOver(
        this.scoreManager.getScore(),
        this.scoreManager.getHighScore(),
        this.scoreManager.getCoins()
      );
    });

    this.events.emit(EVENTS.GAME_OVER);
  }

  private handleGameOver(): void {
    this.gameOver();
  }

  private restartGame(): void {
    this.scene.restart();
  }

  public getPlayer(): Player {
    return this.player;
  }

  public getGameSpeed(): number {
    return this.gameSpeed;
  }

  public getParticleManager(): ParticleManager {
    return this.particleManager;
  }
}
