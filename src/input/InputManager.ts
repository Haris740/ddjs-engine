/**
 * Manages keyboard and mouse input for the game engine
 * Provides event handling and state tracking
 */

export interface InputState {
  keys: Map<string, boolean>;
  mouse: {
    x: number;
    y: number;
    buttons: Map<number, boolean>;
    isDown: boolean;
  };
}

export interface InputConfig {
  preventDefaultKeys?: string[];
  canvas?: HTMLCanvasElement;
}

export class InputManager {
  private inputState: InputState;
  private preventDefaultKeys: Set<string>;
  private canvas: HTMLCanvasElement | null = null;
  private keyDownCallbacks: Map<string, (() => void)[]> = new Map();
  private keyUpCallbacks: Map<string, (() => void)[]> = new Map();
  private mouseDownCallbacks: ((x: number, y: number, button: number) => void)[] = [];
  private mouseUpCallbacks: ((x: number, y: number, button: number) => void)[] = [];
  private mouseMoveCallbacks: ((x: number, y: number) => void)[] = [];

  constructor(config: InputConfig = {}) {
    this.inputState = {
      keys: new Map(),
      mouse: {
        x: 0,
        y: 0,
        buttons: new Map(),
        isDown: false,
      },
    };

    this.preventDefaultKeys = new Set(
      config.preventDefaultKeys ?? ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "]
    );

    if (config.canvas) {
      this.canvas = config.canvas;
    }

    this.init();
  }

  /**
   * Initialize event listeners
   */
  private init(): void {
    // Keyboard events
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));

    // Mouse events
    window.addEventListener("mousedown", this.handleMouseDown.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));

    // Touch events (for mobile support)
    window.addEventListener("touchstart", this.handleTouchStart.bind(this));
    window.addEventListener("touchend", this.handleTouchEnd.bind(this));
    window.addEventListener("touchmove", this.handleTouchMove.bind(this));
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (this.preventDefaultKeys.has(event.key)) {
      event.preventDefault();
    }

    this.inputState.keys.set(event.key, true);

    // Call registered callbacks
    const callbacks = this.keyDownCallbacks.get(event.key);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }

  /**
   * Handle keyup events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    this.inputState.keys.set(event.key, false);

    // Call registered callbacks
    const callbacks = this.keyUpCallbacks.get(event.key);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }

  /**
   * Handle mousedown events
   */
  private handleMouseDown(event: MouseEvent): void {
    this.updateMousePosition(event);
    this.inputState.mouse.buttons.set(event.button, true);
    this.inputState.mouse.isDown = true;

    // Call registered callbacks
    this.mouseDownCallbacks.forEach((callback) =>
      callback(this.inputState.mouse.x, this.inputState.mouse.y, event.button)
    );
  }

  /**
   * Handle mouseup events
   */
  private handleMouseUp(event: MouseEvent): void {
    this.updateMousePosition(event);
    this.inputState.mouse.buttons.set(event.button, false);
    this.inputState.mouse.isDown = false;

    // Call registered callbacks
    this.mouseUpCallbacks.forEach((callback) =>
      callback(this.inputState.mouse.x, this.inputState.mouse.y, event.button)
    );
  }

  /**
   * Handle mousemove events
   */
  private handleMouseMove(event: MouseEvent): void {
    this.updateMousePosition(event);

    // Call registered callbacks
    this.mouseMoveCallbacks.forEach((callback) =>
      callback(this.inputState.mouse.x, this.inputState.mouse.y)
    );
  }

  /**
   * Handle touchstart events
   */
  private handleTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.updateTouchPosition(touch);
      this.inputState.mouse.isDown = true;

      this.mouseDownCallbacks.forEach((callback) =>
        callback(this.inputState.mouse.x, this.inputState.mouse.y, 0)
      );
    }
  }

  /**
   * Handle touchend events
   */
  private handleTouchEnd(): void {
    this.inputState.mouse.isDown = false;

    this.mouseUpCallbacks.forEach((callback) =>
      callback(this.inputState.mouse.x, this.inputState.mouse.y, 0)
    );
  }

  /**
   * Handle touchmove events
   */
  private handleTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.updateTouchPosition(touch);

      this.mouseMoveCallbacks.forEach((callback) =>
        callback(this.inputState.mouse.x, this.inputState.mouse.y)
      );
    }
  }

  /**
   * Update mouse position relative to canvas
   */
  private updateMousePosition(event: MouseEvent): void {
    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      this.inputState.mouse.x = event.clientX - rect.left;
      this.inputState.mouse.y = event.clientY - rect.top;
    } else {
      this.inputState.mouse.x = event.clientX;
      this.inputState.mouse.y = event.clientY;
    }
  }

  /**
   * Update touch position relative to canvas
   */
  private updateTouchPosition(touch: Touch): void {
    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      this.inputState.mouse.x = touch.clientX - rect.left;
      this.inputState.mouse.y = touch.clientY - rect.top;
    } else {
      this.inputState.mouse.x = touch.clientX;
      this.inputState.mouse.y = touch.clientY;
    }
  }

  /**
   * Check if a key is currently pressed
   */
  isKeyDown(key: string): boolean {
    return this.inputState.keys.get(key) ?? false;
  }

  /**
   * Check if any of the provided keys are pressed
   */
  isAnyKeyDown(keys: string[]): boolean {
    return keys.some((key) => this.isKeyDown(key));
  }

  /**
   * Check if all of the provided keys are pressed
   */
  isAllKeysDown(keys: string[]): boolean {
    return keys.every((key) => this.isKeyDown(key));
  }

  /**
   * Get mouse position
   */
  getMousePosition(): { x: number; y: number } {
    return {
      x: this.inputState.mouse.x,
      y: this.inputState.mouse.y,
    };
  }

  /**
   * Check if mouse button is pressed
   */
  isMouseButtonDown(button: number = 0): boolean {
    return this.inputState.mouse.buttons.get(button) ?? false;
  }

  /**
   * Check if any mouse button is pressed
   */
  isMouseDown(): boolean {
    return this.inputState.mouse.isDown;
  }

  /**
   * Register callback for key down event
   */
  onKeyDown(key: string, callback: () => void): void {
    if (!this.keyDownCallbacks.has(key)) {
      this.keyDownCallbacks.set(key, []);
    }
    this.keyDownCallbacks.get(key)!.push(callback);
  }

  /**
   * Register callback for key up event
   */
  onKeyUp(key: string, callback: () => void): void {
    if (!this.keyUpCallbacks.has(key)) {
      this.keyUpCallbacks.set(key, []);
    }
    this.keyUpCallbacks.get(key)!.push(callback);
  }

  /**
   * Register callback for mouse down event
   */
  onMouseDown(callback: (x: number, y: number, button: number) => void): void {
    this.mouseDownCallbacks.push(callback);
  }

  /**
   * Register callback for mouse up event
   */
  onMouseUp(callback: (x: number, y: number, button: number) => void): void {
    this.mouseUpCallbacks.push(callback);
  }

  /**
   * Register callback for mouse move event
   */
  onMouseMove(callback: (x: number, y: number) => void): void {
    this.mouseMoveCallbacks.push(callback);
  }

  /**
   * Set canvas reference for coordinate calculations
   */
  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
  }

  /**
   * Clear all registered callbacks
   */
  clearCallbacks(): void {
    this.keyDownCallbacks.clear();
    this.keyUpCallbacks.clear();
    this.mouseDownCallbacks = [];
    this.mouseUpCallbacks = [];
    this.mouseMoveCallbacks = [];
  }

  /**
   * Cleanup and remove event listeners
   */
  destroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown.bind(this));
    window.removeEventListener("keyup", this.handleKeyUp.bind(this));
    window.removeEventListener("mousedown", this.handleMouseDown.bind(this));
    window.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    window.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    window.removeEventListener("touchstart", this.handleTouchStart.bind(this));
    window.removeEventListener("touchend", this.handleTouchEnd.bind(this));
    window.removeEventListener("touchmove", this.handleTouchMove.bind(this));
    this.clearCallbacks();
  }
}
