/**
 * Canvas management class
 * Handles canvas creation, configuration, and basic operations
 */

export interface CanvasConfig {
  width: number;
  height: number;
  graphics?: number;
  backgroundColor?: string;
  existingCanvas?: HTMLCanvasElement | string;
}

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;
  public graphics: number;
  private backgroundColor: string = "white";
  private isExistingCanvas: boolean = false;

  constructor(width: number, height: number, graphics?: number);
  constructor(config: CanvasConfig);
  constructor(widthOrConfig: number | CanvasConfig, height?: number, graphics: number = 1) {
    // Handle both constructor signatures
    if (typeof widthOrConfig === "object") {
      const config = widthOrConfig;
      this.width = config.width;
      this.height = config.height;
      this.graphics = config.graphics ?? 1;
      this.backgroundColor = config.backgroundColor ?? "white";

      // Check if using existing canvas
      if (config.existingCanvas) {
        this.canvas = this.resolveCanvas(config.existingCanvas);
        this.isExistingCanvas = true;
      } else {
        this.canvas = document.createElement("canvas");
        this.isExistingCanvas = false;
      }
    } else {
      // Original constructor
      this.width = widthOrConfig;
      this.height = height!;
      this.graphics = graphics;
      this.canvas = document.createElement("canvas");
      this.isExistingCanvas = false;
    }

    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D rendering context");
    }
    this.ctx = context;

    this.setup();
  }

  /**
   * Resolve canvas element from string ID or HTMLCanvasElement
   */
  private resolveCanvas(canvasOrId: HTMLCanvasElement | string): HTMLCanvasElement {
    if (typeof canvasOrId === "string") {
      const element = document.getElementById(canvasOrId);
      if (!element) {
        throw new Error(`Canvas element with id "${canvasOrId}" not found`);
      }
      if (!(element instanceof HTMLCanvasElement)) {
        throw new Error(`Element with id "${canvasOrId}" is not a canvas`);
      }
      return element;
    }
    return canvasOrId;
  }

  private setup(): void {
    this.canvas.width = this.width * this.graphics;
    this.canvas.height = this.height * this.graphics;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.style.background = this.backgroundColor;
  }

  /**
   * Use an existing canvas element (useful for late binding)
   */
  useExistingCanvas(canvasOrId: HTMLCanvasElement | string): void {
    this.canvas = this.resolveCanvas(canvasOrId);
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D rendering context from existing canvas");
    }
    this.ctx = context;
    this.isExistingCanvas = true;
    this.setup();
  }

  /**
   * Check if using an existing canvas element
   */
  isUsingExistingCanvas(): boolean {
    return this.isExistingCanvas;
  }

  /**
   * Set canvas background color
   */
  setBackgroundColor(color: string): void {
    this.backgroundColor = color;
    this.canvas.style.background = color;
  }

  /**
   * Get the canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get the 2D rendering context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Append canvas to document body (only if not using existing canvas)
   */
  appendToBody(): void {
    if (this.isExistingCanvas) {
      console.warn("Cannot append existing canvas to body - it's already in the DOM");
      return;
    }
    document.body.appendChild(this.canvas);
  }

  /**
   * Center canvas on page
   */
  center(): void {
    if (this.isExistingCanvas) {
      console.warn("Cannot center existing canvas - manage positioning through CSS");
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    wrapper.style.height = "100vh";
    wrapper.style.display = "flex";

    document.body.appendChild(wrapper);
    wrapper.appendChild(this.canvas);

    this.canvas.style.margin = "auto";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }

  /**
   * Set border radius for rounded corners
   */
  setBorderRadius(radius: string): void {
    this.canvas.style.borderRadius = radius;
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width * this.graphics;
    this.canvas.height = height * this.graphics;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  /**
   * Get canvas dimensions
   */
  getDimensions(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Get actual canvas dimensions (including graphics scaling)
   */
  getActualDimensions(): { width: number; height: number } {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    };
  }
}
