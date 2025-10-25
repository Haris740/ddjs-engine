export interface ParallaxLayer {
  image: HTMLImageElement;
  speed: number;
  y: number;
  x?: number;
  width?: number;
  height?: number;
}

export class ParallaxBackground {
  layers: ParallaxLayer[];

  constructor(layers: ParallaxLayer[]) {
    this.layers = layers.map((layer) => ({
      ...layer,
      x: 0,
      width: layer.image.width,
      height: layer.image.height,
    }));
  }

  /**
   * Update parallax positions based on camera movement
   */
  update(cameraX: number): void {
    this.layers.forEach((layer) => {
      // Update the position based on camera movement and layer speed
      layer.x = -cameraX * layer.speed;
    });
  }

  /**
   * Draw all parallax layers
   */
  draw(ctx: CanvasRenderingContext2D, canvasWidth: number): void {
    this.layers.forEach((layer) => {
      // Calculate how many times the image needs to be tiled
      const imageCount = Math.ceil(canvasWidth / layer.width!) + 2; // +2 to ensure coverage

      // Draw the image multiple times to create tiling effect
      for (let i = 0; i < imageCount; i++) {
        // Calculate the draw position
        const drawX = (layer.x! + i * layer.width!) % (layer.width! * imageCount);

        // Draw the image
        ctx.drawImage(layer.image, drawX, layer.y, layer.width!, layer.height!);
      }
    });
  }

  /**
   * Add a new layer to the parallax background
   */
  addLayer(layer: ParallaxLayer): void {
    this.layers.push({
      ...layer,
      x: 0,
      width: layer.image.width,
      height: layer.image.height,
    });
  }

  /**
   * Remove a layer by index
   */
  removeLayer(index: number): void {
    if (index >= 0 && index < this.layers.length) {
      this.layers.splice(index, 1);
    }
  }

  /**
   * Get layer count
   */
  getLayerCount(): number {
    return this.layers.length;
  }
}
