/**
 * Core type definitions for canvas and game loop configuration
 */

export interface CanvasConfig {
  width: number;
  height: number;
  graphics?: number;
  backgroundColor?: string;
  appendToBody?: boolean;
  center?: boolean;
  borderRadius?: string;
}

export interface GameLoopConfig {
  targetFPS?: number;
  maxDeltaTime?: number;
  autoStart?: boolean;
}

export interface TransformMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export type GameState = "menu" | "playing" | "paused" | "gameOver";
