# Developer Architecture Guide

**Kunoichi: The Last Tile** is a Vue 3 Composition API application that uses Pinia for centralized state management. The app avoids heavy game engines (like Canvas or WebGL) and relies entirely on reactive DOM elements and CSS positioning.

### Core Architecture

1. **State Management (`stores/gameStore.ts`)**
   - The absolute source of truth.
   - Generates the board array (`tilesState`) when a layout is selected. Each tile is an object containing its 3D coordinate `[x, y, z]`, its `TileData` (type, group), and boolean states (`selected`, `hidden`, `isOpen`, `alerted`).
   - Handles the core matching logic (`executeMove`), click handling (`selectTileAt`), and the hint engine (`triggerHint`).

2. **Coordinate System & Layouts (`utils/coordinates.ts`)**
   - Mahjong layouts are defined as arrays of `[x, y, z]` coordinates.
   - `x` and `y` represent a 2D grid where distance is measured in "tile widths/heights". (e.g., coordinates like `1.5` mean the tile sits halfway between the standard grid slots).
   - `z` represents the layer height (stacking).
   - The `isOpen()` function mathematically calculates whether a tile is clickable by iterating through the current game state array and checking distance tolerances:
     - **Top Blockage**: A tile is blocked from above if any other tile exists at a higher `z` index where both the `x` and `y` center-distance is `< 1.0` tile width.
     - **Side Blockage**: A tile is blocked on its left/right if another tile exists on the _same_ `z` index, overlaps vertically (`Math.abs(y - oy) < 1.0`), and is positioned exactly adjacent horizontally (distance `<= 1.0` tile width).
     - **Result**: The function returns `true` only if the tile has no top blockage AND is free on at least one side (left or right).

3. **Rendering & Positioning (`components/Tile.vue`)**
   - The `GameBoard.vue` loops over `store.tilesState` and renders `<Tile>` components.
   - `Tile.vue` translates its logical `[x, y, z]` coordinates into absolute pixel coordinates (`top`, `left`, `z-index`) on the screen using a locked `TILE_WIDTH` and `TILE_HEIGHT`. CSS `transform` is used to give the stacked 3D illusion.
   - Tile faces are rendered using `background-position` to map specific tile types (Dots, Bamboos, Dragons) to coordinates on the master `mahjong-tiles.webp` sprite sheet (`utils/images.ts`).

4. **Responsive Scaling (`composables/useWindowResize.ts`)**
   - The game board is mathematically locked to a 1000x700 working area.
   - `useWindowResize` calculates an `appScale` multiplier by comparing the browser's viewport dimensions against the locked 1000x700 box.
   - `App.vue` applies `transform: scale(appScale)` to a wrapper div. This guarantees the complex 3D tile layout never breaks, visually shrinking or growing perfectly to fit any device monitor without using complex CSS media queries for the game pieces.

5. **Dynamic Visuals**
   - `useDynamicBackground.ts` watches the chosen layout and dynamically changes the background layer image.
   - `PondRipple.vue` uses pure CSS keyframe animations and mask images to overlay animated elements securely onto the main grid background without JavaScript requestAnimationFrame loops.
