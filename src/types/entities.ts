/**
 * Entity-related type definitions
 * Includes shapes, sprites, and entity configurations
 */

import type { Vector2D, Color, Transform } from "./common.js";

/**
 * Base entity interface
 */
export interface Entity {
  id?: string;
  posX: number;
  posY: number;
  active: boolean;
  visible: boolean;
  layer?: number;
  tag?: string;
}

/**
 * Base shape features
 */
export interface ShapeFeatures {
  draggable?: boolean;
  gravity?: number;
  collidable?: boolean;
}

/**
 * Base shape options
 */
export interface ShapeOptions {
  posX?: number;
  posY?: number;
  color?: Color;
  alpha?: number;
  mass?: number;
  gravity?: number;
  restitution?: number;
  features?: ShapeFeatures;
}

/**
 * Rectangle-specific options
 */
export interface RectOptions extends ShapeOptions {
  width?: number;
  height?: number;
  borderRadius?: number;
}

/**
 * Circle-specific options
 */
export interface CircleOptions extends ShapeOptions {
  radius?: number;
  jumpStrength?: number;
}

/**
 * Triangle-specific options
 */
export interface TriangleOptions extends ShapeOptions {
  length?: number;
  jumpStrength?: number;
}

/**
 * Text rendering options
 */
export interface TextOptions {
  posX: number;
  posY: number;
  text: string;
  font: string;
  color: Color;
  alpha?: number;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  maxWidth?: number;
  lineHeight?: number;
}

/**
 * Sprite options
 */
export interface SpriteOptions {
  posX: number;
  posY: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  frameX?: number;
  frameY?: number;
  frameWidth?: number;
  frameHeight?: number;
}

/**
 * Physics body interface
 */
export interface PhysicsBody {
  velocity: Vector2D;
  acceleration: Vector2D;
  mass: number;
  friction: number;
  restitution: number;
  isStatic: boolean;
}

/**
 * Collider types
 */
export type ColliderType = "rect" | "circle" | "polygon" | "none";

/**
 * Collider interface
 */
export interface Collider {
  type: ColliderType;
  bounds: any; // Specific type depends on ColliderType
  isTrigger: boolean;
  layer: number;
}

/**
 * Entity with transform
 */
export interface TransformEntity extends Entity {
  transform: Transform;
}

/**
 * Entity with physics
 */
export interface PhysicsEntity extends Entity {
  physics: PhysicsBody;
  collider?: Collider;
}

/**
 * Animated sprite data
 */
export interface AnimatedSpriteData {
  spriteSheet: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  animations: Map<string, number[]>;
  currentAnimation?: string;
  currentFrame: number;
  frameTimer: number;
  frameRate: number;
}

/**
 * Particle data
 */
export interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: Color;
  alpha: number;
}

/**
 * Entity component interface
 */
export interface Component {
  name: string;
  init?: () => void;
  update?: (deltaTime: number) => void;
  destroy?: () => void;
}

/**
 * Entity with component system
 */
export interface ComponentEntity extends Entity {
  components: Map<string, Component>;
  addComponent(component: Component): void;
  removeComponent(name: string): void;
  getComponent<T extends Component>(name: string): T | undefined;
}
