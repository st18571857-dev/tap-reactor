// UI Manager - Handles all screen navigation and UI interactions
class UIManager {
  constructor() {
    this.currentScreen = 'splash-screen';
    this.gameEngine = null;
    this.gameLoopId = null;
    this.lastFrameTime = Date.now();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Main Menu Buttons
    document.getElementById('btn-play').addEventListener('click', () => this.goToModeSelect());
    document.getElementById('btn-high-score').addEventListener('click', () => this.showHighScores());
    document.getElementById('btn-statistics').addEventListener('click', () => this.showStatistics());
    document.getElementById('btn-settings').addEventListener('click', () => this.showSettings());
    document.getElementById('btn-about').addEventListener('click', () => this.showAbout());

    // Mode Selection
    document.getElementById('btn-tap-mode').addEventListener('click', () => this.startGame(CONFIG.MODES.TAP));
    document.getElementById('btn-color-mode').addEventListener('click', () => this.startGame(CONFIG.MODES.COLOR));
    document.getElementById('btn-danger-mode').addEventListener('click', () => this.startGame(CONFIG.MODES.DANGER));
    document.getElementById('btn-survival-mode').addEventListener('click', () => this.startGame(CONFIG.MODES.SURVIVAL));
    document.getElementById('btn-back-menu').addEventListener('click', () => this.goToMainMenu());

    // Game Screen
    document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());

    // Pause Screen
    document.getElementById('btn-resume').addEventListener('click', () => this.resumeGame());
    document.getElementById('btn-quit').addEventListener('click', () => this.quitGame());

    // Game Over Screen
    document.getElementById('btn-play-again').addEventListener('click', () => this.goToModeSelect());
    document.getElementById('btn-main-menu').addEventListener('click', () => this.goToMainMenu());

    // Navigation Buttons
    document.getElementById('btn-back-high-score').addEventListener('click', () => this.goToMainMenu());
    document.getElementById('btn-back-statistics').addEventListener('click', () => this.goToMainMenu());
    document.getElementById('btn-back-settings').addEventListener('click', () => this.goToMainMenu());
    document.getElementById('btn-back-about').addEventListener('click', () => this.goToMainMenu());

    // Settings Toggles
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
      audioManager.toggleSound(e.target.checked);
    });
    document.getElementById('music-toggle').addEventListener('change', (e) => {
      audioManager.toggleMusic(e.target.checked);
    });
    document.getElementById('vibration-toggle').addEventListener('change', (e) => {
      storageManager.updateSettings('vibrationEnabled', e.target.checked);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentScreen === 'game-screen') {
        this.togglePause();
      }
    });
  }

  // Screen Navigation
  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.add('active');
      this.currentScreen = screenId;
    }
  }

  goToMainMenu() {
    this.showScreen('main-menu');
    this.stopGameLoop();
  }

  goToModeSelect() {
    this.showScreen('mode-select');
  }

  showHighScores() {
    this.updateHighScoresList();
    this.showScreen('high-score-screen');
  }

  showStatistics() {
    this.updateStatisticsDisplay();
    this.showScreen('statistics-screen');
  }

  showSettings() {
    this.updateSettingsUI();
    this.showScreen('settings-screen');
  }

  showAbout() {
    this.showScreen('about-screen');
  }

  // Game Control
  startGame(mode) {
    // Initialize game engine if not already done
    if (!this.gameEngine) {
      this.gameEngine = new GameEngine();
    }

    this.gameEngine.start(mode);
    this.showScreen('game-screen');
    this.startGameLoop();
  }

  togglePause() {
    if (this.gameEngine.state === 'playing') {
      this.gameEngine.pause();
      this.showScreen('pause-screen');
    } else if (this.gameEngine.state === 'paused') {
      this.resumeGame();
    }
  }

  resumeGame() {
    this.gameEngine.resume();
    this.showScreen('game-screen');
  }

  quitGame() {
    this.stopGameLoop();
    this.goToMainMenu();
  }

  // Game Loop
  startGameLoop() {
    let lastTime = Date.now();
    
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      // Update game
      if (this.gameEngine) {
        this.gameEngine.update(deltaTime);

        // Check if game over
        if (this.gameEngine.state === 'gameover') {
          this.showGameOver();
          this.stopGameLoop();
          return;
        }
      }

      this.gameLoopId = requestAnimationFrame(gameLoop);
    };

    this.gameLoopId = requestAnimationFrame(gameLoop);
  }

  stopGameLoop() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }

  // Game Over
  showGameOver() {
    document.getElementById('final-score').textContent = this.gameEngine.score;
    document.getElementById('high-score-info').textContent = storageManager.getHighScore();
    this.showScreen('game-over-screen');
  }

  // UI Updates
  updateHighScoresList() {
    const highScores = storageManager.getHighScores();
    const listContainer = document.getElementById('high-score-list');
    
    listContainer.innerHTML = '';

    if (highScores.length === 0) {
      listContainer.innerHTML = '<p style="color: #b0b8d4; padding: 20px;">No high scores yet. Start playing!</p>';
      return;
    }

    highScores.forEach((score, index) => {
      const item = document.createElement('div');
      item.className = 'high-score-item';
      item.innerHTML = `
        <span class="high-score-rank">#${index + 1}</span>
        <span>${score.mode.toUpperCase()}</span>
        <span class="high-score-value">${score.score}</span>
      `;
      listContainer.appendChild(item);
    });
  }

  updateStatisticsDisplay() {
    const stats = storageManager.getStatistics();
    const gridContainer = document.getElementById('stats-grid');
    
    gridContainer.innerHTML = '';

    const statCards = [
      { label: 'Games Played', value: stats.gamesPlayed },
      { label: 'Total Score', value: stats.totalScore },
      { label: 'Average Score', value: stats.averageScore },
      { label: 'Best Combo', value: stats.bestCombo },
      { label: 'Total Taps', value: stats.totalTaps }
    ];

    statCards.forEach(stat => {
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.innerHTML = `
        <div class="stat-card-label">${stat.label}</div>
        <div class="stat-card-value">${stat.value}</div>
      `;
      gridContainer.appendChild(card);
    });
  }

  updateSettingsUI() {
    const settings = storageManager.getSettings();
    document.getElementById('sound-toggle').checked = settings.soundEnabled;
    document.getElementById('music-toggle').checked = settings.musicEnabled;
    document.getElementById('vibration-toggle').checked = settings.vibrationEnabled;
  }
}

// Initialize UI Manager
const uiManager = new UIManager();
