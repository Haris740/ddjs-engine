export interface PhysicsObject {
  posX: number;
  posY: number;
  velocity: { x: number; y: number };
  mass: number;
  gravity: number;
  isJumping?: boolean;
  restitution?: number;
}

export interface PhysicsConfig {
  gravity?: number;
  friction?: number;
  airResistance?: number;
}

export class Physics {
  private gravity: number;
  private friction: number;
  private airResistance: number;

  constructor(config: PhysicsConfig = {}) {
    this.gravity = config.gravity ?? 0.3;
    this.friction = config.friction ?? 0.98;
    this.airResistance = config.airResistance ?? 0.99;
  }

  /**
   * Apply gravity to an object
   */
  applyGravity(object: PhysicsObject): void {
    object.velocity.y += object.gravity ?? this.gravity;
  }

  /**
   * Apply friction to an object
   */
  applyFriction(object: PhysicsObject): void {
    object.velocity.x *= this.friction;
    object.velocity.y *= this.airResistance;
  }

  /**
   * Update object position based on velocity
   */
  updatePosition(object: PhysicsObject, deltaTime: number = 1): void {
    object.posX += object.velocity.x * deltaTime;
    object.posY += object.velocity.y * deltaTime;
  }

  /**
   * Apply force to an object
   */
  applyForce(object: PhysicsObject, forceX: number, forceY: number): void {
    object.velocity.x += forceX / object.mass;
    object.velocity.y += forceY / object.mass;
  }

  /**
   * Handle ground collision with bounce
   */
  handleGroundCollision(object: PhysicsObject, groundY: number, objectHeight: number): boolean {
    if (object.posY + objectHeight >= groundY) {
      object.posY = groundY - objectHeight;
      object.velocity.y = -object.velocity.y * (object.restitution ?? 0);

      if (object.isJumping !== undefined) {
        object.isJumping = false;
      }

      // Stop bouncing if velocity is too small
      if (Math.abs(object.velocity.y) < 0.5) {
        object.velocity.y = 0;
      }

      return true;
    }
    return false;
  }

  /**
   * Handle ceiling collision
   */
  handleCeilingCollision(object: PhysicsObject, ceilingY: number): boolean {
    if (object.posY <= ceilingY) {
      object.posY = ceilingY;
      object.velocity.y = -object.velocity.y * (object.restitution ?? 0);
      return true;
    }
    return false;
  }

  /**
   * Handle wall collision (left or right)
   */
  handleWallCollision(
    object: PhysicsObject,
    wallX: number,
    objectWidth: number,
    isRightWall: boolean = false
  ): boolean {
    if (isRightWall) {
      if (object.posX + objectWidth >= wallX) {
        object.posX = wallX - objectWidth;
        object.velocity.x = -object.velocity.x * (object.restitution ?? 0);
        return true;
      }
    } else {
      if (object.posX <= wallX) {
        object.posX = wallX;
        object.velocity.x = -object.velocity.x * (object.restitution ?? 0);
        return true;
      }
    }
    return false;
  }

  /**
   * Calculate distance between two points
   */
  distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  /**
   * Set global gravity
   */
  setGravity(gravity: number): void {
    this.gravity = gravity;
  }

  /**
   * Set global friction
   */
  setFriction(friction: number): void {
    this.friction = friction;
  }

  /**
   * Get global gravity value
   */
  getGravity(): number {
    return this.gravity;
  }
}
