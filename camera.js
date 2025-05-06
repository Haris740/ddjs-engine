import { canvas, graphics } from './core.js';

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.target = null;
        this.smoothFactor = 0.1;
        this.levelWidth = 0;
    }

    setTarget(target) {
        this.target = target;
    }

    setLevelWidth(width) {
        this.levelWidth = width;
    }

    update() {
        if (!this.target) return;

        const targetX = this.target.posX - canvas.width / 2 / graphics;
        this.x += (targetX - this.x) * this.smoothFactor;
        this.x = Math.max(0, Math.min(this.x, this.levelWidth - canvas.width / graphics));
    }
}

export class ParallaxBackground {
  constructor(layers) {
    this.layers = layers.map(layer => ({
      ...layer,
      x: 0,
      width: layer.image.width,
      height: layer.image.height
    }));
  }

  update(cameraX) {
    this.layers.forEach(layer => {
      // Update the position based on camera movement and layer speed
      layer.x = -cameraX * layer.speed;
    });
  }

  draw() {
    this.layers.forEach(layer => {
      // Calculate how many times the image needs to be tiled
      const imageCount = Math.ceil(canvas.width / layer.width) + 2; // +2 to ensure coverage

      // Draw the image multiple times to create tiling effect
      for (let i = 0; i < imageCount; i++) {
        // Calculate the draw position
        const drawX = (layer.x + i * layer.width) % (layer.width * imageCount);

        // Draw the image
        ctx.drawImage(
          layer.image,
          drawX,
          layer.y,
          layer.width,
          layer.height
        );
      }
    });
  }
}