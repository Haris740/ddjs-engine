export interface Vector2D {
  x: number;
  y: number;
}

export interface ParticleConfig {
  x: number;
  y: number;
  color: string;
  velocity?: Vector2D;
  size: number;
  life: number;
  initialLife?: number;
  gravity?: number;
}

export class Particle {
  x: number;
  y: number;
  color: string;
  velocity: Vector2D;
  size: number;
  life: number;
  initialLife: number;
  gravity: number;

  constructor(config: ParticleConfig) {
    this.x = config.x;
    this.y = config.y;
    this.color = config.color;
    this.velocity = config.velocity ?? { x: 0, y: 0 };
    this.size = config.size;
    this.life = config.life;
    this.initialLife = config.initialLife ?? config.life;
    this.gravity = config.gravity ?? 0.1;
  }

  /**
   * Update particle physics
   */
  update(): boolean {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += this.gravity;
    this.life--;
    return this.life > 0;
  }

  /**
   * Draw the particle
   */
  draw(ctx: CanvasRenderingContext2D, graphics: number): void {
    ctx.save();
    ctx.globalAlpha = this.life / this.initialLife;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x * graphics, this.y * graphics, this.size * graphics, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /**
   * Check if particle is alive
   */
  isAlive(): boolean {
    return this.life > 0;
  }

  /**
   * Get alpha value based on remaining life
   */
  getAlpha(): number {
    return this.life / this.initialLife;
  }
}
