// Audio Manager - Handles all game sounds and music
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.sounds = {};
    this.music = null;
    this.enabled = true;
    this.initialized = false;
    
    // Get settings
    const settings = storageManager.getSettings();
    this.soundEnabled = settings.soundEnabled;
    this.musicEnabled = settings.musicEnabled;
    
    // Initialize Web Audio API
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = 0.5;
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not available:', e);
    }
  }

  // Play Tap Sound
  playTapSound() {
    if (!this.enabled || !this.soundEnabled || !this.initialized) return;
    
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn('Error playing tap sound:', e);
    }
  }

  // Play Success Sound
  playSuccessSound() {
    if (!this.enabled || !this.soundEnabled || !this.initialized) return;
    
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Error playing success sound:', e);
    }
  }

  // Play Danger Sound
  playDangerSound() {
    if (!this.enabled || !this.soundEnabled || !this.initialized) return;
    
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Error playing danger sound:', e);
    }
  }

  // Play Combo Sound
  playComboSound() {
    if (!this.enabled || !this.soundEnabled || !this.initialized) return;
    
    try {
      const now = this.audioContext.currentTime;
      const frequencies = [1200, 1400, 1600];
      
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, now + index * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.05 + 0.1);
        
        osc.start(now + index * 0.05);
        osc.stop(now + index * 0.05 + 0.1);
      });
    } catch (e) {
      console.warn('Error playing combo sound:', e);
    }
  }

  // Play Game Over Sound
  playGameOverSound() {
    if (!this.enabled || !this.soundEnabled || !this.initialized) return;
    
    try {
      const now = this.audioContext.currentTime;
      const frequencies = [800, 600, 400];
      
      frequencies.forEach((freq, index) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, now + index * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.2);
        
        osc.start(now + index * 0.15);
        osc.stop(now + index * 0.15 + 0.2);
      });
    } catch (e) {
      console.warn('Error playing game over sound:', e);
    }
  }

  // Toggle Sound
  toggleSound(enabled) {
    this.soundEnabled = enabled;
    storageManager.updateSettings('soundEnabled', enabled);
  }

  // Toggle Music
  toggleMusic(enabled) {
    this.musicEnabled = enabled;
    storageManager.updateSettings('musicEnabled', enabled);
  }

  // Resume Audio Context (required for browser autoplay policies)
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Initialize Audio Manager
const audioManager = new AudioManager();
