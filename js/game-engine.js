// Game Engine - Core gameplay logic
class GameEngine {
  constructor() {
    this.state = 'menu'; // menu, playing, paused, gameover
    this.mode = CONFIG.MODES.TAP;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = CONFIG.INITIAL_LIVES;
    this.timeRemaining = CONFIG.GAME_DURATION;
    this.gameObjects = [];
    this.tapCount = 0;
    this.gameStartTime = 0;
    this.pauseStartTime = 0;
    this.totalPauseTime = 0;
    this.lastSpawnTime = 0;
    this.spawnRate = CONFIG.SPAWN.SPAWN_RATE_START;
    this.dangerChance = CONFIG.DIFFICULTY.DANGER_SPAWN_START;
    this.currentColorHint = null;
    this.comboResetTimer = 0;
    this.difficultyLevel = 1;
    this.lastDifficultyIncrease = 0;

    // Initialize canvas
    this.setupCanvas();
    this.setupParticles();
  }

  setupCanvas() {
    const gameArea = document.getElementById('game-area');
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 180; // Account for header/footer
    this.ctx = this.canvas.getContext('2d');
    gameArea.appendChild(this.canvas);

    // Setup input
    this.canvas.addEventListener('click', (e) => this.handleTap(e));
    this.canvas.addEventListener('touchstart', (e) => this.handleTap(e));
    window.addEventListener('resize', () => this.handleResize());
  }

  setupParticles() {
    this.particleSystem = new ParticleSystem(this.canvas);
  }

  start(mode = CONFIG.MODES.TAP) {
    this.mode = mode;
    this.state = 'playing';
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = CONFIG.INITIAL_LIVES;
    this.timeRemaining = CONFIG.GAME_DURATION;
    this.gameObjects = [];
    this.tapCount = 0;
    this.gameStartTime = Date.now();
    this.totalPauseTime = 0;
    this.difficultyLevel = 1;
    this.lastDifficultyIncrease = Date.now();
    this.spawnRate = CONFIG.SPAWN.SPAWN_RATE_START;
    this.dangerChance = CONFIG.DIFFICULTY.DANGER_SPAWN_START;
    
    // Set initial color hint for color challenge mode
    if (this.mode === CONFIG.MODES.COLOR) {
      this.setNewColorHint();
    }

    audioManager.resumeAudioContext();
  }

  update(deltaTime) {
    if (this.state !== 'playing') return;

    // Update time
    const elapsedSeconds = (Date.now() - this.gameStartTime - this.totalPauseTime) / 1000;
    this.timeRemaining = Math.max(0, CONFIG.GAME_DURATION - Math.floor(elapsedSeconds));

    // Check game over
    if (this.timeRemaining <= 0) {
      this.endGame();
      return;
    }

    // Update difficulty
    const difficultyElapsed = Date.now() - this.lastDifficultyIncrease;
    if (difficultyElapsed > CONFIG.DIFFICULTY.SPEED_INCREASE_INTERVAL * 1000) {
      this.increaseDifficulty();
      this.lastDifficultyIncrease = Date.now();
    }

    // Update combo reset timer
    if (this.comboResetTimer > 0) {
      this.comboResetTimer -= deltaTime;
    }

    // Spawn new objects
    if (Date.now() - this.lastSpawnTime > this.spawnRate && this.gameObjects.length < CONFIG.SPAWN.MAX_OBJECTS) {
      this.spawnObject();
      this.lastSpawnTime = Date.now();
    }

    // Update game objects
    this.gameObjects.forEach(obj => obj.update(deltaTime));
    this.gameObjects = this.gameObjects.filter(obj => !obj.isExpired());

    // Update particles
    this.particleSystem.update(deltaTime);

    // Render
    this.render();
  }

  spawnObject() {
    const x = Math.random() * (this.canvas.width - 120) + 60;
    const y = Math.random() * (this.canvas.height - 120) + 60;
    const radius = CONFIG.SPAWN.MIN_RADIUS + Math.random() * (CONFIG.SPAWN.MAX_RADIUS - CONFIG.SPAWN.MIN_RADIUS);

    let type = CONFIG.OBJECT_TYPES.TARGET;
    let color = this.getRandomTargetColor();

    // Danger chance increases over time
    if (Math.random() < this.dangerChance) {
      type = CONFIG.OBJECT_TYPES.DANGER;
      color = CONFIG.COLORS.BLACK;
    }

    const obj = new GameObject(x, y, radius, type, color);
    this.gameObjects.push(obj);
  }

  getRandomTargetColor() {
    if (this.mode === CONFIG.MODES.COLOR && this.currentColorHint) {
      // Mix target color with random colors
      if (Math.random() < 0.3) {
        return this.currentColorHint;
      }
    }

    const colors = [CONFIG.COLORS.BLUE, CONFIG.COLORS.GREEN, CONFIG.COLORS.YELLOW, CONFIG.COLORS.PURPLE, CONFIG.COLORS.RED];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  setNewColorHint() {
    const colors = [CONFIG.COLORS.BLUE, CONFIG.COLORS.GREEN, CONFIG.COLORS.YELLOW, CONFIG.COLORS.PURPLE, CONFIG.COLORS.RED];
    this.currentColorHint = colors[Math.floor(Math.random() * colors.length)];
  }

  handleTap(event) {
    if (this.state !== 'playing') return;

    const rect = this.canvas.getBoundingClientRect();
    let x, y;

    if (event.touches) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    // Check for taps on objects
    for (let i = this.gameObjects.length - 1; i >= 0; i--) {
      const obj = this.gameObjects[i];
      if (obj.isPointInside(x, y) && !obj.tapped) {
        this.tapObject(obj);
        break;
      }
    }

    audioManager.playTapSound();
  }

  tapObject(obj) {
    obj.tap();
    this.tapCount++;
    this.comboResetTimer = CONFIG.COMBO.RESET_TIMEOUT;

    if (obj.type === CONFIG.OBJECT_TYPES.TARGET) {
      // Check color match in color challenge mode
      let isCorrectColor = true;
      if (this.mode === CONFIG.MODES.COLOR) {
        isCorrectColor = obj.color === this.currentColorHint;
        if (!isCorrectColor) {
          this.lives--;
          if (this.lives <= 0) this.endGame();
          audioManager.playDangerSound();
          return;
        }
      }

      // Score calculation
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      const multiplier = 1 + (this.combo - 1) * CONFIG.COMBO.MULTIPLIER_INCREASE;
      const points = Math.floor(CONFIG.POINTS.TAP_TARGET * multiplier);
      this.score += points;

      // Effects
      audioManager.playSuccessSound();
      this.particleSystem.createBurst(obj.x, obj.y, obj.color);
      
      if (this.combo > 1 && this.combo % 5 === 0) {
        audioManager.playComboSound();
        this.particleSystem.createComboEffect(this.canvas.width / 2, this.canvas.height / 2);
      }

      // Update UI
      this.updateUI();
    } else if (obj.type === CONFIG.OBJECT_TYPES.DANGER) {
      // Hit danger object
      this.lives--;
      this.combo = 0;
      this.comboResetTimer = 0;
      
      audioManager.playDangerSound();
      this.screenShake();
      this.flashScreen(CONFIG.COLORS.RED);
      
      this.updateUI();
      
      if (this.lives <= 0) {
        this.endGame();
      }
    }
  }

  increaseDifficulty() {
    this.difficultyLevel++;
    this.spawnRate = Math.max(CONFIG.SPAWN.SPAWN_RATE_MIN, this.spawnRate * CONFIG.DIFFICULTY.SPEED_MULTIPLIER);
    this.dangerChance = Math.min(CONFIG.DIFFICULTY.DANGER_SPAWN_MAX, this.dangerChance + CONFIG.DIFFICULTY.DANGER_INCREASE);
  }

  screenShake() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.classList.add('animate-screenShake');
    setTimeout(() => gameContainer.classList.remove('animate-screenShake'), CONFIG.EFFECTS.SCREEN_SHAKE_DURATION);
  }

  flashScreen(color) {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.background = color;
    flash.style.opacity = '0.3';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '999';
    flash.style.animation = 'fadeOut 0.3s ease-out';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
  }

  pause() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.pauseStartTime = Date.now();
    }
  }

  resume() {
    if (this.state === 'paused') {
      this.totalPauseTime += Date.now() - this.pauseStartTime;
      this.state = 'playing';
    }
  }

  endGame() {
    this.state = 'gameover';
    audioManager.playGameOverSound();
    
    // Save statistics
    storageManager.updateStatistics(this.mode, this.score, this.maxCombo, this.tapCount);
    storageManager.saveHighScore(this.score, this.mode);
  }

  updateUI() {
    document.getElementById('score-display').textContent = this.score;
    document.getElementById('lives-display').textContent = this.lives;
    document.getElementById('timer-display').textContent = this.timeRemaining;
    
    const comboDisplay = document.getElementById('combo-display');
    if (this.combo > 1) {
      comboDisplay.style.display = 'block';
      document.getElementById('combo-count').textContent = this.combo;
      comboDisplay.classList.add('animate-scalePulse');
      setTimeout(() => comboDisplay.classList.remove('animate-scalePulse'), 600);
    } else {
      comboDisplay.style.display = 'none';
    }
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render game objects
    this.gameObjects.forEach(obj => obj.render(this.ctx));

    // Render particles
    this.particleSystem.render();

    // Render color hint for color challenge mode
    if (this.mode === CONFIG.MODES.COLOR && this.currentColorHint) {
      this.renderColorHint();
    }
  }

  renderColorHint() {
    this.ctx.save();
    this.ctx.font = 'bold 32px Arial';
    this.ctx.fillStyle = this.currentColorHint;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('TAP ' + this.getColorName(this.currentColorHint).toUpperCase(), this.canvas.width / 2, 50);
    this.ctx.restore();
  }

  getColorName(color) {
    const colorMap = {
      [CONFIG.COLORS.RED]: 'RED',
      [CONFIG.COLORS.BLUE]: 'BLUE',
      [CONFIG.COLORS.GREEN]: 'GREEN',
      [CONFIG.COLORS.YELLOW]: 'YELLOW',
      [CONFIG.COLORS.PURPLE]: 'PURPLE'
    };
    return colorMap[color] || 'COLOR';
  }

  handleResize() {
    const gameArea = document.getElementById('game-area');
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight - 180;
    }
  }
}

// Initialize Game Engine
let gameEngine = null;
