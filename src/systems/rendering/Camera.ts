export interface CameraTarget {
  posX: number;
  posY?: number;
}

export interface CameraConfig {
  smoothFactor?: number;
  levelWidth?: number;
  levelHeight?: number;
}

export class Camera {
  x: number = 0;
  y: number = 0;
  target: CameraTarget | null = null;
  smoothFactor: number;
  levelWidth: number;
  levelHeight: number;

  private canvasWidth: number;
  private canvasHeight: number;
  private graphics: number;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    graphics: number,
    config: CameraConfig = {}
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.graphics = graphics;
    this.smoothFactor = config.smoothFactor ?? 0.1;
    this.levelWidth = config.levelWidth ?? 0;
    this.levelHeight = config.levelHeight ?? 0;
  }

  /**
   * Set the camera target to follow
   */
  setTarget(target: CameraTarget): void {
    this.target = target;
  }

  /**
   * Set the level width for camera bounds
   */
  setLevelWidth(width: number): void {
    this.levelWidth = width;
  }

  /**
   * Set the level height for camera bounds
   */
  setLevelHeight(height: number): void {
    this.levelHeight = height;
  }

  /**
   * Update camera position to follow target
   */
  update(): void {
    if (!this.target) return;

    // Calculate target position (center of screen)
    const targetX = this.target.posX - this.canvasWidth / 2 / this.graphics;

    // Smooth camera movement
    this.x += (targetX - this.x) * this.smoothFactor;

    // Clamp camera to level bounds
    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.canvasWidth / this.graphics));

    // Handle vertical camera if target has posY
    if (this.target.posY !== undefined && this.levelHeight > 0) {
      const targetY = this.target.posY - this.canvasHeight / 2 / this.graphics;
      this.y += (targetY - this.y) * this.smoothFactor;
      this.y = Math.max(0, Math.min(this.y, this.levelHeight - this.canvasHeight / this.graphics));
    }
  }

  /**
   * Apply camera transformation to context
   */
  apply(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(-this.x * this.graphics, -this.y * this.graphics);
  }

  /**
   * Reset camera transformation
   */
  reset(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  /**
   * Get camera bounds
   */
  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.canvasWidth / this.graphics,
      height: this.canvasHeight / this.graphics,
    };
  }

  /**
   * Check if a point is visible in camera view
   */
  isVisible(x: number, y: number, margin: number = 0): boolean {
    const bounds = this.getBounds();
    return (
      x >= bounds.x - margin &&
      x <= bounds.x + bounds.width + margin &&
      y >= bounds.y - margin &&
      y <= bounds.y + bounds.height + margin
    );
  }

  /**
   * Shake the camera for effects
   */
  shake(intensity: number, duration: number): void {
    const startTime = performance.now();
    const originalX = this.x;
    const originalY = this.y;

    const shakeInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      if (elapsed >= duration) {
        this.x = originalX;
        this.y = originalY;
        clearInterval(shakeInterval);
        return;
      }

      const progress = 1 - elapsed / duration;
      this.x = originalX + (Math.random() - 0.5) * intensity * progress;
      this.y = originalY + (Math.random() - 0.5) * intensity * progress;
    }, 16);
  }
}
