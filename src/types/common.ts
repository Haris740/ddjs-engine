/**
 * Common types shared across the entire engine
 * Includes basic primitives and utility types
 */

/**
 * 2D Vector representation
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * RGB Color representation
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * RGBA Color representation with alpha
 */
export interface RGBAColor extends RGBColor {
  a: number;
}

/**
 * Rectangle bounds
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circle bounds
 */
export interface CircleBounds {
  x: number;
  y: number;
  radius: number;
}

/**
 * Point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Size dimensions
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Transform properties
 */
export interface Transform {
  position: Vector2D;
  rotation: number;
  scale: Vector2D;
}

/**
 * Generic callback function
 */
export type Callback = () => void;

/**
 * Generic callback with parameters
 */
export type CallbackWithParams<T> = (params: T) => void;

/**
 * Generic async callback
 */
export type AsyncCallback<T = void> = () => Promise<T>;

/**
 * Color type - can be string or RGBA object
 */
export type Color = string | RGBAColor;

/**
 * Game state enum
 */
export type GameState = "loading" | "menu" | "playing" | "paused" | "gameOver";

/**
 * Alignment options
 */
export type Alignment = "left" | "center" | "right" | "top" | "bottom";

/**
 * Direction enum
 */
export type Direction = "up" | "down" | "left" | "right";

/**
 * Easing functions
 */
export type EasingFunction = (t: number) => number;

/**
 * Layer for rendering order
 */
export interface Layer {
  name: string;
  zIndex: number;
  visible: boolean;
}

/**
 * Sprite sheet frame
 */
export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  duration?: number;
}

/**
 * Animation configuration
 */
export interface Animation {
  name: string;
  frames: SpriteFrame[];
  loop: boolean;
  speed: number;
}

/**
 * Timer configuration
 */
export interface TimerConfig {
  duration: number;
  loop?: boolean;
  onComplete?: Callback;
  onTick?: CallbackWithParams<number>;
}

/**
 * Tween configuration
 */
export interface TweenConfig<T> {
  from: T;
  to: T;
  duration: number;
  easing?: EasingFunction;
  onUpdate?: CallbackWithParams<T>;
  onComplete?: Callback;
}

/**
 * Asset types
 */
export type AssetType = "image" | "audio" | "font" | "json" | "video";

/**
 * Asset metadata
 */
export interface AssetMetadata {
  type: AssetType;
  path: string;
  loaded: boolean;
  data?: any;
}

/**
 * Viewport configuration
 */
export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
}

/**
 * Input key codes
 */
export type KeyCode =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "w"
  | "a"
  | "s"
  | "d"
  | " "
  | "Enter"
  | "Escape"
  | string;

/**
 * Mouse button
 */
export type MouseButton = 0 | 1 | 2; // Left, Middle, Right

/**
 * Touch point
 */
export interface TouchPoint {
  id: number;
  x: number;
  y: number;
}
