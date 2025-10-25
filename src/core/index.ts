/**
 * Core module - Exports all core functionality
 */

// Import all classes first
import { Canvas, type CanvasConfig } from "./Canvas.js";
import { GameLoop } from "./GameLoop.js";
import { AssetLoader } from "./AssetLoader.js";
import { GraphicsCache } from "./GraphicsCache.js";

// Re-export everything
export { Canvas, type CanvasConfig } from "./Canvas.js";
export { GameLoop } from "./GameLoop.js";
export { AssetLoader } from "./AssetLoader.js";
export {
  GraphicsCache,
  getGraphicsCache,
  resetGraphicsCache,
  type GradientType,
  type PatternRepetition,
  type GradientColorStop,
  type LinearGradientCoordinates,
  type RadialGradientCoordinates,
} from "./GraphicsCache.js";

// Engine configuration interface
export interface EngineConfig extends CanvasConfig {
  backgroundColor?: string;
  autoInit?: boolean;
  targetFPS?: number;
}

// DDJSEngine class with overloaded constructors
export class DDJSEngine {
  public canvas: Canvas;
  public gameLoop: GameLoop;
  public assetLoader: AssetLoader;
  public graphicsCache: GraphicsCache;

  // Constructor overloads
  constructor(width: number, height: number, graphics?: number, backgroundColor?: string);
  constructor(config: EngineConfig);
  constructor(
    widthOrConfig: number | EngineConfig,
    height?: number,
    graphics: number = 1,
    backgroundColor: string = "white"
  ) {
    // Handle both constructor signatures
    if (typeof widthOrConfig === "object") {
      // Config object constructor
      const config = widthOrConfig;
      this.canvas = new Canvas(config);

      // Set background color if provided
      if (config.backgroundColor) {
        this.canvas.setBackgroundColor(config.backgroundColor);
      }

      // Auto-init if specified
      if (config.autoInit) {
        this.init();
      }
    } else {
      // Traditional constructor
      this.canvas = new Canvas(widthOrConfig, height!, graphics);
      this.canvas.setBackgroundColor(backgroundColor);
    }

    this.assetLoader = new AssetLoader();
    this.graphicsCache = new GraphicsCache(this.canvas.getContext());
    this.gameLoop = new GameLoop(() => {}, 60);
  }

  /**
   * Initialize the engine and attach canvas to DOM if needed
   */
  init(): void {
    // Only append if not using existing canvas
    if (!this.canvas.isUsingExistingCanvas()) {
      this.canvas.appendToBody();
    }
  }

  /**
   * Start the game loop
   */
  start(updateCallback: (deltaTime: number) => void, targetFPS: number = 60): void {
    this.gameLoop = new GameLoop(updateCallback, targetFPS);
    this.gameLoop.start();
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.gameLoop.stop();
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.gameLoop.fps;
  }

  /**
   * Get delta time
   */
  getDeltaTime(): number {
    return this.gameLoop.deltaTime;
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.canvas.clear();
  }

  /**
   * Get canvas element
   */
  getCanvasElement(): HTMLCanvasElement {
    return this.canvas.getCanvas();
  }

  /**
   * Get 2D rendering context
   */
  getContext(): CanvasRenderingContext2D {
    return this.canvas.getContext();
  }

  /**
   * Get asset loader instance
   */
  getAssetLoader(): AssetLoader {
    return this.assetLoader;
  }

  /**
   * Get graphics cache instance
   */
  getGraphicsCache(): GraphicsCache {
    return this.graphicsCache;
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    this.canvas.resize(width, height);
  }

  /**
   * Check if using existing canvas
   */
  isUsingExistingCanvas(): boolean {
    return this.canvas.isUsingExistingCanvas();
  }
}
