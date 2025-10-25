export interface Vector2D {
  x: number;
  y: number;
}

export interface RectOptions {
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
  color?: string;
  alpha?: number;
  mass?: number;
  gravity?: number;
  restitution?: number;
  features?: {
    draggable?: boolean;
  };
}

export class Rect {
  posX: number;
  posY: number;
  width: number;
  height: number;
  color: string;
  draggable: boolean;
  alpha: number;
  mass: number;
  velocity: Vector2D;
  gravity: number;
  isJumping: boolean;
  jumpStrength: number;
  restitution: number;
  isClicked: boolean;
  offsetX: number;
  offsetY: number;

  private ctx: CanvasRenderingContext2D;
  private graphics: number;
  private canvasHeight: number;

  constructor(
    options: RectOptions,
    ctx: CanvasRenderingContext2D,
    graphics: number,
    canvasHeight: number
  ) {
    this.posX = options.posX ?? 0;
    this.posY = options.posY ?? 0;
    this.width = options.width ?? 0;
    this.height = options.height ?? 0;
    this.color = options.color ?? "black";
    this.draggable = options.features?.draggable ?? false;
    this.alpha = options.alpha ?? 1;
    this.mass = options.mass ?? 1;
    this.velocity = { x: 0, y: 0 };
    this.gravity = options.gravity ?? 0.3;
    this.isJumping = false;
    this.jumpStrength = -10;
    this.restitution = options.restitution ?? 0;
    this.isClicked = false;
    this.offsetX = 0;
    this.offsetY = 0;

    this.ctx = ctx;
    this.graphics = graphics;
    this.canvasHeight = canvasHeight;
  }

  draw(): void {
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.posX * this.graphics,
      this.posY * this.graphics,
      this.width * this.graphics,
      this.height * this.graphics
    );
    this.ctx.globalAlpha = 1;
  }

  update(): void {
    // Apply gravity
    this.velocity.y += this.gravity;
    // Update position
    this.posY += this.velocity.y;

    // Check for collision with ground
    if (this.posY + this.height >= this.canvasHeight / this.graphics) {
      this.posY = this.canvasHeight / this.graphics - this.height;
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

  isPointInside(x: number, y: number): boolean {
    return (
      x >= this.posX - this.width / 2 &&
      x <= this.posX + this.width / 2 &&
      y >= this.posY - this.height / 2 &&
      y <= this.posY + this.height / 2
    );
  }

  onClickDown(x: number, y: number): void {
    if (this.isPointInside(x, y)) {
      this.isClicked = true;
      this.offsetX = x - this.posX;
      this.offsetY = y - this.posY;
    }
  }

  onClickUp(): void {
    this.isClicked = false;
  }

  onMouseMove(x: number, y: number): void {
    if (this.isClicked) {
      this.posX = x - this.offsetX;
      this.posY = y - this.offsetY;
    }
  }

  enableDragging(canvas: HTMLCanvasElement): void {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const elementGravity = this.gravity;

    canvas.addEventListener("mousedown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        mouseX >= this.posX - this.width / 2 &&
        mouseX <= this.posX + this.width / 2 &&
        mouseY >= this.posY - this.height / 2 &&
        mouseY <= this.posY + this.height / 2
      ) {
        isDragging = true;
        offsetX = mouseX - this.posX;
        offsetY = mouseY - this.posY;
        this.gravity = 0;
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        this.posX = mouseX - offsetX;
        this.posY = mouseY - offsetY;
      }
    });

    canvas.addEventListener("mouseup", () => {
      isDragging = false;
      this.gravity = elementGravity;
    });
  }

  changeColor(newColor: string): this {
    this.color = newColor;
    return this;
  }

  resize(newWidth: number, newHeight: number): this {
    this.width = newWidth;
    this.height = newHeight;
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

  rotate(angleInDegrees: number): this {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    const centerX = this.posX + this.width / 2;
    const centerY = this.posY + this.height / 2;
    const dx = this.posX - centerX;
    const dy = this.posY - centerY;

    this.posX = centerX + dx * Math.cos(angleInRadians) - dy * Math.sin(angleInRadians);
    this.posY = centerY + dx * Math.sin(angleInRadians) + dy * Math.cos(angleInRadians);
    return this;
  }

  isCollidingWith(otherRect: Rect): boolean {
    return (
      this.posX < otherRect.posX + otherRect.width &&
      this.posX + this.width > otherRect.posX &&
      this.posY < otherRect.posY + otherRect.height &&
      this.posY + this.height > otherRect.posY
    );
  }

  scale(factor: number): this {
    this.width *= factor;
    this.height *= factor;
    return this;
  }

  adjustOpacity(newAlpha: number): this {
    if (newAlpha >= 0 && newAlpha <= 1) {
      this.alpha = newAlpha;
    }
    return this;
  }

  changeMass(newMass: number): this {
    if (newMass > 0) {
      this.mass = newMass;
    }
    return this;
  }

  adjustAcceleration(newAcc: number): this {
    this.velocity.y = newAcc;
    return this;
  }
}
