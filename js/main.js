// Main Application Controller
class App {
  constructor() {
    this.initialized = false;
    this.init();
  }

  init() {
    // Check browser compatibility
    if (!this.checkCompatibility()) {
      console.error('Browser not supported');
      return;
    }

    // Initialize managers
    audioManager.resumeAudioContext();
    
    // Setup splash screen
    this.showSplashScreen();

    // Setup viewport
    this.setupViewport();

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());

    // Handle visibility change
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

    this.initialized = true;
  }

  checkCompatibility() {
    // Check for required APIs
    const hasCanvas = !!document.createElement('canvas').getContext;
    const hasStorage = !!window.localStorage;
    const hasAudio = !!(window.AudioContext || window.webkitAudioContext);

    return hasCanvas && hasStorage;
  }

  setupViewport() {
    // Ensure viewport is set correctly for mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
      document.head.appendChild(meta);
    }

    // Prevent zoom on double tap (mobile)
    document.addEventListener('touchstart', function(e) {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  showSplashScreen() {
    uiManager.showScreen('splash-screen');
    
    // Show splash for configured duration
    setTimeout(() => {
      uiManager.showScreen('main-menu');
    }, CONFIG.UI.SPLASH_DURATION);
  }

  handleResize() {
    // Handle window resize
    if (uiManager.gameEngine && uiManager.gameEngine.canvas) {
      uiManager.gameEngine.handleResize();
    }
  }

  handleVisibilityChange() {
    // Pause game if window loses focus
    if (document.hidden && uiManager.gameEngine && uiManager.gameEngine.state === 'playing') {
      uiManager.togglePause();
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
  });
} else {
  window.app = new App();
}
