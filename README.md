# DDJS Engine v2.0

A modular 2D game engine built with TypeScript for HTML5 Canvas games.

## Features

- 🎮 Complete physics system with gravity and collisions
- 🎨 Particle effects system
- 📹 Smooth camera with following
- ⌨️ Input management (keyboard, mouse, touch)
- 🎯 Drag and drop support
- 📦 Modular architecture
- 📝 Full TypeScript support
- 🎨 Graphics caching for performance

## Installation

`npm install ddjs-engine`

## Quick Start

```TypeScript 
import { DDJSEngine, Rect } from 'ddjs-engine';

const engine = new DDJSEngine({
    width: 800,
    height: 600,
    existingCanvas: "gameCanvas"
});

engine.init();

const ctx = engine.getContext();
const player = new Rect(
    { posX: 100, posY: 100, width: 50, height: 50, color: "blue" },
    ctx,
    1,
    600
);

engine.start((deltaTime) => {
    player.update();
});
```

## Documentation

[Full documentation](./docs/README.md)

## Examples

See the `examples/` directory for complete game examples.

## License

MIT