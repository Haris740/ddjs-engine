export interface TextOptions {
  posX: number;
  posY: number;
  text: string;
  font: string;
  color: string;
  alpha?: number;
}

export class Text {
  x: number;
  y: number;
  text: string;
  font: string;
  color: string;
  alpha: number;

  private ctx: CanvasRenderingContext2D;
  private graphics: number;

  constructor(options: TextOptions, ctx: CanvasRenderingContext2D, graphics: number) {
    this.x = options.posX * graphics;
    this.y = options.posY * graphics;
    this.text = options.text;
    this.font = options.font;
    this.color = options.color;
    this.alpha = options.alpha ?? 1;

    this.ctx = ctx;
    this.graphics = graphics;
  }

  draw(): void {
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;
    this.ctx.font = this.font;
    this.ctx.fillText(this.text, this.x, this.y);
    this.ctx.globalAlpha = 1;
  }

  update(): void {
    this.draw();
  }

  setText(newText: string): this {
    this.text = newText;
    return this;
  }

  setColor(newColor: string): this {
    this.color = newColor;
    return this;
  }

  setFont(newFont: string): this {
    this.font = newFont;
    return this;
  }

  setAlpha(newAlpha: number): this {
    if (newAlpha >= 0 && newAlpha <= 1) {
      this.alpha = newAlpha;
    }
    return this;
  }

  moveTo(newX: number, newY: number): this {
    this.x = newX * this.graphics;
    this.y = newY * this.graphics;
    return this;
  }
}
