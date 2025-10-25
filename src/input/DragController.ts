/**
 * Handles drag-and-drop functionality for game objects
 * Supports both mouse and touch input
 */

export interface Draggable {
  posX: number;
  posY: number;
  isPointInside?: (x: number, y: number) => boolean;
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: () => void;
}

export interface DragConfig {
  canvas?: HTMLCanvasElement;
  graphics?: number;
  enableSnapping?: boolean;
  snapGridSize?: number;
}

export class DragController {
  private draggables: Draggable[] = [];
  private currentDraggable: Draggable | null = null;
  private isDragging: boolean = false;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private canvas: HTMLCanvasElement | null = null;
  private graphics: number = 1;
  private enableSnapping: boolean = false;
  private snapGridSize: number = 10;

  constructor(config: DragConfig = {}) {
    this.canvas = config.canvas ?? null;
    this.graphics = config.graphics ?? 1;
    this.enableSnapping = config.enableSnapping ?? false;
    this.snapGridSize = config.snapGridSize ?? 10;

    this.init();
  }

  /**
   * Initialize event listeners
   */
  private init(): void {
    window.addEventListener("mousedown", this.handleMouseDown.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));

    // Touch support
    window.addEventListener("touchstart", this.handleTouchStart.bind(this));
    window.addEventListener("touchmove", this.handleTouchMove.bind(this));
    window.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  /**
   * Register a draggable object
   */
  register(draggable: Draggable): void {
    if (!this.draggables.includes(draggable)) {
      this.draggables.push(draggable);
    }
  }

  /**
   * Unregister a draggable object
   */
  unregister(draggable: Draggable): void {
    const index = this.draggables.indexOf(draggable);
    if (index > -1) {
      this.draggables.splice(index, 1);
    }
  }

  /**
   * Handle mouse down event
   */
  private handleMouseDown(event: MouseEvent): void {
    const { x, y } = this.getEventPosition(event);
    this.startDrag(x, y);
  }

  /**
   * Handle mouse move event
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.currentDraggable) return;

    const { x, y } = this.getEventPosition(event);
    this.updateDrag(x, y);
  }

  /**
   * Handle mouse up event
   */
  private handleMouseUp(): void {
    this.endDrag();
  }

  /**
   * Handle touch start event
   */
  private handleTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const { x, y } = this.getTouchPosition(touch);
      this.startDrag(x, y);
    }
  }

  /**
   * Handle touch move event
   */
  private handleTouchMove(event: TouchEvent): void {
    if (!this.isDragging || !this.currentDraggable) return;

    if (event.touches.length > 0) {
      event.preventDefault();
      const touch = event.touches[0];
      const { x, y } = this.getTouchPosition(touch);
      this.updateDrag(x, y);
    }
  }

  /**
   * Handle touch end event
   */
  private handleTouchEnd(): void {
    this.endDrag();
  }

  /**
   * Start dragging operation
   */
  private startDrag(x: number, y: number): void {
    // Check in reverse order (top to bottom)
    for (let i = this.draggables.length - 1; i >= 0; i--) {
      const draggable = this.draggables[i];

      // Check if point is inside draggable
      const isInside = draggable.isPointInside
        ? draggable.isPointInside(x / this.graphics, y / this.graphics)
        : this.defaultPointCheck(draggable, x / this.graphics, y / this.graphics);

      if (isInside) {
        this.currentDraggable = draggable;
        this.isDragging = true;
        this.offsetX = x / this.graphics - draggable.posX;
        this.offsetY = y / this.graphics - draggable.posY;

        if (draggable.onDragStart) {
          draggable.onDragStart();
        }

        break;
      }
    }
  }

  /**
   * Update drag position
   */
  private updateDrag(x: number, y: number): void {
    if (!this.currentDraggable) return;

    let newX = x / this.graphics - this.offsetX;
    let newY = y / this.graphics - this.offsetY;

    // Apply snapping if enabled
    if (this.enableSnapping) {
      newX = Math.round(newX / this.snapGridSize) * this.snapGridSize;
      newY = Math.round(newY / this.snapGridSize) * this.snapGridSize;
    }

    this.currentDraggable.posX = newX;
    this.currentDraggable.posY = newY;

    if (this.currentDraggable.onDrag) {
      this.currentDraggable.onDrag(newX, newY);
    }
  }

  /**
   * End dragging operation
   */
  private endDrag(): void {
    if (this.currentDraggable && this.currentDraggable.onDragEnd) {
      this.currentDraggable.onDragEnd();
    }

    this.currentDraggable = null;
    this.isDragging = false;
  }

  /**
   * Get event position relative to canvas
   */
  private getEventPosition(event: MouseEvent): { x: number; y: number } {
    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  /**
   * Get touch position relative to canvas
   */
  private getTouchPosition(touch: Touch): { x: number; y: number } {
    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  /**
   * Default point check for rectangular objects
   */
  private defaultPointCheck(draggable: Draggable, x: number, y: number): boolean {
    // Assume rectangular hitbox with width/height if available
    const obj = draggable as any;
    if (obj.width && obj.height) {
      return (
        x >= obj.posX && x <= obj.posX + obj.width && y >= obj.posY && y <= obj.posY + obj.height
      );
    }
    // Fallback to radius check if available
    if (obj.radius) {
      const distance = Math.sqrt((x - obj.posX) ** 2 + (y - obj.posY) ** 2);
      return distance <= obj.radius;
    }
    return false;
  }

  /**
   * Check if currently dragging
   */
  isDraggingActive(): boolean {
    return this.isDragging;
  }

  /**
   * Get current draggable object
   */
  getCurrentDraggable(): Draggable | null {
    return this.currentDraggable;
  }

  /**
   * Set canvas reference
   */
  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
  }

  /**
   * Set graphics scaling
   */
  setGraphics(graphics: number): void {
    this.graphics = graphics;
  }

  /**
   * Enable/disable snapping
   */
  setSnapping(enabled: boolean, gridSize?: number): void {
    this.enableSnapping = enabled;
    if (gridSize !== undefined) {
      this.snapGridSize = gridSize;
    }
  }

  /**
   * Clear all draggables
   */
  clearAll(): void {
    this.draggables = [];
    this.currentDraggable = null;
    this.isDragging = false;
  }

  /**
   * Cleanup and remove event listeners
   */
  destroy(): void {
    window.removeEventListener("mousedown", this.handleMouseDown.bind(this));
    window.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    window.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    window.removeEventListener("touchstart", this.handleTouchStart.bind(this));
    window.removeEventListener("touchmove", this.handleTouchMove.bind(this));
    window.removeEventListener("touchend", this.handleTouchEnd.bind(this));
    this.clearAll();
  }
}
