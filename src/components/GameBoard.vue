<template>
    <section id="game" v-if="store.tilesState.length > 0">
        <template v-for="(tile, index) in store.tilesState" :key="index">
            <div v-show="!tile.hidden" class="tile" :style="getTileStyle(tile)" :data-coord="tile.coord.toString()">
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
</style>
