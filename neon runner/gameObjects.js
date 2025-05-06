// Enhanced gameObjects.js - Game object classes with improved visuals
import { eqTriangle, rect, circle, ctx, graphics } from '../dd.js';

export class Player extends eqTriangle {
  constructor(options) {
    super({
      ...options,
      features: { draggable: false },
      restitution: 0.8,
    });
    this.glowColor = options.glowColor || "0,255,255"; // Ensure glowColor is initialized
    this.canDoubleJump = true;
    this.trailTimer = 0;
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.pulse = 0;
  }

  // Add special player methods
  doubleJump() {
    if (this.canDoubleJump) {
      this.velocity.y = this.jumpStrength * 0.7;
      this.canDoubleJump = false;
    }
  }

  // Add neon glow effect
  draw() {
    this.pulse = (this.pulse + 0.1) % (2 * Math.PI);
    const pulseIntensity = 10 + Math.sin(this.pulse) * 5;
    
    ctx.save();
    
    // Invincibility flicker effect
    if (this.isInvincible) {
      ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 50) * 0.4;
    }
    
    // Shadow for glow effect
    ctx.shadowColor = `rgba(${this.glowColor}, 0.8)`;
    ctx.shadowBlur = pulseIntensity;
    
    // Draw actual triangle
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.posX * graphics, (this.posY - this.height / 2) * graphics);
    ctx.lineTo((this.posX + this.length / 2) * graphics, (this.posY + this.height / 2) * graphics);
    ctx.lineTo((this.posX - this.length / 2) * graphics, (this.posY + this.height / 2) * graphics);
    ctx.closePath();
    ctx.fill();
    
    // Draw outline
    ctx.strokeStyle = `rgba(${this.glowColor}, 1)`;
    ctx.lineWidth = 2 * graphics;
    ctx.stroke();
    
    ctx.restore();
  }
  
  update() {
    // Apply gravity
    this.velocity.y += this.gravity;

    // Update position
    this.posY += this.velocity.y;

    // Update invincibility timer
    if (this.isInvincible) {
      this.invincibilityTimer--;
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
      }
    }

    this.draw();
  }
  
  makeInvincible(duration) {
    this.isInvincible = true;
    this.invincibilityTimer = duration;
  }
}

export class SpikeObstacle extends rect {
  constructor(options) {
    super({
      ...options,
      color: options.color || "#ff0066",
    });
    this.pulse = Math.random() * Math.PI; // Random starting phase
  }

  draw() {
    this.pulse = (this.pulse + 0.05) % (2 * Math.PI);
    const pulseIntensity = 10 + Math.sin(this.pulse) * 5;
    
    ctx.save();
    
    // Shadow for glow effect
    ctx.shadowColor = "rgba(255,0,102,0.8)";
    ctx.shadowBlur = pulseIntensity;
    
    // Draw rectangle base
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.posX * graphics, 
      this.posY * graphics, 
      this.width * graphics, 
      this.height * graphics
    );
    
    // Draw spikes on top
    ctx.beginPath();
    const spikeCount = Math.floor(this.width / 10);
    const spikeWidth = this.width / spikeCount;
    
    for (let i = 0; i < spikeCount; i++) {
      const spikeX = this.posX + i * spikeWidth;
      const spikeMiddle = spikeX + spikeWidth / 2;
      
      ctx.moveTo(spikeX * graphics, this.posY * graphics);
      ctx.lineTo(spikeMiddle * graphics, (this.posY - 10) * graphics);
      ctx.lineTo((spikeX + spikeWidth) * graphics, this.posY * graphics);
    }
    
    ctx.fillStyle = "#ff3399";
    ctx.fill();
    
    // Draw outline
    ctx.strokeStyle = "#ff99cc";
    ctx.lineWidth = 1 * graphics;
    ctx.strokeRect(
      this.posX * graphics, 
      this.posY * graphics, 
      this.width * graphics, 
      this.height * graphics
    );
    
    ctx.restore();
  }
}

export class Platform extends rect {
  constructor(options) {
    super({
      ...options,
      color: options.color || "#00ff55",
    });
    this.pulse = Math.random() * Math.PI; // Random starting phase
    this.gridLines = options.gridLines !== undefined ? options.gridLines : true;
  }
  
  draw() {
    this.pulse = (this.pulse + 0.03) % (2 * Math.PI);
    const pulseIntensity = 8 + Math.sin(this.pulse) * 3;
    
    ctx.save();
    
    // Shadow for glow effect
    ctx.shadowColor = "rgba(0,255,85,0.7)";
    ctx.shadowBlur = pulseIntensity;
    
    // Draw rectangle
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.posX * graphics, 
      this.posY * graphics, 
      this.width * graphics, 
      this.height * graphics
    );
    
    // Draw top edge highlight
    ctx.beginPath();
    ctx.moveTo(this.posX * graphics, this.posY * graphics);
    ctx.lineTo((this.posX + this.width) * graphics, this.posY * graphics);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2 * graphics;
    ctx.stroke();
    
    // Draw grid lines (cyberpunk effect)
    if (this.gridLines) {
      ctx.strokeStyle = "rgba(0,255,85,0.5)";
      ctx.lineWidth = 1 * graphics;
      
      const gridSize = 20 * graphics;
      
      // Vertical lines
      for (let x = 0; x < this.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo((this.posX + x) * graphics, this.posY * graphics);
        ctx.lineTo((this.posX + x) * graphics, (this.posY + this.height) * graphics);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < this.height; y += 5) {
        ctx.beginPath();
        ctx.moveTo(this.posX * graphics, (this.posY + y) * graphics);
        ctx.lineTo((this.posX + this.width) * graphics, (this.posY + y) * graphics);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }
}

// New class for collectible items
export class PowerupItem extends circle {
  constructor(options) {
    super({
      ...options,
      radius: options.radius || 15,
      color: options.color || "#ffff00", // Default yellow
    });
    this.type = options.type || "points"; // points, invincibility, slowTime
    this.pulse = Math.random() * Math.PI;
    this.floatOffset = 0;
    this.collected = false;
    this.value = options.value || 100;
  }
  
  draw() {
    if (this.collected) return;
    
    this.pulse = (this.pulse + 0.1) % (2 * Math.PI);
    const pulseIntensity = 15 + Math.sin(this.pulse) * 5;
    this.floatOffset = Math.sin(this.pulse) * 3;
    
    ctx.save();
    
    // Shadow for glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = pulseIntensity;
    
    // Draw circle
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.posX * graphics, 
      (this.posY + this.floatOffset) * graphics, 
      this.radius * graphics, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw inner circle
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(
      this.posX * graphics, 
      (this.posY + this.floatOffset) * graphics, 
      (this.radius * 0.6) * graphics, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw icon based on type
    ctx.fillStyle = this.color;
    if (this.type === "points") {
      // Draw star shape
      const starRadius = this.radius * 0.4;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
        const x = this.posX + Math.cos(angle) * starRadius;
        const y = (this.posY + this.floatOffset) + Math.sin(angle) * starRadius;
        if (i === 0) {
          ctx.moveTo(x * graphics, y * graphics);
        } else {
          ctx.lineTo(x * graphics, y * graphics);
        }
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.type === "invincibility") {
      // Draw shield icon
      ctx.beginPath();
      ctx.arc(
        this.posX * graphics, 
        (this.posY + this.floatOffset) * graphics, 
        (this.radius * 0.4) * graphics, 
        Math.PI * 0.8, 
        Math.PI * 2.2
      );
      ctx.lineWidth = 2 * graphics;
      ctx.stroke();
    } else if (this.type === "slowTime") {
      // Draw clock icon
      ctx.beginPath();
      ctx.arc(
        this.posX * graphics, 
        (this.posY + this.floatOffset) * graphics, 
        (this.radius * 0.3) * graphics, 
        0, 
        Math.PI * 2
      );
      ctx.stroke();
      
      // Clock hands
      ctx.beginPath();
      ctx.moveTo(this.posX * graphics, (this.posY + this.floatOffset) * graphics);
      ctx.lineTo(
        (this.posX + this.radius * 0.2) * graphics, 
        (this.posY + this.floatOffset) * graphics
      );
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(this.posX * graphics, (this.posY + this.floatOffset) * graphics);
      ctx.lineTo(
        this.posX * graphics, 
        (this.posY + this.floatOffset - this.radius * 0.15) * graphics
      );
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  update() {
    if (this.collected) return;
    this.draw();
  }
  
  collect() {
    this.collected = true;
    return this.value;
  }
}