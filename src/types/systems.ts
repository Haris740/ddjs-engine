/**
 * System-related type definitions
 * Includes physics, rendering, input, and other system configurations
 */

import type { Vector2D, Color, Bounds } from "./common.js";

/**
 * Physics configuration
 */
export interface PhysicsConfig {
  gravity?: number;
  friction?: number;
  airResistance?: number;
  maxVelocity?: Vector2D;
  enableCollisions?: boolean;
}

/**
 * Physics object interface
 */
export interface PhysicsObject {
  posX: number;
  posY: number;
  velocity: Vector2D;
  mass: number;
  gravity: number;
  isJumping?: boolean;
  restitution?: number;
  friction?: number;
}

/**
 * Collision detection configuration
 */
export interface CollisionConfig {
  spatial: boolean;
  broadPhase: "naive" | "grid" | "quadtree";
  narrowPhase: "aabb" | "sat" | "gjk";
}

/**
 * Collision rectangle
 */
export interface CollisionRect {
  posX: number;
  posY: number;
  width: number;
  height: number;
}

/**
 * Collision circle
 */
export interface CollisionCircle {
  x: number;
  y: number;
  radius: number;
}

/**
 * Collision result
 */
export interface CollisionResult {
  collided: boolean;
  normal?: Vector2D;
  penetration?: number;
  contactPoint?: Vector2D;
}

/**
 * Renderer configuration
 */
export interface RenderConfig {
  clearColor?: Color;
  autoClear?: boolean;
  preserveDrawingBuffer?: boolean;
  alpha?: boolean;
  antialias?: boolean;
}

/**
 * Camera configuration
 */
export interface CameraConfig {
  smoothFactor?: number;
  levelWidth?: number;
  levelHeight?: number;
  bounds?: Bounds;
  deadZone?: Bounds;
}

/**
 * Camera target
 */
export interface CameraTarget {
  posX: number;
  posY?: number;
}

/**
 * Parallax layer configuration
 */
export interface ParallaxLayer {
  image: HTMLImageElement;
  speed: number;
  y: number;
  x?: number;
  width?: number;
  height?: number;
  repeat?: boolean;
}

/**
 * Particle system configuration
 */
export interface ParticleSystemConfig {
  colors?: string[];
  maxParticles?: number;
  emissionRate?: number;
  particleLife?: number;
  particleSize?: number;
  gravity?: number;
}

/**
 * Particle configuration
 */
export interface ParticleConfig {
  x: number;
  y: number;
  color: string;
  velocity?: Vector2D;
  size: number;
  life: number;
  initialLife?: number;
  gravity?: number;
}

/**
 * Explosion data
 */
export interface ExplosionData {
  x: number;
  y: number;
  color?: string;
  count?: number;
  velocity?: number;
  spread?: number;
}

/**
 * Input configuration
 */
export interface InputConfig {
  preventDefaultKeys?: string[];
  canvas?: HTMLCanvasElement;
  enableTouch?: boolean;
  enableGamepad?: boolean;
}

/**
 * Input state
 */
export interface InputState {
  keys: Map<string, boolean>;
  mouse: {
    x: number;
    y: number;
    buttons: Map<number, boolean>;
    isDown: boolean;
  };
  touches?: Map<number, { x: number; y: number }>;
}

/**
 * Drag controller configuration
 */
export interface DragConfig {
  canvas?: HTMLCanvasElement;
  graphics?: number;
  enableSnapping?: boolean;
  snapGridSize?: number;
  constrainToBounds?: boolean;
  bounds?: Bounds;
}

/**
 * Draggable object interface
 */
export interface Draggable {
  posX: number;
  posY: number;
  isPointInside?: (x: number, y: number) => boolean;
  onDragStart?: () => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: () => void;
}

/**
 * Audio configuration
 */
export interface AudioConfig {
  masterVolume?: number;
  sfxVolume?: number;
  musicVolume?: number;
  maxSounds?: number;
}

/**
 * Sound options
 */
export interface SoundOptions {
  volume?: number;
  loop?: boolean;
  playbackRate?: number;
  fadeIn?: number;
  fadeOut?: number;
}

/**
 * Scene configuration
 */
export interface SceneConfig {
  name: string;
  preload?: () => Promise<void>;
  create?: () => void;
  update?: (deltaTime: number) => void;
  destroy?: () => void;
}

/**
 * Game loop configuration
 */
export interface GameLoopConfig {
  targetFPS?: number;
  maxDeltaTime?: number;
  autoStart?: boolean;
  fixedTimeStep?: boolean;
}

/**
 * Canvas configuration
 */
export interface CanvasConfig {
  width: number;
  height: number;
  graphics?: number;
  backgroundColor?: Color;
  appendToBody?: boolean;
  center?: boolean;
  borderRadius?: string;
  fullscreen?: boolean;
  pixelated?: boolean;
}

/**
 * Asset loader configuration
 */
export interface AssetLoaderConfig {
  baseUrl?: string;
  crossOrigin?: string;
  retryAttempts?: number;
  timeout?: number;
}

/**
 * Graphics cache configuration
 */
export interface GraphicsCacheConfig {
  maxGradients?: number;
  maxPatterns?: number;
  autoClear?: boolean;
}

/**
 * Gradient type
 */
export type GradientType = "linear" | "radial";

/**
 * Pattern repetition
 */
export type PatternRepetition = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";

/**
 * Gradient color stop
 */
export interface GradientColorStop {
  position: number;
  color: string;
}

/**
 * Linear gradient coordinates
 */
export interface LinearGradientCoordinates {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Radial gradient coordinates
 */
export interface RadialGradientCoordinates {
  x0: number;
  y0: number;
  r0: number;
  x1: number;
  y1: number;
  r1: number;
}

/**
 * Transform matrix
 */
export interface TransformMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

/**
 * Scene manager configuration
 */
export interface SceneManagerConfig {
  initialScene?: string;
  transitionDuration?: number;
  transitionType?: "fade" | "slide" | "none";
}
