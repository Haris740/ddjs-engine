export interface Vector2D {
  x: number;
  y: number;
}

export interface TriangleOptions {
  posX?: number;
  posY?: number;
  length?: number;
  color?: string;
  alpha?: number;
  mass?: number;
  gravity?: number;
  jumpStrength?: number;
  restitution?: number;
  draggable?: boolean;
}

export class EqTriangle {
  posX: number;
  posY: number;
  length: number;
  color: string;
  height: number;
  draggable: boolean;
  alpha: number;
  mass: number;
  velocity: Vector2D;
  gravity: number;
  isJumping: boolean;
  jumpStrength: number;
  restitution: number;

  private ctx: CanvasRenderingContext2D;
  private graphics: number;
  private canvasHeight: number;

  constructor(
    options: TriangleOptions,
    ctx: CanvasRenderingContext2D,
    graphics: number,
    canvasHeight: number
  ) {
    this.posX = options.posX ?? 0;
    this.posY = options.posY ?? 0;
    this.length = options.length ?? 0;
    this.color = options.color ?? "black";
    this.height = (Math.sqrt(3) / 2) * this.length;
    this.draggable = options.draggable ?? false;
    this.alpha = options.alpha ?? 1;
    this.mass = options.mass ?? 1;
    this.velocity = { x: 0, y: 0 };
    this.gravity = options.gravity ?? 0.3;
    this.isJumping = false;
    this.jumpStrength = options.jumpStrength ?? -10;
    this.restitution = options.restitution ?? 0;

    this.ctx = ctx;
    this.graphics = graphics;
    this.canvasHeight = canvasHeight;
  }

  draw(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.moveTo(this.posX * this.graphics, (this.posY - this.height / 2) * this.graphics);
    this.ctx.lineTo(
      (this.posX + this.length / 2) * this.graphics,
      (this.posY + this.height / 2) * this.graphics
    );
    this.ctx.lineTo(
      (this.posX - this.length / 2) * this.graphics,
      (this.posY + this.height / 2) * this.graphics
    );
    this.ctx.lineTo(this.posX * this.graphics, (this.posY - this.height / 2) * this.graphics);
    this.ctx.fill();
  }

  update(): void {
    // Apply gravity
    this.velocity.y += this.gravity;
    // Update position
    this.posY += this.velocity.y;

    // Check for collision with ground
    if (this.posY + this.height / 2 >= this.canvasHeight / this.graphics) {
      this.posY = this.canvasHeight / this.graphics - this.height / 2;
      this.velocity.y = -this.velocity.y * this.restitution;
      this.isJumping = false;
    }

    this.draw();
  }

  jump(): void {
    if (!this.isJumping) {
      this.velocity.y = this.jumpStrength;
      this.isJumping = true;
    }
  }

  changeColor(newColor: string): this {
    this.color = newColor;
    return this;
  }

  resize(newLength: number): this {
    this.length = newLength;
    this.height = (Math.sqrt(3) / 2) * this.length;
    return this;
  }

  setAlpha(newAlpha: number): this {
    this.alpha = newAlpha;
    return this;
  }

  toggleDraggable(): this {
    this.draggable = !this.draggable;
    return this;
  }

  rotate(angle: number): this {
    const angleInRadians = (angle * Math.PI) / 180;
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    const newX = cos * (this.posX - this.length / 2) - sin * (this.posY + this.height / 2);
    const newY = sin * (this.posX - this.length / 2) + cos * (this.posY + this.height / 2);
    this.posX = newX + this.length / 2;
    this.posY = newY - this.height / 2;
    return this;
  }

  isCollidingWith(otherObject: EqTriangle): boolean {
    const distanceX = Math.abs(this.posX - otherObject.posX);
    const distanceY = Math.abs(this.posY - otherObject.posY);

    if (
      distanceX < this.length / 2 + otherObject.length / 2 &&
      distanceY < this.height / 2 + otherObject.height / 2
    ) {
      return true;
    }
    return false;
  }

  isCollidingWithRect(rect: {
    posX: number;
    posY: number;
    width: number;
    height: number;
  }): boolean {
    return (
      this.posX - this.length / 2 < rect.posX + rect.width &&
      this.posX + this.length / 2 > rect.posX &&
      this.posY - this.height / 2 < rect.posY + rect.height &&
      this.posY + this.height / 2 > rect.posY
    );
  }

  scale(factor: number): this {
    this.length *= factor;
    this.height = (Math.sqrt(3) / 2) * this.length;
    return this;
  }

  adjustOpacity(opacityChange: number): this {
    this.alpha += opacityChange;
    this.alpha = Math.max(0, Math.min(1, this.alpha));
    return this;
  }

  changeMass(newMass: number): this {
    this.mass = newMass;
    return this;
  }

  adjustAcceleration(accelerationChange: number): this {
    this.velocity.y += accelerationChange;
    return this;
  }
}
