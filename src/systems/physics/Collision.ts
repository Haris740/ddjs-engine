export interface CollisionRect {
  posX: number;
  posY: number;
  width: number;
  height: number;
}

export interface CollisionCircle {
  x: number;
  y: number;
  radius: number;
}

export class Collision {
  /**
   * Check if two rectangles are colliding (AABB collision)
   */
  static rectToRect(rect1: CollisionRect, rect2: CollisionRect): boolean {
    return (
      rect1.posX < rect2.posX + rect2.width &&
      rect1.posX + rect1.width > rect2.posX &&
      rect1.posY < rect2.posY + rect2.height &&
      rect1.posY + rect1.height > rect2.posY
    );
  }

  /**
   * Check if two circles are colliding
   */
  static circleToCircle(circle1: CollisionCircle, circle2: CollisionCircle): boolean {
    const distance = Math.sqrt((circle2.x - circle1.x) ** 2 + (circle2.y - circle1.y) ** 2);
    return distance <= circle1.radius + circle2.radius;
  }

  /**
   * Check if a circle is colliding with a rectangle
   */
  static circleToRect(circle: CollisionCircle, rect: CollisionRect): boolean {
    // Find the closest point on the rectangle to the circle's center
    const closestX = Math.max(rect.posX, Math.min(circle.x, rect.posX + rect.width));
    const closestY = Math.max(rect.posY, Math.min(circle.y, rect.posY + rect.height));

    // Calculate the distance between the circle's center and this closest point
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    // If the distance is less than the circle's radius, collision is detected
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;
    return distanceSquared <= circle.radius * circle.radius;
  }

  /**
   * Check if a circle is colliding with the ground (horizontal surface)
   */
  static circleToGround(circle: CollisionCircle, rect: CollisionRect): boolean {
    // Check if the circle's bottom is within the rectangle's top and bottom bounds
    if (
      circle.y + circle.radius >= rect.posY &&
      circle.y + circle.radius <= rect.posY + rect.height
    ) {
      // Check if the circle's center is within the rectangle's horizontal bounds
      if (circle.x >= rect.posX && circle.x <= rect.posX + rect.width) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a point is inside a rectangle
   */
  static pointInRect(x: number, y: number, rect: CollisionRect): boolean {
    return (
      x >= rect.posX &&
      x <= rect.posX + rect.width &&
      y >= rect.posY &&
      y <= rect.posY + rect.height
    );
  }

  /**
   * Check if a point is inside a circle
   */
  static pointInCircle(x: number, y: number, circle: CollisionCircle): boolean {
    const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
    return distance <= circle.radius;
  }

  /**
   * Get collision normal vector for circle-rect collision
   */
  static getCircleRectNormal(
    circle: CollisionCircle,
    rect: CollisionRect
  ): { x: number; y: number } | null {
    if (!this.circleToRect(circle, rect)) {
      return null;
    }

    const closestX = Math.max(rect.posX, Math.min(circle.x, rect.posX + rect.width));
    const closestY = Math.max(rect.posY, Math.min(circle.y, rect.posY + rect.height));

    const normalX = circle.x - closestX;
    const normalY = circle.y - closestY;
    const length = Math.sqrt(normalX * normalX + normalY * normalY);

    return {
      x: normalX / length,
      y: normalY / length,
    };
  }

  /**
   * Resolve collision between two rectangles (simple separation)
   */
  static resolveRectCollision(
    rect1: CollisionRect,
    rect2: CollisionRect,
    velocity1: { x: number; y: number }
  ): void {
    if (!this.rectToRect(rect1, rect2)) return;

    const overlapX =
      Math.min(rect1.posX + rect1.width, rect2.posX + rect2.width) -
      Math.max(rect1.posX, rect2.posX);
    const overlapY =
      Math.min(rect1.posY + rect1.height, rect2.posY + rect2.height) -
      Math.max(rect1.posY, rect2.posY);

    if (overlapX < overlapY) {
      // Separate horizontally
      if (rect1.posX < rect2.posX) {
        rect1.posX -= overlapX;
      } else {
        rect1.posX += overlapX;
      }
      velocity1.x = -velocity1.x * 0.5;
    } else {
      // Separate vertically
      if (rect1.posY < rect2.posY) {
        rect1.posY -= overlapY;
      } else {
        rect1.posY += overlapY;
      }
      velocity1.y = -velocity1.y * 0.5;
    }
  }
}
