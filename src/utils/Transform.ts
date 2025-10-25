/**
 * Canvas transformation utilities
 * Handles rotation, scaling, translation, and matrix operations
 */

export interface TransformMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export class Transform {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * Save current transformation state
   */
  save(): void {
    this.ctx.save();
  }

  /**
   * Restore previous transformation state
   */
  restore(): void {
    this.ctx.restore();
  }

  /**
   * Reset transformation to identity matrix
   */
  reset(): void {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * Translate (move) the canvas
   */
  translate(x: number, y: number): void {
    this.ctx.translate(x, y);
  }

  /**
   * Rotate the canvas (angle in radians)
   */
  rotate(angle: number): void {
    this.ctx.rotate(angle);
  }

  /**
   * Rotate around a specific point
   */
  rotateAround(x: number, y: number, angle: number): void {
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);
    this.ctx.translate(-x, -y);
  }

  /**
   * Scale the canvas
   */
  scale(scaleX: number, scaleY: number = scaleX): void {
    this.ctx.scale(scaleX, scaleY);
  }

  /**
   * Apply custom transformation matrix
   */
  applyMatrix(matrix: TransformMatrix): void {
    this.ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  }

  /**
   * Set transformation matrix (replaces current)
   */
  setMatrix(matrix: TransformMatrix): void {
    this.ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  }

  /**
   * Get current transformation matrix
   */
  getMatrix(): DOMMatrix {
    return this.ctx.getTransform();
  }

  /**
   * Create identity matrix
   */
  static identityMatrix(): TransformMatrix {
    return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  }

  /**
   * Create translation matrix
   */
  static translationMatrix(x: number, y: number): TransformMatrix {
    return { a: 1, b: 0, c: 0, d: 1, e: x, f: y };
  }

  /**
   * Create rotation matrix
   */
  static rotationMatrix(angle: number): TransformMatrix {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { a: cos, b: sin, c: -sin, d: cos, e: 0, f: 0 };
  }

  /**
   * Create scale matrix
   */
  static scaleMatrix(scaleX: number, scaleY: number = scaleX): TransformMatrix {
    return { a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 };
  }

  /**
   * Multiply two matrices
   */
  static multiplyMatrices(m1: TransformMatrix, m2: TransformMatrix): TransformMatrix {
    return {
      a: m1.a * m2.a + m1.c * m2.b,
      b: m1.b * m2.a + m1.d * m2.b,
      c: m1.a * m2.c + m1.c * m2.d,
      d: m1.b * m2.c + m1.d * m2.d,
      e: m1.a * m2.e + m1.c * m2.f + m1.e,
      f: m1.b * m2.e + m1.d * m2.f + m1.f,
    };
  }

  /**
   * Transform a point using a matrix
   */
  static transformPoint(x: number, y: number, matrix: TransformMatrix): { x: number; y: number } {
    return {
      x: matrix.a * x + matrix.c * y + matrix.e,
      y: matrix.b * x + matrix.d * y + matrix.f,
    };
  }

  /**
   * Skew transformation
   */
  skew(angleX: number, angleY: number = 0): void {
    this.ctx.transform(1, Math.tan(angleY), Math.tan(angleX), 1, 0, 0);
  }

  /**
   * Flip horizontally
   */
  flipHorizontal(): void {
    this.ctx.scale(-1, 1);
  }

  /**
   * Flip vertically
   */
  flipVertical(): void {
    this.ctx.scale(1, -1);
  }
}

/**
 * Standalone transformation utility functions
 */

/**
 * Apply transformation matrix to canvas context
 */
export function applyTransform(ctx: CanvasRenderingContext2D, matrix: number[]): void {
  ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
}

/**
 * Reset transformation to identity
 */
export function resetTransform(ctx: CanvasRenderingContext2D): void {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Save canvas state
 */
export function saveState(ctx: CanvasRenderingContext2D): void {
  ctx.save();
}

/**
 * Restore canvas state
 */
export function restoreState(ctx: CanvasRenderingContext2D): void {
  ctx.restore();
}
