import { DDJSEngine, ParticleSystem, InputManager, MathUtils } from "../../src/index.js";

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

// Setup particle system
const particleSystem = new ParticleSystem(ctx, 1, {
  colors: ["#00ffff", "#ff00ff", "#ffff00", "#00ff99", "#ff0066"],
  maxParticles: 3000,
});

// Setup input
const input = new InputManager({ canvas });

// Mouse trail state
let trailActive = false;
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
const TRAIL_DISTANCE = 5; // Minimum distance before spawning new particles

// Track mouse position
input.onMouseMove((x, y) => {
  mouseX = x;
  mouseY = y;
});

// Mouse click handler for explosions
input.onMouseDown((x, y) => {
  if (!trailActive) {
    particleSystem.create({
      x,
      y,
      count: 50,
    });
  }
});

// Create big explosion
function createBigExplosion() {
  const x = MathUtils.random(100, 700);
  const y = MathUtils.random(100, 500);

  particleSystem.create({
    x,
    y,
    count: 100,
    color: "#ff6b6b",
  });
}

// Create fireworks
function createFireworks() {
  const x = MathUtils.random(200, 600);
  const y = 100;

  // Launch particle
  setTimeout(() => {
    particleSystem.create({
      x,
      y: y + 200,
      count: 80,
    });
  }, 500);
}

// Toggle mouse trail
function toggleTrail() {
  trailActive = !trailActive;
  const button = document.getElementById("trail");
  if (button) {
    button.textContent = trailActive ? "Stop Mouse Trail" : "Mouse Trail";
    button.style.background = trailActive ? "#ff0066" : "#00ffff";
  }

  // Reset last position when enabling
  if (trailActive) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

// Button event listeners
document.getElementById("explosion")?.addEventListener("click", createBigExplosion);
document.getElementById("fireworks")?.addEventListener("click", createFireworks);
document.getElementById("trail")?.addEventListener("click", toggleTrail);
document.getElementById("clear")?.addEventListener("click", () => {
  particleSystem.clear();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Space key for random effect
input.onKeyDown(" ", () => {
  const effects = [createBigExplosion, createFireworks];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  randomEffect();
});

// Game loop
engine.start((deltaTime) => {
  // Update particles
  particleSystem.update();

  // Draw particles
  particleSystem.draw();

  // Mouse trail effect
  if (trailActive) {
    // Calculate distance moved
    const distance = Math.sqrt((mouseX - lastMouseX) ** 2 + (mouseY - lastMouseY) ** 2);

    // Only spawn trail if mouse moved enough
    if (distance >= TRAIL_DISTANCE) {
      // Spawn multiple particles for smoother trail
      const steps = Math.floor(distance / TRAIL_DISTANCE);

      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const x = lastMouseX + (mouseX - lastMouseX) * t;
        const y = lastMouseY + (mouseY - lastMouseY) * t;

        // Random color from palette
        const colors = ["#00ffff", "#ff00ff", "#ffff00", "#00ff99", "#ff0066"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Create trail particles with slight randomness
        particleSystem.createTrail(x + MathUtils.random(-2, 2), y + MathUtils.random(-2, 2), color);
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;
    }

    // Draw cursor indicator
    ctx.save();
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff";
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Draw info
  ctx.fillStyle = "#00ffff";
  ctx.font = "16px Arial";
  ctx.fillText(`FPS: ${engine.getFPS()}`, 10, 20);
  ctx.fillText(`Particles: ${particleSystem.getParticleCount()}`, 10, 40);
  ctx.fillText(`Mouse Trail: ${trailActive ? "ON" : "OFF"}`, 10, 60);

  if (trailActive) {
    ctx.fillText("Move your mouse to create a trail!", 10, 80);
  } else {
    ctx.fillText("Click anywhere to create explosions!", 10, 80);
  }
});
