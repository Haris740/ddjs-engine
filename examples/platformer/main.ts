import {
  DDJSEngine,
  Rect,
  Circle,
  InputManager,
  Physics,
  Collision,
  Camera,
  ParticleSystem,
  MathUtils,
  type CollisionRect,
} from "../../src/index.js";

// Create engine
const engine = new DDJSEngine({
  width: 800,
  height: 600,
  graphics: 1,
  existingCanvas: "gameCanvas",
});
engine.init();

const ctx = engine.getContext();
const canvas = engine.getCanvasElement();

// Setup systems
const input = new InputManager({ canvas });
const physics = new Physics({ gravity: 0.8 });
let camera: Camera;
const particleSystem = new ParticleSystem(ctx, 1);

// Game state
let score = 0;
let gameOver = false;
let levelComplete = false;
let lives = 3;
let currentLevel = 1;
const totalLevels = 3;

// Level data structure
interface LevelData {
  width: number;
  platforms: CollisionRect[];
  blocks: { x: number; y: number; hits: number }[];
  coins: { x: number; y: number }[];
  enemies: { x: number; y: number; patrol: number }[];
  goalX: number;
}

// Define levels
const levels: LevelData[] = [
  // Level 1 - Tutorial
  {
    width: 2400,
    platforms: [
      { posX: 0, posY: 550, width: 300, height: 50 },
      { posX: 450, posY: 550, width: 350, height: 50 },
      { posX: 950, posY: 550, width: 350, height: 50 },
      { posX: 1450, posY: 550, width: 350, height: 50 },
      { posX: 2000, posY: 550, width: 400, height: 50 },
      { posX: 200, posY: 450, width: 150, height: 20 },
      { posX: 450, posY: 380, width: 150, height: 20 },
      { posX: 700, posY: 320, width: 150, height: 20 },
      { posX: 950, posY: 400, width: 150, height: 20 },
      { posX: 1200, posY: 350, width: 150, height: 20 },
      { posX: 1450, posY: 420, width: 150, height: 20 },
      { posX: 1700, posY: 300, width: 150, height: 20 },
      { posX: 1950, posY: 380, width: 150, height: 20 },
    ],
    blocks: [
      { x: 250, y: 250, hits: 1 },
      { x: 290, y: 250, hits: 1 },
      { x: 500, y: 250, hits: 2 },
      { x: 700, y: 430, hits: 1 },
      { x: 1000, y: 270, hits: 2 },
      { x: 1480, y: 250, hits: 1 },
      { x: 1480, y: 250, hits: 1 },
      { x: 2000, y: 270, hits: 2 },
    ],
    coins: [
      { x: 300, y: 400 },
      { x: 520, y: 330 },
      { x: 775, y: 270 },
      { x: 1025, y: 350 },
      { x: 1275, y: 300 },
      { x: 1525, y: 370 },
      { x: 1775, y: 250 },
      { x: 2025, y: 330 },
      { x: 2200, y: 500 },
    ],
    enemies: [
      { x: 600, y: 520, patrol: 100 },
      { x: 1100, y: 520, patrol: 150 },
      { x: 1625, y: 520, patrol: 120 },
    ],
    goalX: 2300,
  },
  // Level 2 - Intermediate
  {
    width: 3200,
    platforms: [
      { posX: 0, posY: 550, width: 250, height: 50 },
      { posX: 400, posY: 550, width: 200, height: 50 },
      { posX: 750, posY: 550, width: 250, height: 50 },
      { posX: 1150, posY: 550, width: 200, height: 50 },
      { posX: 1500, posY: 550, width: 300, height: 50 },
      { posX: 2000, posY: 550, width: 200, height: 50 },
      { posX: 2400, posY: 550, width: 250, height: 50 },
      { posX: 2850, posY: 550, width: 350, height: 50 },
      { posX: 150, posY: 450, width: 120, height: 20 },
      { posX: 400, posY: 380, width: 100, height: 20 },
      { posX: 650, posY: 320, width: 120, height: 20 },
      { posX: 900, posY: 280, width: 100, height: 20 },
      { posX: 1150, posY: 350, width: 150, height: 20 },
      { posX: 1450, posY: 280, width: 120, height: 20 },
      { posX: 1750, posY: 350, width: 100, height: 20 },
      { posX: 2050, posY: 280, width: 150, height: 20 },
      { posX: 2350, posY: 380, width: 120, height: 20 },
      { posX: 2650, posY: 320, width: 100, height: 20 },
    ],
    blocks: [
      { x: 300, y: 330, hits: 2 },
      { x: 550, y: 270, hits: 1 },
      { x: 800, y: 230, hits: 3 },
      { x: 1100, y: 300, hits: 1 },
      { x: 1400, y: 230, hits: 2 },
      { x: 1900, y: 300, hits: 1 },
      { x: 2300, y: 330, hits: 2 },
    ],
    coins: [
      { x: 200, y: 400 },
      { x: 450, y: 330 },
      { x: 700, y: 270 },
      { x: 950, y: 230 },
      { x: 1200, y: 300 },
      { x: 1500, y: 230 },
      { x: 1800, y: 300 },
      { x: 2100, y: 230 },
      { x: 2400, y: 330 },
      { x: 2700, y: 270 },
      { x: 3000, y: 500 },
    ],
    enemies: [
      { x: 500, y: 520, patrol: 120 },
      { x: 900, y: 520, patrol: 100 },
      { x: 1300, y: 520, patrol: 150 },
      { x: 1800, y: 520, patrol: 100 },
      { x: 2550, y: 520, patrol: 120 },
    ],
    goalX: 3100,
  },
  // Level 3 - Advanced
  {
    width: 4000,
    platforms: [
      { posX: 0, posY: 550, width: 200, height: 50 },
      { posX: 350, posY: 550, width: 150, height: 50 },
      { posX: 650, posY: 550, width: 200, height: 50 },
      { posX: 1000, posY: 550, width: 150, height: 50 },
      { posX: 1300, posY: 550, width: 200, height: 50 },
      { posX: 1650, posY: 550, width: 150, height: 50 },
      { posX: 1950, posY: 550, width: 250, height: 50 },
      { posX: 2400, posY: 550, width: 150, height: 50 },
      { posX: 2700, posY: 550, width: 200, height: 50 },
      { posX: 3100, posY: 550, width: 150, height: 50 },
      { posX: 3450, posY: 550, width: 250, height: 50 },
      { posX: 3800, posY: 550, width: 200, height: 50 },
      { posX: 100, posY: 450, width: 100, height: 20 },
      { posX: 300, posY: 380, width: 100, height: 20 },
      { posX: 550, posY: 320, width: 100, height: 20 },
      { posX: 800, posY: 260, width: 100, height: 20 },
      { posX: 1050, posY: 200, width: 100, height: 20 },
      { posX: 1300, posY: 320, width: 120, height: 20 },
      { posX: 1600, posY: 260, width: 100, height: 20 },
      { posX: 1900, posY: 200, width: 120, height: 20 },
      { posX: 2200, posY: 320, width: 100, height: 20 },
      { posX: 2500, posY: 260, width: 100, height: 20 },
      { posX: 2850, posY: 320, width: 120, height: 20 },
      { posX: 3150, posY: 380, width: 100, height: 20 },
      { posX: 3450, posY: 320, width: 100, height: 20 },
    ],
    blocks: [
      { x: 250, y: 330, hits: 2 },
      { x: 500, y: 270, hits: 3 },
      { x: 750, y: 210, hits: 2 },
      { x: 1000, y: 150, hits: 3 },
      { x: 1550, y: 210, hits: 2 },
      { x: 1850, y: 150, hits: 3 },
      { x: 2450, y: 210, hits: 2 },
      { x: 3100, y: 330, hits: 3 },
      { x: 3400, y: 270, hits: 2 },
    ],
    coins: [
      { x: 150, y: 400 },
      { x: 350, y: 330 },
      { x: 600, y: 270 },
      { x: 850, y: 210 },
      { x: 1100, y: 150 },
      { x: 1350, y: 270 },
      { x: 1650, y: 210 },
      { x: 1950, y: 150 },
      { x: 2250, y: 270 },
      { x: 2550, y: 210 },
      { x: 2900, y: 270 },
      { x: 3200, y: 330 },
      { x: 3500, y: 270 },
      { x: 3850, y: 500 },
    ],
    enemies: [
      { x: 450, y: 520, patrol: 80 },
      { x: 750, y: 520, patrol: 100 },
      { x: 1150, y: 520, patrol: 80 },
      { x: 1500, y: 520, patrol: 120 },
      { x: 2100, y: 520, patrol: 100 },
      { x: 2600, y: 520, patrol: 80 },
      { x: 2950, y: 520, patrol: 100 },
      { x: 3300, y: 520, patrol: 120 },
    ],
    goalX: 3900,
  },
];

// Current level arrays
let platforms: CollisionRect[] = [];
let breakableBlocks: BreakableBlock[] = [];
let coins: Coin[] = [];
let enemies: Enemy[] = [];
let goal: Goal;

// Breakable Block
class BreakableBlock {
  posX: number;
  posY: number;
  width: number = 40;
  height: number = 40;
  broken: boolean = false;
  hitCount: number = 0;
  maxHits: number;
  color: string;

  constructor(x: number, y: number, maxHits: number = 1) {
    this.posX = x;
    this.posY = y;
    this.maxHits = maxHits;
    this.color = maxHits === 1 ? "#d35400" : maxHits === 2 ? "#c0392b" : "#8e44ad";
  }

  hit(): void {
    this.hitCount++;
    if (this.hitCount >= this.maxHits) {
      this.broken = true;
      score += 5;
      updateScoreDisplay();

      particleSystem.create({
        x: this.posX + this.width / 2,
        y: this.posY + this.height / 2,
        count: 20,
        color: this.color,
      });
    }
  }

  draw(): void {
    if (this.broken) return;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.posX, this.posY, this.width, this.height);

    ctx.strokeStyle = "#e67e22";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.posX + 2, this.posY + 2, this.width - 4, this.height - 4);

    if (this.maxHits > 1) {
      ctx.fillStyle = "#f39c12";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        String(this.maxHits - this.hitCount),
        this.posX + this.width / 2,
        this.posY + this.height / 2
      );
    }

    if (this.hitCount > 0) {
      ctx.strokeStyle = "#2c3e50";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.posX + 5, this.posY + 5);
      ctx.lineTo(this.posX + this.width - 5, this.posY + this.height - 5);
      ctx.stroke();
    }
  }

  getCollisionRect(): CollisionRect {
    return {
      posX: this.posX,
      posY: this.posY,
      width: this.width,
      height: this.height,
    };
  }
}

// Goal Flag
class Goal {
  x: number;
  y: number = 400;
  width: number = 60;
  height: number = 150;
  reached: boolean = false;
  animationTime: number = 0;

  constructor(x: number) {
    this.x = x;
  }

  checkReached(player: Player): boolean {
    if (this.reached) return false;

    const colliding =
      player.shape.posX < this.x + this.width &&
      player.shape.posX + player.shape.width > this.x &&
      player.shape.posY < this.y + this.height &&
      player.shape.posY + player.shape.height > this.y;

    if (colliding) {
      this.reached = true;
      return true;
    }
    return false;
  }

  update(): void {
    if (this.reached) {
      this.animationTime++;
    }
  }

  draw(): void {
    ctx.save();

    // Flag pole
    ctx.fillStyle = "#7f8c8d";
    ctx.fillRect(this.x + 25, this.y, 10, this.height);

    // Flag
    const wave = Math.sin(Date.now() / 200) * 5;
    ctx.fillStyle = this.reached ? "#2ecc71" : "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(this.x + 35, this.y + 10);
    ctx.lineTo(this.x + 35 + 40 + wave, this.y + 30);
    ctx.lineTo(this.x + 35, this.y + 50);
    ctx.closePath();
    ctx.fill();

    // Checkered pattern on flag
    if (!this.reached) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x + 40, this.y + 15, 8, 8);
      ctx.fillRect(this.x + 56 + wave / 2, this.y + 15, 8, 8);
      ctx.fillRect(this.x + 48 + wave / 4, this.y + 32, 8, 8);
    }

    ctx.restore();
  }
}

// Player
class Player {
  shape: Rect;
  speed: number = 5;
  jumpPower: number = -15;
  isOnGround: boolean = false;
  doubleJumpAvailable: boolean = true;
  invincible: boolean = false;
  invincibleTimer: number = 0;

  constructor(x: number, y: number) {
    this.shape = new Rect(
      {
        posX: x,
        posY: y,
        width: 40,
        height: 60,
        color: "#3498db",
        gravity: 0.8,
        restitution: 0,
        mass: 1,
      },
      ctx,
      1,
      600
    );
  }

  update(): void {
    if (levelComplete) return;

    if (input.isKeyDown("ArrowLeft") || input.isKeyDown("a")) {
      this.shape.posX -= this.speed;
    }
    if (input.isKeyDown("ArrowRight") || input.isKeyDown("d")) {
      this.shape.posX += this.speed;
    }

    this.shape.velocity.y += this.shape.gravity;
    this.shape.posY += this.shape.velocity.y;

    if (this.shape.posY > 650) {
      this.die();
      return;
    }

    this.isOnGround = false;

    platforms.forEach((platform) => {
      if (this.checkPlatformCollision(platform)) {
        if (this.shape.velocity.y > 0) {
          const playerBottom = this.shape.posY + this.shape.height;
          const platformTop = platform.posY;

          if (playerBottom - this.shape.velocity.y <= platformTop + 5) {
            this.shape.posY = platformTop - this.shape.height;
            this.shape.velocity.y = 0;
            this.isOnGround = true;
            this.doubleJumpAvailable = true;
          }
        }
      }
    });

    breakableBlocks.forEach((block) => {
      if (!block.broken && this.checkPlatformCollision(block.getCollisionRect())) {
        const playerBottom = this.shape.posY + this.shape.height;
        const playerTop = this.shape.posY;
        const blockTop = block.posY;
        const blockBottom = block.posY + block.height;

        if (this.shape.velocity.y > 0 && playerBottom - this.shape.velocity.y <= blockTop + 5) {
          this.shape.posY = blockTop - this.shape.height;
          this.shape.velocity.y = 0;
          this.isOnGround = true;
          this.doubleJumpAvailable = true;
        } else if (this.shape.velocity.y < 0 && playerTop <= blockBottom) {
          this.shape.velocity.y = 0;
          this.shape.posY = blockBottom;
          block.hit();
        }
      }
    });

    const levelWidth = levels[currentLevel - 1].width;
    this.shape.posX = Math.max(0, Math.min(this.shape.posX, levelWidth - this.shape.width));

    camera.setTarget({ posX: this.shape.posX + this.shape.width / 2 });
    camera.update();

    if (this.invincible) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }
  }

  jump(): void {
    if (levelComplete) return;

    if (this.isOnGround) {
      this.shape.velocity.y = this.jumpPower;
      this.isOnGround = false;
      particleSystem.create({
        x: this.shape.posX + this.shape.width / 2,
        y: this.shape.posY + this.shape.height,
        count: 10,
        color: "#95a5a6",
      });
    } else if (this.doubleJumpAvailable) {
      this.shape.velocity.y = this.jumpPower;
      this.doubleJumpAvailable = false;
      particleSystem.create({
        x: this.shape.posX + this.shape.width / 2,
        y: this.shape.posY + this.shape.height / 2,
        count: 15,
        color: "#3498db",
      });
    }
  }

  checkPlatformCollision(platform: CollisionRect): boolean {
    return (
      this.shape.posX < platform.posX + platform.width &&
      this.shape.posX + this.shape.width > platform.posX &&
      this.shape.posY < platform.posY + platform.height &&
      this.shape.posY + this.shape.height > platform.posY
    );
  }

  die(): void {
    lives--;
    updateLivesDisplay();

    particleSystem.create({
      x: this.shape.posX + this.shape.width / 2,
      y: this.shape.posY + this.shape.height / 2,
      count: 50,
      color: "#3498db",
    });

    if (lives <= 0) {
      gameOver = true;
    } else {
      this.shape.posX = 50;
      this.shape.posY = 400;
      this.shape.velocity.y = 0;
      this.invincible = true;
      this.invincibleTimer = 120;
    }
  }

  takeDamage(): void {
    if (this.invincible) return;
    this.die();
  }

  draw(): void {
    if (this.invincible && Math.floor(this.invincibleTimer / 10) % 2 === 0) {
      return;
    }

    this.shape.draw();

    ctx.fillStyle = "white";
    ctx.fillRect((this.shape.posX + 10) * 1, (this.shape.posY + 15) * 1, 8, 8);
    ctx.fillRect((this.shape.posX + 22) * 1, (this.shape.posY + 15) * 1, 8, 8);
    ctx.fillStyle = "black";
    ctx.fillRect((this.shape.posX + 12) * 1, (this.shape.posY + 17) * 1, 4, 4);
    ctx.fillRect((this.shape.posX + 24) * 1, (this.shape.posY + 17) * 1, 4, 4);
  }
}

// Coin
class Coin {
  x: number;
  y: number;
  radius: number = 15;
  collected: boolean = false;
  rotation: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(): void {
    this.rotation += 0.1;
  }

  draw(): void {
    if (this.collected) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = "#f39c12";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e67e22";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius - 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  checkCollision(player: Player): boolean {
    const distance = Math.sqrt(
      Math.pow(this.x - (player.shape.posX + player.shape.width / 2), 2) +
        Math.pow(this.y - (player.shape.posY + player.shape.height / 2), 2)
    );
    return distance < this.radius + 20;
  }
}

// Enemy
class Enemy {
  shape: Circle;
  direction: number = 1;
  speed: number = 2;
  patrolStart: number;
  patrolEnd: number;
  dead: boolean = false;

  constructor(x: number, y: number, patrolDistance: number = 150) {
    this.shape = new Circle(
      {
        posX: x,
        posY: y,
        radius: 25,
        color: "#e74c3c",
        features: {
          gravity: 0,
        },
      },
      ctx,
      1,
      600
    );
    this.patrolStart = x - patrolDistance;
    this.patrolEnd = x + patrolDistance;
  }

  update(): void {
    if (this.dead) return;

    this.shape.posX += this.speed * this.direction;

    if (this.shape.posX <= this.patrolStart || this.shape.posX >= this.patrolEnd) {
      this.direction *= -1;
    }
  }

  draw(): void {
    if (this.dead) return;

    this.shape.draw();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc((this.shape.posX - 8) * 1, (this.shape.posY - 5) * 1, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((this.shape.posX + 8) * 1, (this.shape.posY - 5) * 1, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc((this.shape.posX - 8) * 1, (this.shape.posY - 5) * 1, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((this.shape.posX + 8) * 1, (this.shape.posY - 5) * 1, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  checkCollision(player: Player): "stomp" | "damage" | null {
    if (this.dead) return null;

    const colliding = Collision.circleToRect(
      { x: this.shape.posX, y: this.shape.posY, radius: this.shape.radius },
      {
        posX: player.shape.posX,
        posY: player.shape.posY,
        width: player.shape.width,
        height: player.shape.height,
      }
    );

    if (!colliding) return null;

    const playerBottom = player.shape.posY + player.shape.height;

    if (player.shape.velocity.y > 0 && playerBottom < this.shape.posY) {
      return "stomp";
    }

    return "damage";
  }

  kill(): void {
    this.dead = true;
    score += 25;
    updateScoreDisplay();

    particleSystem.create({
      x: this.shape.posX,
      y: this.shape.posY,
      count: 30,
      color: "#e74c3c",
    });
  }
}

// Load level function
function loadLevel(levelNum: number): void {
  const level = levels[levelNum - 1];

  // Update camera
  camera = new Camera(800, 600, 1, {
    smoothFactor: 0.1,
    levelWidth: level.width,
  });

  // Load platforms
  platforms = level.platforms;

  // Load blocks
  breakableBlocks = level.blocks.map((b) => new BreakableBlock(b.x, b.y, b.hits));

  // Load coins
  coins = level.coins.map((c) => new Coin(c.x, c.y));

  // Load enemies
  enemies = level.enemies.map((e) => new Enemy(e.x, e.y, e.patrol));

  // Create goal
  goal = new Goal(level.goalX);

  levelComplete = false;
}

// Initialize first level
let player: Player;
loadLevel(1);
player = new Player(50, 400);

// Input handlers
input.onKeyDown(" ", () => player.jump());
input.onKeyDown("w", () => player.jump());
input.onKeyDown("ArrowUp", () => player.jump());

// Draw background
function drawBackground(): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, "#87CEEB");
  gradient.addColorStop(1, "#E0F6FF");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, levels[currentLevel - 1].width, 600);

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  for (let i = 0; i < 15; i++) {
    const x = i * 300 + 50;
    const y = 80 + Math.sin(i) * 30;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 40, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Draw platforms
function drawPlatforms(): void {
  platforms.forEach((platform) => {
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(platform.posX, platform.posY, platform.width, platform.height);

    ctx.fillStyle = "#34495e";
    ctx.fillRect(platform.posX, platform.posY, platform.width, 5);
  });
}

// Victory celebration
let celebrationTimer = 0;
function drawVictoryCelebration(): void {
  celebrationTimer++;

  // Continuous fireworks
  if (celebrationTimer % 20 === 0) {
    for (let i = 0; i < 3; i++) {
      particleSystem.create({
        x: MathUtils.random(100, 700),
        y: MathUtils.random(100, 300),
        count: 50,
        color: ["#f39c12", "#e74c3c", "#9b59b6", "#3498db", "#2ecc71"][
          Math.floor(Math.random() * 5)
        ],
      });
    }
  }

  // Victory text
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, 800, 600);

  ctx.fillStyle = "#2ecc71";
  ctx.font = "bold 60px Arial";
  ctx.textAlign = "center";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#2ecc71";

  if (currentLevel < totalLevels) {
    ctx.fillText("LEVEL COMPLETE!", 400, 250);
    ctx.font = "30px Arial";
    ctx.shadowBlur = 10;
    ctx.fillText(`Score: ${score}`, 400, 320);
    ctx.fillText("Press SPACE for next level", 400, 370);
  } else {
    ctx.fillText("🎉 YOU WIN! 🎉", 400, 230);
    ctx.font = "40px Arial";
    ctx.fillText(`Final Score: ${score}`, 400, 300);
    ctx.font = "24px Arial";
    ctx.fillText("Congratulations!", 400, 350);
    ctx.fillText("You completed all levels!", 400, 385);
  }

  ctx.shadowBlur = 0;
}

// Update score display
function updateScoreDisplay(): void {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = score.toString();
  }
}

// Update lives display
function updateLivesDisplay(): void {
  const livesElement = document.getElementById("lives");
  if (livesElement) {
    livesElement.textContent = `Lives: ${lives}`;
  }
}

// Initialize
updateLivesDisplay();

// Game loop
engine.start((deltaTime) => {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", 400, 300);
    ctx.font = "24px Arial";
    ctx.fillText(`Final Score: ${score}`, 400, 350);
    ctx.fillText("Refresh to play again", 400, 400);
    return;
  }

  camera.apply(ctx);

  drawBackground();
  drawPlatforms();

  breakableBlocks.forEach((block) => block.draw());

  coins.forEach((coin) => {
    coin.update();
    coin.draw();

    if (!coin.collected && coin.checkCollision(player)) {
      coin.collected = true;
      score += 10;
      updateScoreDisplay();
      particleSystem.create({
        x: coin.x,
        y: coin.y,
        count: 20,
        color: "#f39c12",
      });
    }
  });

  enemies.forEach((enemy) => {
    enemy.update();
    enemy.draw();

    const collision = enemy.checkCollision(player);
    if (collision === "stomp") {
      enemy.kill();
      player.shape.velocity.y = -10;
    } else if (collision === "damage") {
      player.takeDamage();
    }
  });

  player.update();
  player.draw();

  // Check goal
  if (goal.checkReached(player)) {
    levelComplete = true;
    score += 100; // Bonus for completing level
    updateScoreDisplay();

    // Massive celebration
    for (let i = 0; i < 10; i++) {
      particleSystem.create({
        x: goal.x + goal.width / 2,
        y: goal.y + goal.height / 2,
        count: 30,
        color: ["#2ecc71", "#f39c12", "#3498db"][i % 3],
      });
    }
  }

  goal.update();
  goal.draw();

  particleSystem.update();
  particleSystem.draw();

  camera.reset(ctx);

  // Draw UI
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Level: ${currentLevel}/${totalLevels}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, 10, 55);
  ctx.fillText(`Score: ${score}`, 10, 80);

  // Victory celebration overlay
  if (levelComplete) {
    drawVictoryCelebration();

    // Handle level progression
    if (input.isKeyDown(" ") && currentLevel < totalLevels) {
      currentLevel++;
      loadLevel(currentLevel);
      player = new Player(50, 400);
      celebrationTimer = 0;
    }
  }
});
