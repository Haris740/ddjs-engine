/**
 * Asset loading and caching system
 * Handles images, fonts, and other resources
 */

export class AssetLoader {
  private imageCache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();
  private fontCache = new Set<string>();

  /**
   * Load a single image
   * @param src - Image source URL
   * @returns Promise resolving to the loaded image
   */
  async loadImage(src: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src)!;
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Create new loading promise
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.imageCache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };

      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  /**
   * Preload multiple images
   * @param srcs - Array of image source URLs
   * @returns Promise resolving to array of loaded images
   */
  async preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(srcs.map((src) => this.loadImage(src)));
  }

  /**
   * Get a cached image
   * @param src - Image source URL
   * @returns Cached image or undefined
   */
  getImage(src: string): HTMLImageElement | undefined {
    return this.imageCache.get(src);
  }

  /**
   * Check if an image is cached
   * @param src - Image source URL
   * @returns true if cached
   */
  hasImage(src: string): boolean {
    return this.imageCache.has(src);
  }

  /**
   * Load a custom font
   * @param fontFamily - Font family name
   * @param fontUrl - URL to font file
   * @param fontWeight - Font weight (default: 400)
   * @param fontStyle - Font style (default: normal)
   */
  async loadFont(
    fontFamily: string,
    fontUrl: string,
    fontWeight: number | string = 400,
    fontStyle: string = "normal"
  ): Promise<void> {
    const fontKey = `${fontFamily}-${fontWeight}-${fontStyle}`;

    if (this.fontCache.has(fontKey)) {
      return;
    }

    const fontFace = new FontFace(fontFamily, `url(${fontUrl})`, {
      weight: fontWeight.toString(),
      style: fontStyle,
    });

    try {
      const loadedFont = await fontFace.load();
      (document.fonts as any).add(loadedFont);
      this.fontCache.add(fontKey);
    } catch (error) {
      throw new Error(`Failed to load font: ${fontFamily} from ${fontUrl}`);
    }
  }

  /**
   * Check if a font is loaded
   * @param fontFamily - Font family name
   * @returns true if loaded
   */
  hasFont(fontFamily: string): boolean {
    return this.fontCache.has(fontFamily);
  }

  /**
   * Clear image cache
   */
  clearImageCache(): void {
    this.imageCache.clear();
    this.loadingPromises.clear();
  }

  /**
   * Clear font cache
   */
  clearFontCache(): void {
    this.fontCache.clear();
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.clearImageCache();
    this.clearFontCache();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    imagesLoaded: number;
    imagesLoading: number;
    fontsLoaded: number;
  } {
    return {
      imagesLoaded: this.imageCache.size,
      imagesLoading: this.loadingPromises.size,
      fontsLoaded: this.fontCache.size,
    };
  }
}
