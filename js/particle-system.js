// Particle System - Handles visual particle effects
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
  }

  createBurst(x, y, color, count = 8) {
    const settings = storageManager.getSettings();
    if (!settings.particlesEnabled) return;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4
      };

      this.particles.push({
        x: x,
        y: y,
        vx: velocity.x,
        vy: velocity.y,
        color: color,
        alpha: 1,
        size: 5,
        life: CONFIG.EFFECTS.PARTICLE_LIFETIME,
        maxLife: CONFIG.EFFECTS.PARTICLE_LIFETIME,
        type: 'burst'
      });
    }
  }

  createComboEffect(x, y) {
    const settings = storageManager.getSettings();
    if (!settings.particlesEnabled) return;

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * 2,
        vy: Math.sin(angle) * 2,
        color: CONFIG.COLORS.YELLOW,
        alpha: 1,
        size: 8,
        life: 400,
        maxLife: 400,
        type: 'combo'
      });
    }
  }

  update(deltaTime) {
    this.particles = this.particles.filter(p => p.life > 0);

    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // gravity
      particle.life -= deltaTime;
      particle.alpha = particle.life / particle.maxLife;
      
      if (particle.type === 'combo') {
        particle.size = 8 * particle.alpha;
      }
    });
  }

  render() {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }
}
