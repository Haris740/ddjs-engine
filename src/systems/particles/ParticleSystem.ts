import { Particle, type ParticleConfig } from "./Particle.js";

export interface ExplosionData {
  x: number;
  y: number;
  color?: string;
  count?: number;
}

export interface ParticleSystemConfig {
  colors?: string[];
  maxParticles?: number;
}

export class ParticleSystem {
  particles: Particle[] = [];
  trailParticles: Particle[] = [];
  colors: string[];
  maxParticles: number;

  private ctx: CanvasRenderingContext2D;
  private graphics: number;

  constructor(ctx: CanvasRenderingContext2D, graphics: number, config: ParticleSystemConfig = {}) {
    this.ctx = ctx;
    this.graphics = graphics;
    this.colors = config.colors ?? [
      "#00ffff", // Cyan
      "#ff00ff", // Magenta
      "#ffff00", // Yellow
      "#00ff99", // Green
      "#ff0066", // Pink
    ];
    this.maxParticles = config.maxParticles ?? 1000;
  }

  /**
   * Create explosion particles
   */
  create(explosionData: ExplosionData): void {
    const count = explosionData.count ?? 30;

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;

      const color =
        explosionData.color ?? this.colors[Math.floor(Math.random() * this.colors.length)];

      const particle = new Particle({
        x: explosionData.x,
        y: explosionData.y,
        color: color,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
        },
        size: Math.random() * 5 + 2,
        life: 60,
        initialLife: 60,
        gravity: 0.1,
      });

      this.particles.push(particle);
    }
  }

  /**
   * Create trail particles (for following objects)
   */
  createTrail(posX: number, posY: number, color?: string): void {
    for (let i = 0; i < 3; i++) {
      if (this.trailParticles.length >= this.maxParticles / 2) break;

      const particle = new Particle({
        x: posX,
        y: posY + (Math.random() - 0.5) * 10,
        color: color ?? "#00ffff",
        size: Math.random() * 3 + 1,
        life: 20,
        initialLife: 20,
        gravity: 0,
      });

      this.trailParticles.push(particle);
    }
  }

  /**
   * Update all particles
   */
  update(): void {
    // Update explosion particles
    this.particles = this.particles.filter((p) => {
      return p.update();
    });

    // Update trail particles (they move backward)
    this.trailParticles = this.trailParticles.filter((p) => {
      p.x -= 3;
      p.life--;
      return p.life > 0;
    });
  }

  /**
   * Draw all particles
   */
  draw(): void {
    // Draw explosion particles
    this.particles.forEach((p) => {
      p.draw(this.ctx, this.graphics);
    });

    // Draw trail particles
    this.trailParticles.forEach((p) => {
      this.ctx.save();
      this.ctx.globalAlpha = p.getAlpha();
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(
        p.x * this.graphics,
        p.y * this.graphics,
        p.size * this.graphics,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
    this.trailParticles = [];
  }

  /**
   * Get total particle count
   */
  getParticleCount(): number {
    return this.particles.length + this.trailParticles.length;
  }

  /**
   * Add custom particle
   */
  addParticle(config: ParticleConfig): void {
    if (this.particles.length >= this.maxParticles) return;
    this.particles.push(new Particle(config));
  }
}
