export interface RenderConfig {
  clearColor?: string;
  autoClear?: boolean;
}

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private clearColor: string;
  private autoClear: boolean;

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: RenderConfig = {}) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.clearColor = config.clearColor ?? "transparent";
    this.autoClear = config.autoClear ?? true;
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    if (this.clearColor === "transparent") {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.fillStyle = this.clearColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Begin a render frame
   */
  beginFrame(): void {
    if (this.autoClear) {
      this.clear();
    }
  }

  /**
   * End a render frame
   */
  endFrame(): void {
    // Could add post-processing here if needed
  }

  /**
   * Set clear color
   */
  setClearColor(color: string): void {
    this.clearColor = color;
  }

  /**
   * Set auto clear
   */
  setAutoClear(enabled: boolean): void {
    this.autoClear = enabled;
  }

  /**
   * Draw a line
   */
  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string = "black",
    lineWidth: number = 1,
    graphics: number = 1
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1 * graphics, y1 * graphics);
    this.ctx.lineTo(x2 * graphics, y2 * graphics);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth * graphics;
    this.ctx.stroke();
  }

  /**
   * Draw an arc
   */
  drawArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    color: string = "black",
    lineWidth: number = 1,
    fill: boolean = false,
    graphics: number = 1
  ): void {
    this.ctx.beginPath();
    this.ctx.arc(x * graphics, y * graphics, radius * graphics, startAngle, endAngle);
    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lineWidth * graphics;
      this.ctx.stroke();
    }
  }

  /**
   * Save the current rendering state
   */
  save(): void {
    this.ctx.save();
  }

  /**
   * Restore the previous rendering state
   */
  restore(): void {
    this.ctx.restore();
  }
}
