# Kunoichi: The Last Tile

A responsive, web-based Mahjong Solitaire game built with Vue 3, Vite, and TypeScript. Featuring a retro-techno aesthetic, dynamic backgrounds, and multiple playable layouts.

## Features

- **Multiple Layouts**: Play classic Mahjong formations including the traditional "Classic Turtle" layout.
- **Responsive Design**: The game board scales dynamically to fit perfectly on any screen size—from ultrawide desktop monitors down to mobile devices—without breaking the layout or requiring scrolling.
- **Dynamic Backgrounds**: The game features context-aware dynamic backgrounds with advanced pure CSS masking effects (like the 7-ring water ripple on the start screen).
- **Game State Management**: Robust state handling powered by Pinia, managing tile visibility, matching logic, and hint systems.
- **Hint System**: Built-in hint system to help you find available moves when you're stuck.

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
