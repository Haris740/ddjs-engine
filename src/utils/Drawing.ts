/**
 * Drawing utility functions for common shapes and graphics
 * Provides helpers for lines, arcs, text, and more
 */

export class Drawing {
  private ctx: CanvasRenderingContext2D;
  private graphics: number;

  constructor(ctx: CanvasRenderingContext2D, graphics: number = 1) {
    this.ctx = ctx;
    this.graphics = graphics;
  }

  /**
   * Draw a line between two points
   */
  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string = "black",
    lineWidth: number = 1
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1 * this.graphics, y1 * this.graphics);
    this.ctx.lineTo(x2 * this.graphics, y2 * this.graphics);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth * this.graphics;
    this.ctx.stroke();
  }

  /**
   * Draw an arc or circle segment
   */
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    color: string = "black",
    lineWidth: number = 1,
    fill: boolean = false
  ): void {
    this.ctx.beginPath();
    this.ctx.arc(
      x * this.graphics,
      y * this.graphics,
      radius * this.graphics,
      startAngle,
      endAngle
    );

    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = lineWidth * this.graphics;
      this.ctx.stroke();
    }
  }

  /**
   * Draw a circle
   */
  circle(
    x: number,
    y: number,
    radius: number,
    color: string = "black",
    fill: boolean = true
  ): void {
    this.arc(x, y, radius, 0, Math.PI * 2, color, 1, fill);
  }

  /**
   * Draw a rectangle
   */
  rect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = "black",
    fill: boolean = true
  ): void {
    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(
        x * this.graphics,
        y * this.graphics,
        width * this.graphics,
        height * this.graphics
      );
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.strokeRect(
        x * this.graphics,
        y * this.graphics,
        width * this.graphics,
        height * this.graphics
      );
    }
  }

  /**
   * Draw text
   */
  text(
    text: string,
    x: number,
    y: number,
    font: string = "16px Arial",
    color: string = "black",
    alpha: number = 1,
    align: CanvasTextAlign = "left"
  ): void {
    this.ctx.globalAlpha = alpha;
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x * this.graphics, y * this.graphics);
    this.ctx.globalAlpha = 1;
  }

  /**
   * Draw polygon
   */
  polygon(points: { x: number; y: number }[], color: string = "black", fill: boolean = true): void {
    if (points.length < 3) return;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x * this.graphics, points[0].y * this.graphics);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x * this.graphics, points[i].y * this.graphics);
    }

    this.ctx.closePath();

    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
  }

  /**
   * Draw a triangle
   */
  triangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    color: string = "black",
    fill: boolean = true
  ): void {
    this.polygon(
      [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 },
      ],
      color,
      fill
    );
  }

  /**
   * Draw a rounded rectangle
   */
  roundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    color: string = "black",
    fill: boolean = true
  ): void {
    const sx = x * this.graphics;
    const sy = y * this.graphics;
    const sw = width * this.graphics;
    const sh = height * this.graphics;
    const sr = radius * this.graphics;

    this.ctx.beginPath();
    this.ctx.moveTo(sx + sr, sy);
    this.ctx.lineTo(sx + sw - sr, sy);
    this.ctx.arcTo(sx + sw, sy, sx + sw, sy + sr, sr);
    this.ctx.lineTo(sx + sw, sy + sh - sr);
    this.ctx.arcTo(sx + sw, sy + sh, sx + sw - sr, sy + sh, sr);
    this.ctx.lineTo(sx + sr, sy + sh);
    this.ctx.arcTo(sx, sy + sh, sx, sy + sh - sr, sr);
    this.ctx.lineTo(sx, sy + sr);
    this.ctx.arcTo(sx, sy, sx + sr, sy, sr);
    this.ctx.closePath();

    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
  }

  /**
   * Draw a star
   */
  star(
    x: number,
    y: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    color: string = "black",
    fill: boolean = true
  ): void {
    const step = Math.PI / spikes;
    let rot = (Math.PI / 2) * 3;

    this.ctx.beginPath();
    this.ctx.moveTo(x * this.graphics, (y - outerRadius) * this.graphics);

    for (let i = 0; i < spikes; i++) {
      const ox = x + Math.cos(rot) * outerRadius;
      const oy = y + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(ox * this.graphics, oy * this.graphics);
      rot += step;

      const ix = x + Math.cos(rot) * innerRadius;
      const iy = y + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(ix * this.graphics, iy * this.graphics);
      rot += step;
    }

    this.ctx.lineTo(x * this.graphics, (y - outerRadius) * this.graphics);
    this.ctx.closePath();

    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
  }

  /**
   * Measure text dimensions
   */
  measureText(text: string, font: string = "16px Arial"): TextMetrics {
    this.ctx.font = font;
    return this.ctx.measureText(text);
  }

  /**
   * Draw grid
   */
  grid(
    cellSize: number,
    width: number,
    height: number,
    color: string = "rgba(0,0,0,0.1)",
    lineWidth: number = 1
  ): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;

    // Vertical lines
    for (let x = 0; x <= width; x += cellSize) {
      this.line(x, 0, x, height, color, lineWidth);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += cellSize) {
      this.line(0, y, width, y, color, lineWidth);
    }
  }
}

/**
 * Standalone drawing functions (for backward compatibility)
 */

export function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string = "black",
  lineWidth: number = 1,
  graphics: number = 1
): void {
  ctx.beginPath();
  ctx.moveTo(x1 * graphics, y1 * graphics);
  ctx.lineTo(x2 * graphics, y2 * graphics);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth * graphics;
  ctx.stroke();
}

export function drawArc(
  ctx: CanvasRenderingContext2D,
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

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string = "16px Arial",
  color: string = "black",
  alpha: number = 1,
  graphics: number = 1
): void {
  ctx.globalAlpha = alpha;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x * graphics, y * graphics);
  ctx.globalAlpha = 1;
}

export function measureText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string = "16px Arial"
): TextMetrics {
  ctx.font = font;
  return ctx.measureText(text);
}
