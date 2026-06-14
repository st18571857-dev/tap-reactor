// Game Object - Represents a tappable or dangerous object
class GameObject {
  constructor(x, y, radius, type, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.type = type; // 'target' or 'danger'
    this.color = color;
    this.alpha = 1;
    this.scale = 1;
    this.tapped = false;
    this.createdAt = Date.now();
    this.lifetime = 5000; // 5 seconds max
    this.pulsing = false;
    this.pulsePhase = 0;
  }

  update(deltaTime) {
    // Check if object has expired
    const age = Date.now() - this.createdAt;
    if (age > this.lifetime) {
      this.alpha = Math.max(0, this.alpha - 0.02);
    }

    // Pulsing animation
    if (!this.tapped && this.type === CONFIG.OBJECT_TYPES.TARGET) {
      this.pulsePhase += deltaTime / 500;
      this.scale = 1 + Math.sin(this.pulsePhase) * 0.1;
    }
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

    // Draw main circle
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw glow effect
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = this.alpha * 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
    ctx.stroke();

    // Draw border
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  isPointInside(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.radius * this.scale;
  }

  tap() {
    this.tapped = true;
    this.scale = 0.8;
  }

  isExpired() {
    return this.alpha <= 0;
  }
}
