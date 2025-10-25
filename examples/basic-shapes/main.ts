import {
  DDJSEngine,
  Rect,
  Circle,
  EqTriangle,
  DragController,
  InputManager,
  MathUtils,
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

// Setup input systems
const input = new InputManager({ canvas });
const dragController = new DragController({
  canvas,
  graphics: 1,
  enableSnapping: true,
  snapGridSize: 20,
});

// Game objects
const shapes: (Rect | Circle | EqTriangle)[] = [];

// Create some initial shapes
function createInitialShapes() {
  // Rectangle
  const rect = new Rect(
    {
      posX: 100,
      posY: 100,
      width: 80,
      height: 60,
      color: "#ff6b6b",
      gravity: 0.5,
      restitution: 0.6,
    },
    ctx,
    1,
    600
  );
  shapes.push(rect);
  dragController.register(rect);

  // Circle
  const circle = new Circle(
    {
      posX: 250,
      posY: 150,
      radius: 40,
      color: "#4ecdc4",
      restitution: 0.7,
      features: {
        gravity: 0.5,
      },
    },
    ctx,
    1,
    600
  );
  shapes.push(circle);
  dragController.register(circle);

  // Triangle
  const triangle = new EqTriangle(
    {
      posX: 400,
      posY: 200,
      length: 80,
      color: "#ffe66d",
      gravity: 0.5,
      restitution: 0.5,
    },
    ctx,
    1,
    600
  );
  shapes.push(triangle);
  dragController.register(triangle);
}

// Add random shape function
function addRandomShape() {
  const type = Math.floor(Math.random() * 3);
  const x = MathUtils.random(100, 700);
  const y = MathUtils.random(50, 200);
  const colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a8e6cf", "#ffd3b6"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  let shape: Rect | Circle | EqTriangle;

  switch (type) {
    case 0:
      shape = new Rect(
        {
          posX: x,
          posY: y,
          width: MathUtils.random(40, 100),
          height: MathUtils.random(40, 100),
          color,
          gravity: 0.5,
          restitution: MathUtils.random(0.3, 0.8),
        },
        ctx,
        1,
        600
      );
      break;
    case 1:
      shape = new Circle(
        {
          posX: x,
          posY: y,
          radius: MathUtils.random(20, 50),
          color,
          restitution: MathUtils.random(0.3, 0.8),
          features: { gravity: 0.5 },
        },
        ctx,
        1,
        600
      );
      break;
    default:
      shape = new EqTriangle(
        {
          posX: x,
          posY: y,
          length: MathUtils.random(50, 100),
          color,
          gravity: 0.5,
          restitution: MathUtils.random(0.3, 0.8),
        },
        ctx,
        1,
        600
      );
  }

  shapes.push(shape);
  dragController.register(shape);
}

// Button event listeners
document.getElementById("addRect")?.addEventListener("click", () => {
  const rect = new Rect(
    {
      posX: 400,
      posY: 100,
      width: 80,
      height: 60,
      color: "#ff6b6b",
      gravity: 0.5,
      restitution: 0.6,
    },
    ctx,
    1,
    600
  );
  shapes.push(rect);
  dragController.register(rect);
});

document.getElementById("addCircle")?.addEventListener("click", () => {
  const circle = new Circle(
    {
      posX: 400,
      posY: 100,
      radius: 40,
      color: "#4ecdc4",
      restitution: 0.7,
      features: {
        gravity: 0.5,
      },
    },
    ctx,
    1,
    600
  );
  shapes.push(circle);
  dragController.register(circle);
});

document.getElementById("addTriangle")?.addEventListener("click", () => {
  const triangle = new EqTriangle(
    {
      posX: 400,
      posY: 100,
      length: 80,
      color: "#ffe66d",
      gravity: 0.5,
      restitution: 0.5,
    },
    ctx,
    1,
    600
  );
  shapes.push(triangle);
  dragController.register(triangle);
});

document.getElementById("clear")?.addEventListener("click", () => {
  shapes.length = 0;
  dragController.clearAll();
});

// Keyboard input
input.onKeyDown(" ", addRandomShape);

// Initialize
createInitialShapes();

// Game loop
engine.start((deltaTime) => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Update and draw shapes
  shapes.forEach((shape) => {
    shape.update();
  });

  // Draw FPS
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`FPS: ${engine.getFPS()}`, 10, 20);
  ctx.fillText(`Shapes: ${shapes.length}`, 10, 40);
});
