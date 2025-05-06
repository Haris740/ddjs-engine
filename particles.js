// Enhanced particles.js - Particle system for visual effects
import { ctx, graphics } from './core.js';

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.trailParticles = [];
    this.colors = [
      "#00ffff", // Cyan
      "#ff00ff", // Magenta
      "#ffff00", // Yellow
      "#00ff99", // Green
      "#ff0066", // Pink
    ];
  }

  create(explosionData) {
    // Create neon-colored particles
    for (let i = 0; i < 30; i++) {
      const color = explosionData.color || this.colors[Math.floor(Math.random() * this.colors.length)];
      
      this.particles.push({
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
      });
    }
  }

  // Add player trail particles
  createTrail(posX, posY, color) {
    for (let i = 0; i < 3; i++) {
      this.trailParticles.push({
        x: posX,
        y: posY + (Math.random() - 0.5) * 10,
        color: color || "#00ffff",
        size: Math.random() * 3 + 1,
        life: 20,
        initialLife: 20,
      });
    }
  }

  update() {
    // Update explosion particles
    this.particles = this.particles.filter((p) => {
      p.x += p.velocity.x;
      p.y += p.velocity.y;
      p.velocity.y += 0.1; // Add gravity
      p.life--;
      return p.life > 0;
    });

    // Update trail particles
    this.trailParticles = this.trailParticles.filter((p) => {
      p.x -= 3; // Trail moves backward
      p.life--;
      return p.life > 0;
    });
  }

  draw() {
    // Draw explosion particles with glow
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.life / p.initialLife;
      ctx.fillStyle = p.color;
      
      // Add glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = p.color;
      
      ctx.beginPath();
      ctx.arc(
        p.x * graphics, 
        p.y * graphics, 
        p.size * graphics, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      
      ctx.restore();
    });

    // Draw trail particles with glow
    this.trailParticles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.life / p.initialLife;
      ctx.fillStyle = p.color;
      
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      
      ctx.beginPath();
      ctx.arc(
        p.x * graphics, 
        p.y * graphics, 
        p.size * graphics, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      
      ctx.restore();
    });
  }
}