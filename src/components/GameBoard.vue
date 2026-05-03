<template>
    <section id="game" v-if="store.tilesState.length > 0">
        <template v-for="(tile, index) in store.tilesState" :key="index">
            <div v-if="!tile.hidden" class="tile" :class="{ 'match-anim': tile.animating }" :style="getTileStyle(tile)" :data-coord="tile.coord.toString()">
                <div class="tileBack"></div>
                <div 
                    class="tileFront" 
                    :class="{ 
                        selectedTile: tile.selected, 
                        alertTile: tile.alerted,
                        open: tile.isOpen
                    }"
                    @click="onClickTile(tile)"
                >
                    <img :src="tile.tileData.src" alt="Mahjong Tile" />
                </div>
            </div>
        </template>

        <div v-if="['win', 'deadlock'].includes(store.gameState)" class="win-fail-overlay">
            <div class="overlay-content">
                <h1 v-if="store.gameState === 'win'" class="overlay-title win-title">MISSION ACCOMPLISHED</h1>
                <h1 v-if="store.gameState === 'deadlock'" class="overlay-title fail-title">DEADLOCK DETECTED</h1>
                <button class="overlay-btn" @click="store.restartGame">RESTART SIMULATION</button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';
import type { TileState } from '../types/game';

const store = useGameStore();

const TILE_WIDTH = 56;
const TILE_HEIGHT = 80;
const TILE_DEPTH = 7;
const TOTAL_OFFSET_TOP = 16;
const TOTAL_OFFSET_LEFT = 66;

const getTileStyle = (tileState: TileState) => {
    const [x, y, z] = tileState.coord;
    return {
        left: `${x * TILE_WIDTH + TILE_DEPTH * z + TOTAL_OFFSET_LEFT}px`,
        top: `${y * TILE_HEIGHT + TILE_DEPTH * z + TOTAL_OFFSET_TOP}px`,
        zIndex: z,
        filter: `drop-shadow(-${4 + z * 3}px ${4 + z * 3}px ${4 + z * 2}px rgba(0, 0, 0, ${0.5 + z * 0.1}))`
    };
};

const onClickTile = (tileState: TileState) => {
    if (tileState.isOpen && !tileState.hidden) {
         store.selectTileAt(tileState.coord);
    }
};
</script>

<style scoped>
#game {
    height: var(--base-height);
    background: transparent;
    position: relative;
    border-radius: 5px;
    transition: opacity 0.5s ease;
}

.tile {
    position: absolute;
}

.tileFront {
    position: absolute;
    width: 56px;
    height: 80px;
    border-radius: 7px;
    background-image: linear-gradient(
        to left top,
        var(--tile-bottom-right-color),
        var(--tile-top-left-color)
    );
    border: 1px solid var(--tile-border-color);
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.tileFront.open:hover {
    cursor: pointer;
    background-image: linear-gradient(
        to left top,
        var(--tile-hover-color),
        var(--tile-hover-color)
    );
    box-shadow: var(--neon-glow);
    border-color: #fff;
}

.selectedTile {
    background-image: linear-gradient(
        to left top,
        var(--tile-hover-color),
        var(--tile-hover-color)
    );
    box-shadow: var(--neon-glow-magenta);
    border-color: #fff;
    transform: translateY(-8px) scale(1.05);
    z-index: 100;
}

.alertTile {
    background-image: linear-gradient(
        to left top,
        var(--tile-alert-color),
        var(--tile-alert-color)
    );
    box-shadow: 0 0 15px var(--tile-alert-color), inset 0 0 20px var(--tile-alert-color);
    border-color: #fff;
}

.tileBack {
    position: absolute;
    width: 63px;
    height: 87px;
    top: -7px;
    left: -7px;
    border-radius: 7px 14px 7px 14px;
    background-color: var(--tile-back-color);
    border: 1px solid var(--tile-border-color);
}

.tile img {
    width: 100%;
    height: 100%;
}

.win-fail-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 5, 15, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    border-radius: 5px;
    animation: fadeIn 0.5s ease-out forwards;
}

.overlay-content {
    text-align: center;
    padding: 40px;
    border: 2px solid #00ccff;
    background: rgba(0, 20, 40, 0.9);
    box-shadow: 0 0 30px rgba(0, 204, 255, 0.4), inset 0 0 20px rgba(0, 204, 255, 0.2);
    border-radius: 10px;
}

.overlay-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(24px, 4vw, 42px);
    margin: 0 0 30px 0;
    letter-spacing: 4px;
    text-shadow: 0 0 10px currentColor;
}

.win-title {
    color: #00ffcc;
}

.fail-title {
    color: #ff0055;
}

.overlay-btn {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    font-weight: bold;
    padding: 12px 30px;
    background: transparent;
    color: #00ccff;
    border: 1px solid #00ccff;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.2);
}

.overlay-btn:hover {
    background: rgba(0, 204, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 204, 255, 0.6);
    transform: scale(1.05);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.match-anim {
    animation: cyberGlitch 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important;
    z-index: 500 !important;
    pointer-events: none;
}

@keyframes cyberGlitch {
    0% {
        transform: scale(1);
        filter: brightness(1);
        opacity: 1;
    }
    20% {
        transform: scale(1.15) translateY(-10px);
        filter: brightness(1.5) drop-shadow(0 0 15px #00ffff) hue-rotate(90deg);
        opacity: 1;
    }
    40% {
        transform: scale(1.1) translateY(-10px) skewX(10deg);
        filter: brightness(2) drop-shadow(0 0 30px #00ffff);
        opacity: 0.8;
    }
    60% {
        transform: scale(1.2) translateY(-10px) skewX(-10deg);
        filter: brightness(1.5) drop-shadow(0 0 20px #ff00ff) hue-rotate(-90deg);
        opacity: 0.5;
    }
    100% {
        transform: scale(0.1) translateY(-30px);
        filter: brightness(3) drop-shadow(0 0 50px #ffffff);
        opacity: 0;
    }
}
</style>
