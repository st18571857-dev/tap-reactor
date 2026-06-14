// Game Configuration
const CONFIG = {
  // Game Modes
  MODES: {
    TAP: 'tap',
    COLOR: 'color',
    DANGER: 'danger',
    SURVIVAL: 'survival'
  },

  // Game Settings
  GAME_DURATION: 30, // seconds
  INITIAL_LIVES: 3,
  FPS_TARGET: 60,
  
  // Scoring
  POINTS: {
    TAP_TARGET: 1,
    COMBO_MULTIPLIER: 1.1,
    DANGER_HIT_PENALTY: -5
  },

  // Game Objects
  OBJECT_TYPES: {
    TARGET: 'target',
    DANGER: 'danger',
    COLOR_HINT: 'color_hint'
  },

  // Colors
  COLORS: {
    RED: '#ff0055',
    BLUE: '#00d4ff',
    GREEN: '#00ff41',
    YELLOW: '#ffcc00',
    PURPLE: '#9d4edd',
    BLACK: '#1a1a1a'
  },

  // Spawn Settings
  SPAWN: {
    MIN_RADIUS: 30,
    MAX_RADIUS: 60,
    SPAWN_RATE_START: 1000, // ms
    SPAWN_RATE_MIN: 300,
    SPAWN_RATE_DECREASE: 20, // ms per second
    MAX_OBJECTS: 15
  },

  // Difficulty Progression
  DIFFICULTY: {
    SPEED_INCREASE_INTERVAL: 5, // every 5 seconds
    SPEED_MULTIPLIER: 0.95, // spawn rate multiplier
    DANGER_SPAWN_START: 0.05, // 5% chance
    DANGER_SPAWN_MAX: 0.3, // max 30% chance
    DANGER_INCREASE: 0.02 // 2% increase per interval
  },

  // Combo System
  COMBO: {
    RESET_ON_DANGER: true,
    RESET_TIMEOUT: 2000, // ms
    MULTIPLIER_INCREASE: 0.1
  },

  // Audio
  AUDIO: {
    TAP_SOUND: 'tap',
    SUCCESS_SOUND: 'success',
    DANGER_SOUND: 'danger',
    COMBO_SOUND: 'combo',
    GAME_OVER_SOUND: 'gameover',
    BACKGROUND_MUSIC: 'background'
  },

  // Visual Effects
  EFFECTS: {
    PARTICLE_COUNT: 10,
    PARTICLE_LIFETIME: 600, // ms
    SCREEN_SHAKE_DURATION: 200, // ms
    SCREEN_SHAKE_INTENSITY: 5, // pixels
    FLASH_DURATION: 300 // ms
  },

  // UI Settings
  UI: {
    SPLASH_DURATION: 2500, // ms
    TRANSITION_SPEED: 300, // ms
    BUTTON_RIPPLE_DURATION: 600 // ms
  },

  // Storage Keys
  STORAGE: {
    HIGH_SCORES: 'tap_reactor_high_scores',
    STATISTICS: 'tap_reactor_statistics',
    SETTINGS: 'tap_reactor_settings',
    LAST_GAME_MODE: 'tap_reactor_last_mode'
  },

  // Device Detection
  DEVICE: {
    IS_MOBILE: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    IS_TOUCH: () => {
      return (('ontouchstart' in window) ||
              (navigator.maxTouchPoints > 0) ||
              (navigator.msMaxTouchPoints > 0));
    }
  },

  // Performance Settings
  PERFORMANCE: {
    ENABLE_VSYNC: true,
    ENABLE_ANIMATIONS: true,
    PARTICLE_QUALITY: 'medium', // low, medium, high
    MAX_PARTICLES: 50,
    DEBUG_MODE: false
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
