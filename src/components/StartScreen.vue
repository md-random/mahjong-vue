<template>
    <div class="start-screen-container">
        
        <div class="hero-section">
            <img src="/img/ninja-bg.png" alt="Anime Ninja Mahjong Player" class="hero-image" />
        </div>

        <div class="controls-section">
            <div class="title-wrapper">
                <h1 class="title" data-text="Kunoichi: The Last Tile">Kunoichi: The Last Tile</h1>
            </div>
            <p class="subtitle" style="margin-bottom: min(2vh, 15px);">Select a layout and match the tiles to win!</p>

            <div class="layout-selector">
                <label for="layout-select">Choose Layout:</label>
                <select id="layout-select" v-model="selectedLayout" class="custom-select">
                    <option v-for="layout in availableLayouts" :key="layout" :value="layout">
                        {{ layout }}
                    </option>
                </select>
            </div>
            
            <button class="start-btn" @click="startGame">
                START GAME
            </button>
        </div>

        <div class="rules-section">
            <h2 class="how-to-play-link" @click="showRulesModal = true">How to Play</h2>
        </div>
    </div>

    <div class="rules-modal-overlay" v-if="showRulesModal" @click.self="showRulesModal = false">
        <div class="rules-modal">
            <h2>How to Play</h2>
            <div class="rules-content">
                <p><strong>Objective:</strong> Select two identical tiles to remove them. Once all tiles are removed, the game is won.</p>
                <p><strong>Valid Moves:</strong> Only <em>open</em> tiles can be selected. A tile is open if it is on top (not covered by any other tile) and at least one of its sides (left or right) is completely free.</p>
                <p><strong>Special Matches:</strong> There are 4 Seasons and 4 Flowers in the game. Any Season tile can match with any other Season tile, and any Flower tile can match with any other Flower tile. They do not have to be exactly identical.</p>
            </div>
            <button class="close-btn" @click="showRulesModal = false">CLOSE</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { LAYOUTS } from '../utils/coordinates';

const store = useGameStore();
const selectedLayout = ref('Classic Turtle');
const availableLayouts = Object.keys(LAYOUTS);
const showRulesModal = ref(false);

const startGame = () => {
    store.startGame(selectedLayout.value);
};
</script>

<style scoped>
.start-screen-container {
    display: flex;
    flex-direction: column;
    width: 95%; 
    max-width: 500px; 
    height: 95%;
    max-height: 850px;
    margin: auto;
    background: rgba(0, 5, 20, 0.85);
    border-radius: 12px;
    box-shadow: var(--neon-glow);
    overflow: hidden;
    border: 1px solid var(--tile-border-color);
}

.hero-section {
    position: relative;
    width: 100%;
    flex: 1 1 55%;
    min-height: 0;
    overflow: hidden;
    border-bottom: 2px solid var(--tile-border-color);
}

.hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    object-position: center 25%;
}

.title-wrapper {
    margin: 0 0 min(1vh, 5px) 0;
    padding-bottom: 8px;
    filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.6)) drop-shadow(0 2px 10px rgba(0, 150, 255, 0.8));
}

.title {
    margin: 0;
    padding: 0;
    font-size: clamp(14px, 5.5vw, 32px);
    line-height: 1.1;
    font-family: 'Orbitron', sans-serif;
    letter-spacing: 1px;
    position: relative;
    text-align: center;
    white-space: nowrap;
    
    background: linear-gradient(
        180deg,
        #ffffff 0%,
        #99ccff 30%,
        #00aaff 60%,
        #ccffff 80%,
        #ffffff 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    text-shadow: none;
}

.title::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    
    background: linear-gradient(
        110deg,
        transparent 10%,
        rgba(255, 255, 255, 0.6) 30%,
        rgba(255, 255, 255, 1) 40%,
        rgba(255, 255, 255, 0.6) 50%,
        transparent 70%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    
    animation: burningChromeGlisten 4s linear infinite;
}

@keyframes burningChromeGlisten {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
}

.subtitle {
    margin: 0;
    font-size: clamp(10px, 2vh, 16px);
    color: #fff;
}

.controls-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: min(2vh, 15px) 20px min(1.5vh, 10px) 20px;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
}

.layout-selector {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: min(2vh, 15px);
}

.layout-selector label {
    font-size: clamp(14px, 2.2vh, 16px);
    font-weight: bold;
}

.custom-select {
    padding: min(1.2vh, 10px) 15px;
    font-size: clamp(12px, 2vh, 14px);
    border-radius: 6px;
    background-color: var(--background-color);
    color: var(--font-color);
    border: 1px solid var(--tile-border-color);
    outline: none;
    font-family: inherit;
    cursor: pointer;
    box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.1);
}

.start-btn {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(13px, 2.4vh, 19px);
    padding: min(0.8vh, 8px) min(4.8vw, 32px);
    margin-top: min(2vh, 15px);
    border-radius: 30px;
    background-color: var(--button-color);
    color: var(--font-color);
    border: 1px solid var(--tile-border-color);
    font-weight: bold;
    cursor: pointer;
    box-shadow: var(--neon-glow);
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.start-btn:hover {
    transform: translateY(-2px);
    background-color: var(--button-hover-color);
    color: #fff;
    border-color: #fff;
    box-shadow: 0 0 20px rgba(0, 255, 255, 1), 0 0 40px rgba(0, 255, 255, 0.8);
    text-shadow: 0 0 4px #fff;
}

.start-btn:active {
    transform: translateY(1px);
}

.rules-section {
    padding: min(2vh, 15px) 20px;
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
}

.rules-section h2 {
    margin-top: 0;
    color: var(--tile-alert-color);
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: min(0.8vh, 8px);
    font-size: clamp(12px, 2vh, 18px);
    margin-bottom: min(0.8vh, 8px);
}

.how-to-play-link {
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    align-self: center;
}

.how-to-play-link:hover {
    text-shadow: 0 0 10px var(--tile-alert-color);
    transform: scale(1.05);
}

.rules-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.rules-modal {
    background: rgba(0, 5, 20, 0.95);
    border: 1px solid var(--tile-alert-color);
    border-radius: 12px;
    padding: 30px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 0 30px rgba(255, 255, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.rules-modal h2 {
    color: var(--tile-alert-color);
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 24px;
    text-align: center;
    text-shadow: 0 0 5px rgba(255, 255, 0, 0.5);
    border-bottom: 1px solid var(--tile-alert-color);
    padding-bottom: 10px;
    width: 100%;
}

.rules-content {
    color: #fff;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 25px;
    text-align: left;
}

.rules-content p {
    margin-bottom: 15px;
}

.rules-content strong {
    color: var(--font-color);
}

.rules-content em {
    color: var(--tile-alert-color);
    font-style: normal;
}

.close-btn {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    padding: 10px 30px;
    border-radius: 20px;
    background-color: transparent;
    color: var(--tile-alert-color);
    border: 1px solid var(--tile-alert-color);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.close-btn:hover {
    background-color: var(--tile-alert-color);
    color: #000;
    box-shadow: 0 0 15px var(--tile-alert-color);
}

@media (max-width: 600px) {
    .layout-selector {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        margin-bottom: min(1.5vh, 10px);
        gap: 8px;
    }
    
    .custom-select {
        width: 100%;
    }

    .start-btn {
        width: 100%;
    }
    
    .rules-section {
        padding: min(1.5vh, 10px) 15px;
    }
}
</style>
