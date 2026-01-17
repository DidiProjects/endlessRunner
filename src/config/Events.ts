export const EVENTS = {
  PLAYER_JUMP: 'player:jump',
  PLAYER_LAND: 'player:land',
  PLAYER_DIE: 'player:die',
  PLAYER_POWERUP: 'player:powerup',
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_OVER: 'game:over',
  GAME_RESTART: 'game:restart',
  SCORE_UPDATE: 'score:update',
  SCORE_MILESTONE: 'score:milestone',
  HIGHSCORE_NEW: 'highscore:new',
  COIN_COLLECTED: 'coin:collected',
  POWERUP_COLLECTED: 'powerup:collected',
  POWERUP_EXPIRED: 'powerup:expired',
  OBSTACLE_PASSED: 'obstacle:passed',
  COLLISION_DETECTED: 'collision:detected',
  UI_SHOW_MENU: 'ui:showMenu',
  UI_HIDE_MENU: 'ui:hideMenu',
} as const;

export type GameEvents = typeof EVENTS;
