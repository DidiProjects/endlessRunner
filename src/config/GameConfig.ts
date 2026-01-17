export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 400,
  PIXEL_RATIO: 1,
  GRAVITY: 1200,
  PLAYER: {
    START_X: 100,
    START_Y: 300,
    JUMP_VELOCITY: -500,
    DOUBLE_JUMP_VELOCITY: -400,
    MAX_JUMPS: 2,
    WIDTH: 32,
    HEIGHT: 48,
  },
  SPEED: {
    INITIAL: 300,
    INCREMENT: 0.5,
    MAX: 600,
  },
  OBSTACLES: {
    MIN_GAP: 300,
    MAX_GAP: 600,
    TYPES: ['cactus', 'rock', 'bird'],
  },
  COLLECTIBLES: {
    COIN_VALUE: 10,
    POWERUP_DURATION: 5000,
  },
  COLORS: {
    PRIMARY: 0xe94560,
    SECONDARY: 0x0f3460,
    BACKGROUND: 0x1a1a2e,
    ACCENT: 0x16213e,
    TEXT: 0xeaeaea,
    GOLD: 0xffd700,
    NEON_PINK: 0xff6b9d,
    NEON_CYAN: 0x00fff5,
    NEON_GREEN: 0x39ff14,
  },
  AUDIO: {
    MUSIC_VOLUME: 0.3,
    SFX_VOLUME: 0.5,
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;
