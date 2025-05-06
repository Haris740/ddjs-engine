// NeonRunner.js - Main game file for the neon runner game
import { Player, SpikeObstacle, Platform, PowerupItem } from "./gameObjects.js";
import {
  setupCanvas,
  clearCanvas,
  startGameLoop,
  setGameState,
  loadImage,
  drawText,
  ctx,
  canvas,
  graphics,
  cW,
  cH,
  ParticleSystem,
  Camera,
} from "../dd.js";

// Game variables
let player;
let obstacles = [];
let platforms = [];
let powerups = [];
let particles;
let camera;
let score = 0;
let highScore = localStorage.getItem("neonRunnerHighScore") || 0;
let gameSpeed = 300; // pixels per second
let obstacleSpawnTimer = 0;
let powerupSpawnTimer = 0;
let distanceTraveled = 0;
let gameState = "menu"; // menu, playing, gameOver
let levelWidth = 50000; // Very long level for endless runner
let slowMotionActive = false;
let slowMotionTimer = 0;
let comboMultiplier = 1;
let comboTimer = 0;
const MAX_COMBO = 5;
const COMBO_DURATION = 3; // seconds
const SLOW_MOTION_DURATION = 5; // seconds

// Initialize game
async function init() {
  // Set up canvas
  setupCanvas(1000, 600, 1, "#000011");

  // Initialize game objects
  player = new Player({
    posX: 100,
    posY: cH / graphics - 100,
    length: 30,
    color: "#00ffff",
    glowColor: "0,255,255",
    gravity: 0.5,
    jumpStrength: -10,
  });

  // Initialize particle system
  particles = new ParticleSystem();

  // Initialize camera
  camera = new Camera();
  camera.setTarget(player);
  camera.setLevelWidth(levelWidth);

  // Create initial platform (ground)
  createGround();

  // Add event listeners
  setupEventListeners();

  // Start in menu state
  setGameState("menu");
  renderMenu();

  // Start game loop
  startGameLoop(update, 60);
}

// Set up event listeners
function setupEventListeners() {
  // Jump on spacebar or tap/click
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (gameState === "playing") {
        if (player.isGrounded) {
          player.velocity.y = player.jumpStrength;
          player.isGrounded = false;
        } else if (player.canDoubleJump) {
          // Allow double jump if enabled
          player.doubleJump();
        }
      } else if (gameState === "menu" || gameState === "gameOver") {
        startGame();
      }
    }

    // Activate slow motion with Shift key
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
      if (gameState === "playing" && !slowMotionActive) {
        activateSlowMotion();
      }
    }
  });

  canvas.addEventListener("click", () => {
    if (gameState === "playing") {
      if (player.isGrounded) {
        player.velocity.y = player.jumpStrength;
        player.isGrounded = false;
      } else if (player.canDoubleJump) {
        // Allow double jump if enabled
        player.doubleJump();
      }
    } else if (gameState === "menu" || gameState === "gameOver") {
      startGame();
    }
  });
}

// Activate slow motion effect
function activateSlowMotion() {
  if (slowMotionActive) return;

  slowMotionActive = true;
  slowMotionTimer = SLOW_MOTION_DURATION;

  // Create slow motion effect particles
  particles.create({
    x: player.posX,
    y: player.posY,
    color: "#0088ff",
    count: 30,
    speedMultiplier: 0.5,
    duration: 2,
  });
}

// Start the game
function startGame() {
  // Reset game variables
  obstacles = [];
  powerups = [];
  score = 0;
  gameSpeed = 300;
  distanceTraveled = 0;
  obstacleSpawnTimer = 0;
  powerupSpawnTimer = 0;
  slowMotionActive = false;
  slowMotionTimer = 0;
  comboMultiplier = 1;
  comboTimer = 0;

  // Reset player position and state
  player.posX = 100;
  player.posY = cH / graphics - 100;
  player.velocity = { x: 0, y: 0 };
  player.isGrounded = true;
  player.canDoubleJump = true;

  // Create initial platform
  createGround();

  // Set game state to playing
  setGameState("playing");
  gameState = "playing";
}

// Create ground platform
function createGround() {
  platforms = [];

  // Create ground segments
  for (let i = 0; i < 20; i++) {
    platforms.push(
      new Platform({
        posX: i * 800,
        posY: cH / graphics - 20,
        width: 800,
        height: 20,
        color: "#00ff55",
      })
    );
  }
}

// Create a new obstacle
function createObstacle() {
  const height = Math.random() * 50 + 20;

  obstacles.push(
    new SpikeObstacle({
      posX: player.posX + cW / graphics + Math.random() * 200,
      posY: cH / graphics - 20 - height,
      width: 30,
      height: height,
      color: "#ff0066",
    })
  );
}

// Create a new powerup
function createPowerup() {
  // Randomly select powerup type
  const types = ["slowmo", "combo", "shield"];
  const type = types[Math.floor(Math.random() * types.length)];

  powerups.push(
    new PowerupItem({
      posX: player.posX + cW / graphics + Math.random() * 500,
      posY: Math.random() * (cH / graphics - 100) + 50, // Random height
      width: 25,
      height: 25,
      type: type,
      color:
        type === "slowmo"
          ? "#0088ff"
          : type === "combo"
          ? "#ffcc00"
          : "#00ffaa",
    })
  );
}

// Update combo system
function updateCombo(deltaTime) {
  if (comboTimer > 0) {
    comboTimer -= deltaTime;

    // Reset combo if timer expires
    if (comboTimer <= 0) {
      comboMultiplier = 1;
    }
  }
}

// Increase combo multiplier
function increaseCombo() {
  comboMultiplier = Math.min(comboMultiplier + 1, MAX_COMBO);
  comboTimer = COMBO_DURATION;

  // Create combo effect particles
  particles.create({
    x: player.posX,
    y: player.posY - 30,
    color: "#ffcc00",
    count: 10,
    speedMultiplier: 1,
    duration: 1,
  });
}

// Main update function
function update(deltaTime) {
  // Apply slow motion effect if active
  if (slowMotionActive) {
    deltaTime *= 0.4; // 40% normal speed
    slowMotionTimer -= deltaTime * 2.5; // Countdown timer at normal rate

    if (slowMotionTimer <= 0) {
      slowMotionActive = false;
    }
  }

  // Handle different game states
  if (gameState === "menu") {
    renderMenu();
    return;
  } else if (gameState === "gameOver") {
    renderGameOver();
    return;
  }

  // Clear the canvas
  clearCanvas();

  // Update camera position
  camera.update();

  // Move player forward automatically (THIS IS CAUSING THE ISSUE)
  // We need to update the velocity instead of directly changing position
  // player.posX += gameSpeed * deltaTime; <-- REMOVING THIS LINE

  // Instead, set player's x velocity
  player.velocity.x = gameSpeed * deltaTime;

  // Now update the player's position based on velocity
  player.posX += player.velocity.x;

  // Track distance for score
  distanceTraveled = player.posX;

  // Update player physics (only vertical movement)
  // Apply gravity and update Y position
  player.velocity.y += player.gravity;
  player.posY += player.velocity.y;

  // Update player's other properties
  if (player.isInvincible) {
    player.invincibilityTimer--;
    if (player.invincibilityTimer <= 0) {
      player.isInvincible = false;
    }
  }

  // Skip calling player.update() since we've manually updated everything needed
  // player.update(); <-- REMOVING THIS CALL

  // Update combo system
  updateCombo(deltaTime);

  // Check for ground collision
  let isOnGround = false;
  platforms.forEach((platform) => {
    if (player.isCollidingWithRect(platform)) {
      // Only apply ground collision if player is moving downward
      // This prevents getting stuck when jumping up through platforms
      if (player.velocity.y >= 0) {
        // Fix player position to be on top of the platform
        player.posY = platform.posY - player.height / 2;
        player.velocity.y = 0;
        player.isGrounded = true;
        isOnGround = true;

        // Reset double jump ability when landing
        player.canDoubleJump = true;
      }
    }
  });

  // If not on any platform, player is falling
  if (!isOnGround) {
    player.isGrounded = false;
  }

  // Update score
  score = Math.floor(distanceTraveled / 100) * comboMultiplier;

  // Spawn obstacles
  obstacleSpawnTimer -= deltaTime;
  if (obstacleSpawnTimer <= 0) {
    createObstacle();
    obstacleSpawnTimer = Math.random() * 2 + 0.5; // Random time between 0.5 and 2.5 seconds
  }

  // Spawn powerups
  powerupSpawnTimer -= deltaTime;
  if (powerupSpawnTimer <= 0) {
    createPowerup();
    powerupSpawnTimer = Math.random() * 5 + 3; // Random time between 3 and 8 seconds
  }

  // Check for collisions with obstacles
  obstacles.forEach((obstacle, index) => {
    if (player.isCollidingWithRect(obstacle)) {
      // Create explosion effect
      particles.create({
        x: player.posX,
        y: player.posY,
        color: "#00ffff",
        count: 30,
        speedMultiplier: 1.5,
        duration: 1.5,
      });

      // Game over
      gameOver();
    }

    // Remove obstacles that are off-screen
    if (obstacle.posX < camera.x - 100) {
      obstacles.splice(index, 1);
    }
  });

  // Check for collisions with powerups
  powerups.forEach((powerup, index) => {
    if (player.isCollidingWith(powerup)) {
      // Apply powerup effect
      if (powerup.type === "slowmo") {
        activateSlowMotion();
      } else if (powerup.type === "combo") {
        increaseCombo();
      } else if (powerup.type === "shield") {
        // Add shield effect here if implemented
        particles.create({
          x: player.posX,
          y: player.posY,
          color: "#00ffaa",
          count: 20,
          speedMultiplier: 1,
          duration: 1,
        });
      }

      // Remove collected powerup
      powerups.splice(index, 1);
    }

    // Remove powerups that are off-screen
    if (powerup.posX < camera.x - 100) {
      powerups.splice(index, 1);
    }
  });

  // Update particle effects
  particles.update(deltaTime);

  // Increase game speed over time
  gameSpeed += deltaTime * 5;

  // Draw game objects
  drawGameObjects();

  // Draw HUD
  drawHUD();
}

// Draw all game objects
function drawGameObjects() {
  // Save current transformation
  ctx.save();

  // Apply camera transformation
  ctx.translate(-camera.x * graphics, 0);

  // Draw platforms
  platforms.forEach((platform) => {
    platform.draw();
  });

  // Draw obstacles
  obstacles.forEach((obstacle) => {
    obstacle.draw();
  });

  // Draw powerups
  powerups.forEach((powerup) => {
    powerup.draw();
  });

  // Draw player
  player.draw();

  // Draw particles
  particles.draw();

  // Restore transformation
  ctx.restore();
}

// Draw heads-up display
function drawHUD() {
  // Draw score
  drawText(`Score: ${score}`, 20, 30, "20px Arial", "#00ffff");
  drawText(`High Score: ${highScore}`, 20, 60, "16px Arial", "#00ff55");

  // Draw combo multiplier if active
  if (comboMultiplier > 1) {
    drawText(`Combo: x${comboMultiplier}`, 20, 90, "18px Arial", "#ffcc00");
  }

  // Draw slow motion indicator if active
  if (slowMotionActive) {
    drawText(
      `SLOW MOTION: ${Math.ceil(slowMotionTimer)}s`,
      cW / (2 * graphics) - 100,
      30,
      "18px Arial",
      "#0088ff"
    );
  }
}

// Render menu screen
function renderMenu() {
  clearCanvas();

  // Draw title
  drawText(
    "NEON RUNNER",
    cW / (2 * graphics) - 200,
    cH / (3 * graphics),
    "48px Arial",
    "#00ffff"
  );

  // Draw instructions
  drawText(
    "Press SPACE or Click to Start",
    cW / (2 * graphics) - 175,
    cH / (2 * graphics),
    "24px Arial",
    "#00ff55"
  );
  drawText(
    "SHIFT for Slow Motion (when available)",
    cW / (2 * graphics) - 190,
    cH / (1.8 * graphics),
    "20px Arial",
    "#0088ff"
  );

  // Draw high score
  if (highScore > 0) {
    drawText(
      `High Score: ${highScore}`,
      cW / (2 * graphics) - 80,
      cH / (1.5 * graphics),
      "20px Arial",
      "#ffffff"
    );
  }
}

// Render game over screen
function renderGameOver() {
  clearCanvas();

  // Draw game over text
  drawText(
    "GAME OVER",
    cW / (2 * graphics) - 140,
    cH / (3 * graphics),
    "48px Arial",
    "#ff0066"
  );

  // Draw score
  drawText(
    `Score: ${score}`,
    cW / (2 * graphics) - 70,
    cH / (2 * graphics),
    "32px Arial",
    "#00ffff"
  );

  // Draw high score
  drawText(
    `High Score: ${highScore}`,
    cW / (2 * graphics) - 80,
    cH / (1.7 * graphics),
    "24px Arial",
    "#00ff55"
  );

  // Draw restart instructions
  drawText(
    "Press SPACE or Click to Restart",
    cW / (2 * graphics) - 175,
    cH / (1.3 * graphics),
    "24px Arial",
    "#ffffff"
  );
}

// Game over function
function gameOver() {
  gameState = "gameOver";

  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("neonRunnerHighScore", highScore);
  }
}

// Initialize the game when the page loads
window.addEventListener("load", init);
