/**
 * Manages caching of gradients and patterns for improved performance.
 * Prevents recreation of the same graphics resources multiple times.
 */

export type GradientType = "linear" | "radial";
export type PatternRepetition = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";

export interface GradientColorStop {
  position: number;
  color: string;
}

export interface LinearGradientCoordinates {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface RadialGradientCoordinates {
  x0: number;
  y0: number;
  r0: number;
  x1: number;
  y1: number;
  r1: number;
}

export class GraphicsCache {
  private gradientCache = new Map<string, CanvasGradient>();
  private patternCache = new Map<string, CanvasPattern>();
  private ctx: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
  }

  /**
   * Creates or retrieves a cached linear gradient.
   * @param key - Unique identifier for the gradient
   * @param colorStops - Array of color stops [position, color]
   * @param coordinates - Start and end coordinates [x0, y0, x1, y1]
   * @returns CanvasGradient
   */
  createLinearGradient(
    key: string,
    colorStops: GradientColorStop[],
    coordinates: LinearGradientCoordinates
  ): CanvasGradient {
    if (this.gradientCache.has(key)) {
      return this.gradientCache.get(key)!;
    }

    const gradient = this.ctx.createLinearGradient(
      coordinates.x0,
      coordinates.y0,
      coordinates.x1,
      coordinates.y1
    );

    colorStops.forEach(({ position, color }) => {
      gradient.addColorStop(position, color);
    });

    this.gradientCache.set(key, gradient);
    return gradient;
  }

  /**
   * Creates or retrieves a cached radial gradient.
   * @param key - Unique identifier for the gradient
   * @param colorStops - Array of color stops [position, color]
   * @param coordinates - Circle coordinates [x0, y0, r0, x1, y1, r1]
   * @returns CanvasGradient
   */
  createRadialGradient(
    key: string,
    colorStops: GradientColorStop[],
    coordinates: RadialGradientCoordinates
  ): CanvasGradient {
    if (this.gradientCache.has(key)) {
      return this.gradientCache.get(key)!;
    }

    const gradient = this.ctx.createRadialGradient(
      coordinates.x0,
      coordinates.y0,
      coordinates.r0,
      coordinates.x1,
      coordinates.y1,
      coordinates.r1
    );

    colorStops.forEach(({ position, color }) => {
      gradient.addColorStop(position, color);
    });

    this.gradientCache.set(key, gradient);
    return gradient;
  }

  /**
   * Generic gradient creation that supports both linear and radial types.
   * @param key - Unique identifier for the gradient
   * @param colorStops - Array of color stops
   * @param type - 'linear' or 'radial'
   * @param coordinates - Coordinates based on gradient type
   * @returns CanvasGradient
   */
  createGradient(
    key: string,
    colorStops: GradientColorStop[],
    type: GradientType = "linear",
    coordinates: LinearGradientCoordinates | RadialGradientCoordinates
  ): CanvasGradient {
    if (type === "linear") {
      return this.createLinearGradient(key, colorStops, coordinates as LinearGradientCoordinates);
    } else if (type === "radial") {
      return this.createRadialGradient(key, colorStops, coordinates as RadialGradientCoordinates);
    } else {
      throw new Error(`Invalid gradient type: ${type}. Use 'linear' or 'radial'.`);
    }
  }

  /**
   * Creates or retrieves a cached pattern from an image.
   * @param image - HTMLImageElement to use as pattern
   * @param repetition - Pattern repetition mode
   * @returns CanvasPattern or null
   */
  createPattern(
    image: HTMLImageElement,
    repetition: PatternRepetition = "repeat"
  ): CanvasPattern | null {
    const cacheKey = `${image.src}-${repetition}`;

    if (this.patternCache.has(cacheKey)) {
      return this.patternCache.get(cacheKey)!;
    }

    const pattern = this.ctx.createPattern(image, repetition);
    if (pattern) {
      this.patternCache.set(cacheKey, pattern);
    }
    return pattern;
  }

  /**
   * Async version that loads image and creates pattern.
   * @param imageSrc - Image source URL
   * @param repetition - Pattern repetition mode
   * @param imageLoader - Function to load images
   * @returns Promise<CanvasPattern | null>
   */
  async createPatternFromSrc(
    imageSrc: string,
    repetition: PatternRepetition = "repeat",
    imageLoader: (src: string) => Promise<HTMLImageElement>
  ): Promise<CanvasPattern | null> {
    const cacheKey = `${imageSrc}-${repetition}`;

    if (this.patternCache.has(cacheKey)) {
      return this.patternCache.get(cacheKey)!;
    }

    const image = await imageLoader(imageSrc);
    return this.createPattern(image, repetition);
  }

  /**
   * Retrieves a cached gradient by key.
   * @param key - Gradient key
   * @returns CanvasGradient or undefined
   */
  getGradient(key: string): CanvasGradient | undefined {
    return this.gradientCache.get(key);
  }

  /**
   * Retrieves a cached pattern by key.
   * @param key - Pattern cache key (imageSrc-repetition)
   * @returns CanvasPattern or undefined
   */
  getPattern(key: string): CanvasPattern | undefined {
    return this.patternCache.get(key);
  }

  /**
   * Checks if a gradient exists in cache.
   * @param key - Gradient key
   * @returns boolean
   */
  hasGradient(key: string): boolean {
    return this.gradientCache.has(key);
  }

  /**
   * Checks if a pattern exists in cache.
   * @param key - Pattern cache key
   * @returns boolean
   */
  hasPattern(key: string): boolean {
    return this.patternCache.has(key);
  }

  /**
   * Clears all cached gradients.
   */
  clearGradients(): void {
    this.gradientCache.clear();
  }

  /**
   * Clears all cached patterns.
   */
  clearPatterns(): void {
    this.patternCache.clear();
  }

  /**
   * Clears all graphics caches.
   */
  clearAll(): void {
    this.gradientCache.clear();
    this.patternCache.clear();
  }

  /**
   * Returns the number of cached gradients.
   */
  get gradientCount(): number {
    return this.gradientCache.size;
  }

  /**
   * Returns the number of cached patterns.
   */
  get patternCount(): number {
    return this.patternCache.size;
  }
}

// Singleton instance (optional - can be created per Canvas instance instead)
let graphicsCacheInstance: GraphicsCache | null = null;

export function getGraphicsCache(ctx: CanvasRenderingContext2D): GraphicsCache {
  if (!graphicsCacheInstance) {
    graphicsCacheInstance = new GraphicsCache(ctx);
  }
  return graphicsCacheInstance;
}

export function resetGraphicsCache(): void {
  if (graphicsCacheInstance) {
    graphicsCacheInstance.clearAll();
    graphicsCacheInstance = null;
  }
}
