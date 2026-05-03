<template>
    <div class="start-screen-container">
        
        <div class="mute-toggle-btn" @click="audioStore.toggleMute" title="Toggle Mute">
            <svg v-if="audioStore.isMuted" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/></svg>
            <svg v-else viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/></svg>
        </div>

        <div class="hero-section">
            <img src="/img/ninja-bg.png" alt="Anime Ninja Mahjong Player" class="hero-image" />
        </div>

        <div class="controls-section">
            <div class="title-wrapper">
                <h1 class="title" data-text="Kunoichi: The Last Tile">Kunoichi: The Last Tile</h1>
            </div>
            <p class="subtitle" style="margin-bottom: min(2vh, 15px);">Select a layout and match the tiles to win!</p>

            <div class="layout-selector">
                <label>Choose Layout:</label>
                <div class="custom-dropdown" @click="toggleDropdown" ref="dropdownRef">
                    <div class="dropdown-selected">
                        {{ selectedLayout }}
                        <span class="chevron" :class="{ 'chevron-up': isDropdownOpen }">▼</span>
                    </div>
                </div>
            </div>
            
            <div class="button-group">
                <button v-if="store.hasSavedGame" class="start-btn resume-btn" @click="store.resumeGame()">
                    RESUME GAME
                </button>
                <button class="start-btn" @click="startGame">
                    START NEW GAME
                </button>
            </div>
        </div>

        <div class="rules-section">
            <h2 class="how-to-play-link" @click="showRulesModal = true">How to Play</h2>
        </div>
    </div>

    <Teleport to="body">
        <div class="dropdown-overlay" v-if="isDropdownOpen" @click="closeDropdown"></div>
        <Transition name="dropdown-fade">
            <ul v-if="isDropdownOpen" class="dropdown-options teleported-options" :style="dropdownStyle">
                <li 
                    v-for="layout in availableLayouts" 
                    :key="layout" 
                    class="dropdown-option"
                    :class="{ 'active': layout === selectedLayout }"
                    @click.stop="selectLayout(layout)"
                >
                    {{ layout }}
                </li>
            </ul>
        </Transition>
    </Teleport>

    <div class="rules-modal-overlay" v-if="showRulesModal" @click.self="showRulesModal = false">
        <div class="rules-modal">
            <h2>How to Play</h2>
            <div class="rules-content">
                <p><strong>Objective:</strong> Select two identical tiles to remove them. Once all tiles are removed, the game is won.</p>
                <p><strong>Valid Moves:</strong> Only <em>open</em> tiles can be selected. A tile is open if it is on top (not covered by any other tile) and at least one of its sides (left or right) is completely free.</p>
                <p><strong>Special Matches:</strong> There are 4 Seasons and 4 Flowers in the game. Any Season tile can match with any other Season tile, and any Flower tile can match with any other Flower tile. They do not have to be exactly identical.</p>
                <p><strong>Undo Mistakes:</strong> Click the Yin/Yang symbol at the top of the screen to reverse time and undo your last move. You can undo as many times as you like!</p>
            </div>
            <button class="close-btn" @click="showRulesModal = false">CLOSE</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { useAudioStore } from '../stores/audioStore';
import { LAYOUTS } from '../utils/coordinates';

const store = useGameStore();
const audioStore = useAudioStore();
const selectedLayout = ref('Classic Turtle');
const availableLayouts = Object.keys(LAYOUTS);
const showRulesModal = ref(false);
const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({ top: '0px', left: '0px', width: '0px' });

const closeDropdown = () => {
    isDropdownOpen.value = false;
    window.removeEventListener('resize', updateDropdownPosition);
    window.removeEventListener('scroll', updateDropdownPosition, true);
};

const toggleDropdown = () => {
    if (isDropdownOpen.value) {
        closeDropdown();
    } else {
        isDropdownOpen.value = true;
        updateDropdownPosition();
        window.addEventListener('resize', updateDropdownPosition);
        window.addEventListener('scroll', updateDropdownPosition, true);
    }
};

const updateDropdownPosition = () => {
    if (dropdownRef.value) {
        const rect = dropdownRef.value.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownMaxHeight = 260;

        if (spaceBelow < dropdownMaxHeight && rect.top > spaceBelow) {
            dropdownStyle.value = {
                top: 'auto',
                bottom: `${window.innerHeight - rect.top + 8}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`
            };
        } else {
            dropdownStyle.value = {
                top: `${rect.bottom + 8}px`,
                bottom: 'auto',
                left: `${rect.left}px`,
                width: `${rect.width}px`
            };
        }
    }
};

const selectLayout = (layout: string) => {
    selectedLayout.value = layout;
    closeDropdown();
};

onUnmounted(() => {
    window.removeEventListener('resize', updateDropdownPosition);
    window.removeEventListener('scroll', updateDropdownPosition, true);
});

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
    position: relative;
}

.mute-toggle-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 32px;
    height: 32px;
    color: #00ccff;
    background: rgba(0, 20, 40, 0.7);
    border: 1px solid #00ccff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s ease;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.2);
    backdrop-filter: blur(4px);
}

.mute-toggle-btn:hover {
    transform: scale(1.1);
    background: rgba(0, 204, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 204, 255, 0.4);
    color: #fff;
}

.mute-toggle-btn svg {
    width: 20px;
    height: 20px;
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

.custom-dropdown {
    position: relative;
    min-width: 160px;
    max-width: 200px;
    flex: 1;
    user-select: none;
}

.dropdown-selected {
    padding: min(1.2vh, 10px) 15px;
    font-size: clamp(12px, 2vh, 14px);
    border-radius: 8px;
    background-color: rgba(0, 30, 60, 0.8);
    color: #00ccff;
    border: 1px solid #00ccff;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.2);
    transition: all 0.2s ease;
    font-weight: bold;
    letter-spacing: 1px;
}

.dropdown-selected:hover {
    background-color: rgba(0, 50, 100, 0.9);
    box-shadow: 0 0 15px rgba(0, 204, 255, 0.4);
}

.chevron {
    font-size: 12px;
    transition: transform 0.3s ease;
}

.chevron-up {
    transform: rotate(180deg);
}

.dropdown-options {
    position: fixed;
    margin: 0;
    padding: 8px 0;
    list-style: none;
    background: rgba(0, 15, 30, 0.98);
    border: 1px solid #00ccff;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 204, 255, 0.3);
    z-index: 50;
    backdrop-filter: blur(10px);
    max-height: 250px;
    overflow-y: auto;
}

.dropdown-option {
    padding: min(1.2vh, 10px) 15px;
    font-size: clamp(12px, 2vh, 14px);
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-option:hover {
    background-color: rgba(0, 204, 255, 0.2);
    color: #00ccff;
}

.dropdown-option.active {
    background-color: rgba(0, 204, 255, 0.4);
    color: #fff;
    font-weight: bold;
}

.dropdown-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    align-items: center;
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
}

.resume-btn {
    background-color: transparent;
    border: 1px solid #00ccff;
    color: #00ccff;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.2);
}

.resume-btn:hover {
    background-color: rgba(0, 204, 255, 0.2);
    border-color: #00ccff;
    box-shadow: 0 0 20px rgba(0, 204, 255, 0.5);
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
    
    .custom-dropdown {
        width: 100%;
        max-width: none;
    }

    .start-btn {
        width: 100%;
    }
    
    .rules-section {
        padding: min(1.5vh, 10px) 15px;
    }
}
</style>
