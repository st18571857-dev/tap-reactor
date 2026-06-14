// Storage Manager - Handles Local Storage for High Scores and Statistics
class StorageManager {
  constructor() {
    this.highScoresKey = CONFIG.STORAGE.HIGH_SCORES;
    this.statisticsKey = CONFIG.STORAGE.STATISTICS;
    this.settingsKey = CONFIG.STORAGE.SETTINGS;
    this.maxHighScores = 10;
  }

  // High Scores Management
  saveHighScore(score, mode) {
    const highScores = this.getHighScores();
    const newScore = {
      score: score,
      mode: mode,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(this.maxHighScores);

    localStorage.setItem(this.highScoresKey, JSON.stringify(highScores));
    return newScore;
  }

  getHighScores() {
    try {
      const scores = localStorage.getItem(this.highScoresKey);
      return scores ? JSON.parse(scores) : [];
    } catch (e) {
      console.error('Error retrieving high scores:', e);
      return [];
    }
  }

  getHighScore() {
    const scores = this.getHighScores();
    return scores.length > 0 ? scores[0].score : 0;
  }

  clearHighScores() {
    localStorage.removeItem(this.highScoresKey);
  }

  // Statistics Management
  saveStatistics(stats) {
    try {
      localStorage.setItem(this.statisticsKey, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving statistics:', e);
    }
  }

  getStatistics() {
    try {
      const stats = localStorage.getItem(this.statisticsKey);
      return stats ? JSON.parse(stats) : this.getDefaultStatistics();
    } catch (e) {
      console.error('Error retrieving statistics:', e);
      return this.getDefaultStatistics();
    }
  }

  getDefaultStatistics() {
    return {
      gamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      bestCombo: 0,
      totalTaps: 0,
      accuracyRate: 0,
      modeStats: {
        tap: { played: 0, bestScore: 0 },
        color: { played: 0, bestScore: 0 },
        danger: { played: 0, bestScore: 0 },
        survival: { played: 0, bestScore: 0 }
      }
    };
  }

  updateStatistics(mode, score, combo, taps) {
    const stats = this.getStatistics();
    
    stats.gamesPlayed += 1;
    stats.totalScore += score;
    stats.averageScore = Math.floor(stats.totalScore / stats.gamesPlayed);
    stats.bestCombo = Math.max(stats.bestCombo, combo);
    stats.totalTaps += taps;

    if (stats.modeStats[mode]) {
      stats.modeStats[mode].played += 1;
      stats.modeStats[mode].bestScore = Math.max(stats.modeStats[mode].bestScore, score);
    }

    this.saveStatistics(stats);
    return stats;
  }

  clearStatistics() {
    localStorage.removeItem(this.statisticsKey);
  }

  // Settings Management
  saveSettings(settings) {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  getSettings() {
    try {
      const settings = localStorage.getItem(this.settingsKey);
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (e) {
      console.error('Error retrieving settings:', e);
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      soundEnabled: true,
      musicEnabled: true,
      vibrationEnabled: true,
      particlesEnabled: true
    };
  }

  updateSettings(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    this.saveSettings(settings);
    return settings;
  }

  clearSettings() {
    localStorage.removeItem(this.settingsKey);
  }

  // Utility
  clearAllData() {
    this.clearHighScores();
    this.clearStatistics();
    this.clearSettings();
  }
}

// Initialize Storage Manager
const storageManager = new StorageManager();
