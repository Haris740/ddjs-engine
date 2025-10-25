/**
 * Math utility functions for game development
 * Includes common calculations, interpolation, and vector math
 */

export class MathUtils {
  /**
   * Clamp a value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Linear interpolation between two values
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  /**
   * Calculate distance between two points
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /**
   * Calculate squared distance (faster, no square root)
   */
  static distanceSquared(x1: number, y1: number, x2: number, y2: number): number {
    return (x2 - x1) ** 2 + (y2 - y1) ** 2;
  }

  /**
   * Convert degrees to radians
   */
  static degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Convert radians to degrees
   */
  static radToDeg(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  /**
   * Get random number between min and max
   */
  static random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Get random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Map a value from one range to another
   */
  static map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  /**
   * Normalize a value from 0 to 1 based on min and max
   */
  static normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  /**
   * Calculate angle between two points (in radians)
   */
  static angleBetween(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  /**
   * Check if a value is approximately equal to another (with tolerance)
   */
  static approximately(a: number, b: number, epsilon: number = 0.0001): boolean {
    return Math.abs(a - b) < epsilon;
  }

  /**
   * Snap value to grid
   */
  static snapToGrid(value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize;
  }

  /**
   * Check if point is inside circle
   */
  static pointInCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
    return this.distanceSquared(px, py, cx, cy) <= radius * radius;
  }

  /**
   * Check if point is inside rectangle
   */
  static pointInRect(
    px: number,
    py: number,
    rx: number,
    ry: number,
    rw: number,
    rh: number
  ): boolean {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }

  /**
   * Smooth step interpolation (ease in/out)
   */
  static smoothStep(t: number): number {
    return t * t * (3 - 2 * t);
  }

  /**
   * Smoother step interpolation
   */
  static smootherStep(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Ease in (quadratic)
   */
  static easeIn(t: number): number {
    return t * t;
  }

  /**
   * Ease out (quadratic)
   */
  static easeOut(t: number): number {
    return t * (2 - t);
  }

  /**
   * Ease in-out (quadratic)
   */
  static easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Wrap value between min and max
   */
  static wrap(value: number, min: number, max: number): number {
    const range = max - min;
    return ((((value - min) % range) + range) % range) + min;
  }

  /**
   * Check if number is power of 2
   */
  static isPowerOfTwo(value: number): boolean {
    return (value & (value - 1)) === 0 && value !== 0;
  }

  /**
   * Get next power of 2
   */
  static nextPowerOfTwo(value: number): number {
    return Math.pow(2, Math.ceil(Math.log2(value)));
  }
}

/**
 * 2D Vector class for vector operations
 */
export class Vector2 {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  /**
   * Add another vector
   */
  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtract another vector
   */
  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * Multiply by scalar
   */
  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * Divide by scalar
   */
  divide(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  /**
   * Get magnitude (length)
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get squared magnitude (faster)
   */
  magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Normalize vector (length = 1)
   */
  normalize(): Vector2 {
    const mag = this.magnitude();
    return mag > 0 ? this.divide(mag) : new Vector2(0, 0);
  }

  /**
   * Dot product
   */
  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Distance to another vector
   */
  distanceTo(v: Vector2): number {
    return Math.sqrt((v.x - this.x) ** 2 + (v.y - this.y) ** 2);
  }

  /**
   * Angle to another vector
   */
  angleTo(v: Vector2): number {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }

  /**
   * Clone vector
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Static zero vector
   */
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  /**
   * Static one vector
   */
  static one(): Vector2 {
    return new Vector2(1, 1);
  }
}
