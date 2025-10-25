export interface Vector2D {
  x: number;
  y: number;
}

export interface CircleOptions {
  posX?: number;
  posY?: number;
  radius?: number;
  color?: string;
  alpha?: number;
  mass?: number;
  jumpStrength?: number;
  restitution?: number;
  features?: {
    draggable?: boolean;
    gravity?: number;
  };
}

export class Circle {
  posX: number;
  posY: number;
  radius: number;
  color: string;
  alpha: number;
  mass: number;
  features: { draggable?: boolean; gravity?: number };
  draggable: boolean;
  velocity: Vector2D;
  gravity: number;
  isJumping: boolean;
  jumpStrength: number;
  restitution: number;

  private ctx: CanvasRenderingContext2D;
  private graphics: number;
  private canvasHeight: number;

  constructor(
    options: CircleOptions,
    ctx: CanvasRenderingContext2D,
    graphics: number,
    canvasHeight: number
  ) {
    this.posX = options.posX ?? 0;
    this.posY = options.posY ?? 0;
    this.radius = options.radius ?? 0;
    this.color = options.color ?? "black";
    this.alpha = options.alpha ?? 1;
    this.mass = options.mass ?? 1;
    this.features = options.features ?? {};
    this.draggable = this.features.draggable ?? false;
    this.velocity = { x: 0, y: 0 };
    this.gravity = this.features.gravity ?? 0.3;
    this.isJumping = false;
    this.jumpStrength = options.jumpStrength ?? -10;
    this.restitution = options.restitution ?? 0;

    this.ctx = ctx;
    this.graphics = graphics;
    this.canvasHeight = canvasHeight;
  }

  draw(): void {
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(
      this.posX * this.graphics,
      this.posY * this.graphics,
      this.radius * this.graphics,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }

  update(): void {
    // Apply gravity
    this.velocity.y += this.gravity;
    // Update position
    this.posY += this.velocity.y;

    // Check for collision with ground
    if (this.posY + this.radius >= this.canvasHeight / this.graphics) {
      this.posY = this.canvasHeight / this.graphics - this.radius;
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

  isPointingInside(mouseX: number, mouseY: number): boolean {
    const distance = Math.sqrt((mouseX - this.posX) ** 2 + (mouseY - this.posY) ** 2);
    return distance <= this.radius;
  }

  onClickDown(functif: () => void, functelse: () => void): void {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.addEventListener("mousedown", (e) => {
      const clickedX = e.clientX;
      const clickedY = e.clientY;
      if (this.isPointingInside(clickedX, clickedY)) {
        functif();
      } else {
        functelse();
      }
    });
  }

  onClickUp(functif: () => void): void {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.addEventListener("mouseup", (e) => {
      if (this.isPointingInside(e.clientX, e.clientY)) {
        functif();
      }
    });
  }

  onHover(functif: () => void, functelse: () => void): void {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.addEventListener("mousemove", (e) => {
      if (this.isPointingInside(e.clientX, e.clientY)) {
        functif();
      } else {
        functelse();
      }
    });
  }

  enableDragging(): void {
    if (this.draggable) {
      const canvas = document.querySelector("canvas");
      if (!canvas) return;

      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;
      const elementGravity = this.gravity;

      canvas.addEventListener("mousedown", (e) => {
        const clickedX = e.clientX;
        const clickedY = e.clientY;
        if (this.isPointingInside(clickedX, clickedY)) {
          isDragging = true;
          offsetX = clickedX - this.posX;
          offsetY = clickedY - this.posY;
        }
      });

      canvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
          this.gravity = 0;
          this.posX = e.clientX - offsetX;
          this.posY = e.clientY - offsetY;
        }
      });

      canvas.addEventListener("mouseup", () => {
        isDragging = false;
        this.gravity = elementGravity;
      });
    }
  }

  addForce(force: number): void {
    this.velocity.y += force / this.mass;
    this.velocity.y += this.gravity;
    this.posY += this.velocity.y;
  }

  changeColor(newColor: string): this {
    this.color = newColor;
    return this;
  }

  resize(newRadius: number): this {
    this.radius = newRadius;
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

  isCollidingWith(otherCircle: Circle): boolean {
    const distance = Math.sqrt(
      (otherCircle.posX - this.posX) ** 2 + (otherCircle.posY - this.posY) ** 2
    );
    return distance <= this.radius + otherCircle.radius;
  }

  scale(factor: number): this {
    this.radius *= factor;
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
