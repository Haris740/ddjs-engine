// core.js - Canvas setup and basic drawing functions

export const canvas = document.createElement("canvas");
export const ctx = canvas.getContext("2d");
export let cW = canvas.width;
export let cH = canvas.height;
export let graphics = 1;

// Animation frame management
let animationId = null;
let lastTime = 0;
export let deltaTime = 0;
export let fps = 0;
let frameCount = 0;
let lastFpsUpdate = 0;

// Image loading system
export const imageCache = new Map();
export const imageLoadPromises = new Map();

// Font loading system
export const fontCache = new Set();

// Gradient management
export const gradientCache = new Map();

// Pattern management
export const patternCache = new Map();

/**
 * Set up the canvas with specified dimensions, scaling, and background color.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @param {number} [graphics=1] - The scaling factor for the canvas (higher values for higher quality, uses more memory). Defaults to 1.
 * @param {string} [color='white'] - The background color of the canvas. Defaults to 'white' if not provided.
 */
export function setupCanvas(width, height, graphic = 1, color = "white") {
  if (typeof width !== "number" || typeof height !== "number") {
    throw new Error("Width and height must be numbers.");
  }

  graphics = graphic;
  cW = canvas.width;
  cH = canvas.height;

  canvas.width = cW = width * graphics;
  canvas.height = cH = height * graphics;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.style.background = color;
  document.body.appendChild(canvas); // Ensure the canvas is added to the DOM
}

// Add game state management
let gameState = "menu"; // 'menu', 'playing', 'gameOver'

export function setGameState(state) {
  gameState = state;
}

// Update game loop to handle different states
export function startGameLoop(updateFunction, targetFPS = 60) {
  const frameTime = 1000 / targetFPS;
  let lastFrame = performance.now();

  function gameLoop(timestamp) {
    // Clear the canvas at the start of the loop
    clearCanvas();

    // Calculate delta time
    deltaTime = (timestamp - lastFrame) / 1000;
    lastFrame = timestamp;
    
    // Update FPS counter
    frameCount++;
    if (timestamp - lastFpsUpdate >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastFpsUpdate = timestamp;
    }
    
    // Call the provided update function
    updateFunction(deltaTime);
    
    animationId = requestAnimationFrame(gameLoop);
  }

  animationId = requestAnimationFrame(gameLoop);
}

/**
 * Stops the game loop.
 */
export function stopGameLoop() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

/**
 * Loads an image and caches it for future use.
 * @param {string} src - The source URL of the image.
 * @returns {Promise<HTMLImageElement>} A promise that resolves with the loaded image.
 */
export function loadImage(src) {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src));
  }

  if (imageLoadPromises.has(src)) {
    return imageLoadPromises.get(src);
  }

  const img = new Image();
  const promise = new Promise((resolve, reject) => {
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });

  imageLoadPromises.set(src, promise);
  return promise;
}

/**
 * Preloads multiple images.
 * @param {string[]} srcs - Array of image source URLs.
 * @returns {Promise<HTMLImageElement[]>} A promise that resolves with an array of loaded images.
 */
export function preloadImages(...srcs) {
  const promises = srcs.map((src) => loadImage(src));
  return Promise.all(promises);
}

/**
 * Creates a gradient and caches it.
 * @param {string} key - Unique key to identify the gradient.
 * @param {number[]} points - Array of points where each point is [position, color].
 * @param {string} [type='linear'] - Type of gradient ('linear' or 'radial').
 * @param {number[]} [coordinates] - Coordinates for radial gradients [x0, y0, r0, x1, y1, r1].
 * @returns {CanvasGradient} The created gradient.
 */
export function createGradient(key, points, type = "linear", coordinates) {
  if (gradientCache.has(key)) {
    return gradientCache.get(key);
  }

  let gradient;
  if (type === "linear") {
    gradient = ctx.createLinearGradient(...points.flat());
  } else if (type === "radial") {
    gradient = ctx.createRadialGradient(...coordinates.flat());
  } else {
    throw new Error('Invalid gradient type. Use "linear" or "radial".');
  }

  points.forEach((point, index) => {
    if (index % 2 === 0) {
      gradient.addColorStop(point, points[index + 1]);
    }
  });

  gradientCache.set(key, gradient);
  return gradient;
}

/**
 * Creates a pattern and caches it.
 * @param {string} imageSrc - Source URL of the image to use as a pattern.
 * @param {string} [repetition='repeat'] - Repetition mode ('repeat', 'repeat-x', 'repeat-y', 'no-repeat').
 * @returns {Promise<CanvasPattern>} A promise that resolves with the created pattern.
 */
export function createPattern(imageSrc, repetition = "repeat") {
  const cacheKey = `${imageSrc}-${repetition}`;
  if (patternCache.has(cacheKey)) {
    return Promise.resolve(patternCache.get(cacheKey));
  }

  return loadImage(imageSrc).then((img) => {
    const pattern = ctx.createPattern(img, repetition);
    patternCache.set(cacheKey, pattern);
    return pattern;
  });
}

/**
 * Loads a custom font.
 * @param {string} fontFace - The font face to load (e.g., '16px Arial').
 * @returns {Promise} A promise that resolves when the font is loaded.
 */
export function loadFont(fontFace) {
  if (fontCache.has(fontFace)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const font = new FontFaceObserver(fontFace);
    font
      .load()
      .then(() => {
        fontCache.add(fontFace);
        resolve();
      })
      .catch(() => {
        reject(new Error(`Failed to load font: ${fontFace}`));
      });
  });
}

/**
 * Clears the canvas.
 */
export function clearCanvas() {
  ctx.clearRect(0, 0, cW, cH);
}

/**
 * Applies a transformation matrix to the canvas context.
 * @param {number[]} matrix - Transformation matrix [a, b, c, d, e, f].
 */
export function applyTransform(matrix) {
  ctx.transform(...matrix);
}

/**
 * Resets the canvas context transformation.
 */
export function resetTransform() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Saves the current canvas state.
 */
export function saveState() {
  ctx.save();
}

/**
 * Restores the previous canvas state.
 */
export function restoreState() {
  ctx.restore();
}

/**
 * Sets the canvas border radius.
 * @param {string} size - Border radius size (e.g., '10px', '50%').
 */
export function curvedCanvas(size) {
  canvas.style.borderRadius = size;
}

/**
 * Centers the canvas on the page.
 */
export function centerCanvas() {
  const body = document.body;
  const centre = document.createElement("div");
  body.appendChild(centre);
  centre.appendChild(canvas);
  centre.style.width = "100%";
  centre.style.height = "100vh";
  centre.style.display = "flex";
  canvas.style.margin = "auto auto";
  body.style.margin = "0px";
  body.style.padding = "0px";
}

/**
 * Gets the current frame rate.
 * @returns {number} Current frames per second.
 */
export function getFPS() {
  return fps;
}

// Additional drawing utilities
export function drawLine(x1, y1, x2, y2, color = "black", lineWidth = 1) {
  ctx.beginPath();
  ctx.moveTo(x1 * graphics, y1 * graphics);
  ctx.lineTo(x2 * graphics, y2 * graphics);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth * graphics;
  ctx.stroke();
}

export function drawArc(
  x,
  y,
  radius,
  startAngle,
  endAngle,
  color = "black",
  lineWidth = 1,
  fill = false
) {
  ctx.beginPath();
  ctx.arc(x * graphics, y * graphics, radius * graphics, startAngle, endAngle);
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * graphics;
    ctx.stroke();
  }
}

export function drawText(text, x, y, font = '16px Arial', color = 'black', alpha = 1) {
  ctx.globalAlpha = alpha;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x * graphics, y * graphics);
  ctx.globalAlpha = 1;
}

export function measureText(text, font = "16px Arial") {
  ctx.font = font;
  return ctx.measureText(text);
}

// Function to check if a circle is colliding with a rectangle
export function isCircleCollidingWithRect(circle, rect) {
  // Find the closest point on the rectangle to the circle's center
  const closestX = Math.max(
    rect.posX,
    Math.min(circle.x, rect.posX + rect.width)
  );
  const closestY = Math.max(
    rect.posY,
    Math.min(circle.y, rect.posY + rect.height)
  );

  // Calculate the distance between the circle's center and this closest point
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;

  // If the distance is less than the circle's radius, collision is detected
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared <= circle.radius * circle.radius;
}

// Function to check if a circle is colliding with the ground (or any horizontal surface)
export function isCircleCollidingWithGround(circle, rect) {
  // Check if the circle's bottom is within the rectangle's top and bottom bounds
  if (
    circle.y + circle.radius >= rect.posY &&
    circle.y + circle.radius <= rect.posY + rect.height
  ) {
    // Check if the circle's center is within the rectangle's horizontal bounds
    if (circle.x >= rect.posX && circle.x <= rect.posX + rect.width) {
      return true;
    }
  }
  return false;
}
