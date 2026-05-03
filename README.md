# Kunoichi: The Last Tile

A responsive, web-based Mahjong Solitaire game built with Vue 3, Vite, and TypeScript. Featuring a retro-techno aesthetic, dynamic backgrounds, and multiple playable layouts.

## Features

- **Brand Experience**: Features a fully integrated MP4 intro video establishing the "Fool Enterprises" gaming universe, seamlessly fading into the main game UI.
- **Multiple Layouts**: Custom dropdown menu (using Vue `<Teleport>`) to choose between "Classic Turtle", "Deep Well", and "Eight Stacks" tile formations.
- **Persistent Save States**: Games are automatically saved to `localStorage`. If you leave the page or refresh, a "Resume Game" prompt allows you to pick up exactly where you left off.
- **Deadlock Detection**: The game proactively detects when no valid moves remain, immediately presenting a custom "DEADLOCK DETECTED" cyberpunk overlay so you don't waste time searching.
- **Immersive Audio Engine**: Dynamic background music system featuring a custom YouTube-style slide-out control panel with a volume slider. The engine respects browser auto-play policies and seamlessly activates upon entering gameplay.
- **Interactive Settings Hub**: A central modal allowing players to curate their active music rotation playlist (featuring auto-extracted video thumbnails) and view game options.
- **Accessibility & Keyboard Support**: Full keyboard shortcut integration for rapid play—Undo (`Ctrl+Z`), Hint (`H`), and menu navigation (`Esc`). 
- **Unified Navigation & Infinite Undo**: A responsive header featuring custom animated SVG icons for Hint, Restart, Menu controls, Options, and an Undo button that allows you to infinitely reverse previous moves to recover from mistakes. All buttons feature complex hover animations and monospace labeling for a polished user experience.
- **Tactile 3D Feedback**: Tiles physically "pop" up via Z-axis CSS transformations when selected, providing satisfying physical feedback.
- **Landscape-First Responsive Design**: The game board and all custom UI overlays (Settings, Confirm Modals, Audio Panel) scale dynamically to fit on any screen size. For mobile devices, it features a custom CSS orientation lock (`RotateDeviceOverlay`) that forces the game into landscape mode for optimal playability.
- **Dynamic Backgrounds**: Context-aware dynamic backgrounds feature advanced pure CSS masking effects (like a 7-ring water ripple on the start screen and soft-beveled video masks).
- **State Management**: Robust state handling powered by Pinia, managing tile visibility, matching logic, audio playlists, and history trackers.

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Styling**: Pure CSS (CSS variables, dynamic scaling, flexbox layouts, mask images)

## Local Development

### Prerequisites

- Node.js (version 18+ recommended)
- npm or yarn

### Installation

1. Clone or download the repository.
2. Navigate to the project directory:
   ```bash
   cd mahjong-vue
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173/`.

### Building for Production

To build the application for production deployment:

```bash
npm run build
```

The optimized files will be generated in the `dist` directory. You can preview the production build locally by running:

```bash
npm run preview
```

## Project Structure

- `/src/components/`: Vue UI components (`GameBoard.vue`, `StartScreen.vue`, `Tile.vue`, etc.)
- `/src/stores/`: Pinia store (`gameStore.ts`) handling game logic and state.
- `/src/types/`: TypeScript type definitions for the game context.
- `/src/utils/`: Helper functions for tile shuffling, hint calculation, and coordinate layout mapping.
- `/src/composables/`: Reusable Vue composables for things like window resizing logic and dynamic background selection.
- `/public/`: Static assets like images and fonts.
