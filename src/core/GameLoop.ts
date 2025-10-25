/**
 * Game loop management with FPS tracking
 * Handles animation frames and delta time calculation
 */

export class GameLoop {
  private animationId: number | null = null;
  private lastFrame: number = 0;
  private frameCount: number = 0;
  private lastFpsUpdate: number = 0;

  public deltaTime: number = 0;
  public fps: number = 0;

  constructor(
    private updateCallback: (deltaTime: number) => void,
    private targetFPS: number = 60
  ) {}

  /**
   * Start the game loop
   */
  start(): void {
    this.lastFrame = performance.now();
    this.lastFpsUpdate = this.lastFrame;
    this.animationId = requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Check if loop is running
   */
  isRunning(): boolean {
    return this.animationId !== null;
  }

  /**
   * Internal loop function
   */
  private loop(timestamp: number): void {
    // Calculate delta time
    this.deltaTime = (timestamp - this.lastFrame) / 1000;
    this.lastFrame = timestamp;

    // Update FPS counter
    this.frameCount++;
    if (timestamp - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = timestamp;
    }

    // Call user update function
    this.updateCallback(this.deltaTime);

    // Continue loop
    this.animationId = requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Update the callback function
   */
  setUpdateCallback(callback: (deltaTime: number) => void): void {
    this.updateCallback = callback;
  }

  /**
   * Set target FPS
   */
  setTargetFPS(fps: number): void {
    this.targetFPS = fps;
  }
}
