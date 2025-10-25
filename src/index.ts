/**
 * DDJS Engine - Main Entry Point
 *
 * A modular 2D game engine built with TypeScript
 *
 * @author Haris P (MM_Chessman)
 * @version 2.0.0
 * @license MIT
 */

// ============================================================================
// CORE MODULES
// ============================================================================

import {
  Canvas,
  GameLoop,
  AssetLoader,
  GraphicsCache,
  getGraphicsCache,
  resetGraphicsCache,
  DDJSEngine,
} from "./core/index.js";

export {
  Canvas,
  GameLoop,
  AssetLoader,
  GraphicsCache,
  getGraphicsCache,
  resetGraphicsCache,
  DDJSEngine,
};

export type {
  GradientType,
  PatternRepetition,
  GradientColorStop,
  LinearGradientCoordinates,
  RadialGradientCoordinates,
} from "./core/GraphicsCache.js";

// ============================================================================
// ENTITIES
// ============================================================================

// Shapes
import { Rect, Circle, EqTriangle } from "./entities/shapes/index.js";

export { Rect, Circle, EqTriangle };

export type { RectOptions, CircleOptions, TriangleOptions } from "./entities/shapes/index.js";

// Text
import { Text } from "./entities/Text.js";
export { Text };
export type { TextOptions } from "./entities/Text.js";

// ============================================================================
// SYSTEMS
// ============================================================================

// Physics System
import { Physics, Collision } from "./systems/physics/index.js";

export { Physics, Collision };

export type {
  PhysicsObject,
  PhysicsConfig,
  CollisionRect,
  CollisionCircle,
} from "./systems/physics/index.js";

// Rendering System
import { Camera, ParallaxBackground, Renderer } from "./systems/rendering/index.js";

export { Camera, ParallaxBackground, Renderer };

export type {
  CameraTarget,
  CameraConfig,
  ParallaxLayer,
  RenderConfig,
} from "./systems/rendering/index.js";

// Particle System
import { ParticleSystem, Particle } from "./systems/particles/index.js";

export { ParticleSystem, Particle };

export type {
  ParticleConfig,
  ExplosionData,
  ParticleSystemConfig,
} from "./systems/particles/index.js";

// ============================================================================
// INPUT
// ============================================================================

import { InputManager, DragController } from "./input/index.js";

export { InputManager, DragController };

export type { InputState, InputConfig, Draggable, DragConfig } from "./input/index.js";

// ============================================================================
// UTILITIES
// ============================================================================

// Math utilities
import { MathUtils, Vector2 } from "./utils/Math.js";

export { MathUtils, Vector2 };

// Transform utilities
import {
  Transform,
  applyTransform,
  resetTransform,
  saveState,
  restoreState,
} from "./utils/Transform.js";

export { Transform, applyTransform, resetTransform, saveState, restoreState };

export type { TransformMatrix } from "./utils/Transform.js";

// Drawing utilities
import { Drawing, drawLine, drawArc, drawText, measureText } from "./utils/Drawing.js";

export { Drawing, drawLine, drawArc, drawText, measureText };

// ============================================================================
// TYPES
// ============================================================================

// Re-export all types from types module
export type * from "./types/index.js";

// ============================================================================
// CONSTANTS AND VERSION INFO
// ============================================================================

/**
 * Engine version
 */
export const VERSION = "2.0.0";

/**
 * Engine name
 */
export const ENGINE_NAME = "DDJS";

/**
 * Full engine identifier
 */
export const ENGINE_INFO = `${ENGINE_NAME} v${VERSION}`;

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  canvas: {
    width: 800,
    height: 600,
    graphics: 1,
    backgroundColor: "white",
  },
  physics: {
    gravity: 0.3,
    friction: 0.98,
    airResistance: 0.99,
  },
  gameLoop: {
    targetFPS: 60,
    maxDeltaTime: 0.1,
  },
  input: {
    preventDefaultKeys: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "],
  },
} as const;

/**
 * Log engine info to console
 */
export function logEngineInfo(): void {
  console.log(
    `%c${ENGINE_INFO}%c - TypeScript 2D Game Engine`,
    "color: #00ff00; font-weight: bold; font-size: 16px;",
    "color: #888; font-size: 12px;"
  );
  console.log("%cDocumentation: https://github.com/your-repo/ddjs", "color: #0088ff;");
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Quick start helper - creates engine with default settings
 */
export function createEngine(
  width: number = DEFAULT_CONFIG.canvas.width,
  height: number = DEFAULT_CONFIG.canvas.height,
  graphics: number = DEFAULT_CONFIG.canvas.graphics
): DDJSEngine {
  const engine = new DDJSEngine(width, height, graphics);
  logEngineInfo();
  return engine;
}

/**
 * Check if browser supports required features
 */
export function checkBrowserSupport(): {
  canvas: boolean;
  webgl: boolean;
  localStorage: boolean;
  audioContext: boolean;
} {
  return {
    canvas: !!document.createElement("canvas").getContext("2d"),
    webgl: !!document.createElement("canvas").getContext("webgl"),
    localStorage: typeof Storage !== "undefined",
    audioContext:
      typeof AudioContext !== "undefined" ||
      typeof (window as any).webkitAudioContext !== "undefined",
  };
}

/**
 * Request fullscreen for canvas element
 */
export function requestFullscreen(canvas: HTMLCanvasElement): void {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if ((canvas as any).mozRequestFullScreen) {
    (canvas as any).mozRequestFullScreen();
  } else if ((canvas as any).webkitRequestFullscreen) {
    (canvas as any).webkitRequestFullscreen();
  } else if ((canvas as any).msRequestFullscreen) {
    (canvas as any).msRequestFullscreen();
  }
}

/**
 * Exit fullscreen
 */
export function exitFullscreen(): void {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    (document as any).mozCancelFullScreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) {
    (document as any).msExitFullscreen();
  }
}

/**
 * Check if currently in fullscreen
 */
export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).msFullscreenElement
  );
}

/**
 * Load multiple assets with progress tracking
 */
export async function loadAssets(
  assetLoader: AssetLoader,
  images: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<HTMLImageElement[]> {
  const total = images.length;
  let loaded = 0;

  const promises = images.map(async (src) => {
    const img = await assetLoader.loadImage(src);
    loaded++;
    if (onProgress) {
      onProgress(loaded, total);
    }
    return img;
  });

  return Promise.all(promises);
}

/**
 * Create a responsive canvas that fills the container
 */
export function createResponsiveCanvas(
  engine: DDJSEngine,
  containerSelector: string = "body"
): void {
  const canvas = engine.getCanvasElement();
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.warn(`Container ${containerSelector} not found`);
    return;
  }

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  };

  window.addEventListener("resize", resize);
  resize();
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

/**
 * Default export for convenience
 */
export default {
  VERSION,
  ENGINE_NAME,
  ENGINE_INFO,
  DEFAULT_CONFIG,
  DDJSEngine,
  Canvas,
  GameLoop,
  AssetLoader,
  GraphicsCache,
  Rect,
  Circle,
  EqTriangle,
  Text,
  Physics,
  Collision,
  Camera,
  ParallaxBackground,
  Renderer,
  ParticleSystem,
  Particle,
  InputManager,
  DragController,
  MathUtils,
  Vector2,
  Transform,
  Drawing,
  createEngine,
  checkBrowserSupport,
  requestFullscreen,
  exitFullscreen,
  isFullscreen,
  logEngineInfo,
};
