<template>
<div id="app-container" class="app-container">
    <IntroVideo v-if="store.gameState === 'intro'" />
    <BackgroundLayer 
        v-if="['playing', 'deadlock', 'win'].includes(store.gameState)"
        :bg-image="currentConfig.bg" 
        :bg-position="currentConfig.bgPosition || 'center center'" 
    />
    
    <PondRipple v-if="['start', 'intro'].includes(store.gameState)" />
    
    <AppHeader />

    <div v-if="['playing', 'deadlock', 'win'].includes(store.gameState)" class="scale-container" :style="{ width: `${1000 * appScale}px`, height: `${700 * appScale}px` }">
        <div id="wrapper" class="app-wrapper" :style="{ transform: `scale(${appScale})` }">
            <main class="main-content">
                <GameBoard />
            </main>
        </div>
    </div>
    
    <main v-if="store.gameState === 'start'" class="start-main-content">
        <StartScreen />
    </main>

    <AudioPlayer v-if="['playing', 'deadlock'].includes(store.gameState)" />

    <ConfirmModal v-if="store.confirmModal.show" />
    <SettingsModal v-if="store.showSettingsModal" />
</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useGameStore } from './stores/gameStore';
import { useAudioStore } from './stores/audioStore';
import { useWindowResize } from './composables/useWindowResize';
import { useDynamicBackground } from './composables/useDynamicBackground';
import IntroVideo from './components/IntroVideo.vue';
import GameBoard from './components/GameBoard.vue';
import StartScreen from './components/StartScreen.vue';
import AppHeader from './components/AppHeader.vue';
import BackgroundLayer from './components/BackgroundLayer.vue';
import PondRipple from './components/PondRipple.vue';
import ConfirmModal from './components/ConfirmModal.vue';
import SettingsModal from './components/SettingsModal.vue';
import AudioPlayer from './components/AudioPlayer.vue';

const store = useGameStore();
const audioStore = useAudioStore();

watch(() => store.gameState, (newVal) => {
    if ((newVal === 'start' || newVal === 'playing') && !audioStore.isPlaying) {
        audioStore.play();
    }
});

const { appScale } = useWindowResize();

const { currentConfig } = useDynamicBackground(() => store.currentLayoutName);

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        if (store.showSettingsModal) {
            store.showSettingsModal = false;
            return;
        }
        if (store.confirmModal.show) {
            store.cancelConfirmAction();
            return;
        }
        if (['playing', 'deadlock'].includes(store.gameState)) {
            store.triggerConfirmAction('menu');
        }
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (['playing', 'deadlock'].includes(store.gameState) && !store.confirmModal.show && !store.showSettingsModal) {
            e.preventDefault();
            store.undoMove();
        }
    }
    
    if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey) {
        if (['playing', 'deadlock'].includes(store.gameState) && !store.confirmModal.show && !store.showSettingsModal) {
            store.triggerHint();
        }
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;
    position: relative;
}

@media screen and (orientation: portrait) and (max-device-width: 1024px) {
    .app-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100dvh !important;
        height: 100dvw !important;
        max-height: 100dvw !important;
        transform: rotate(90deg);
        transform-origin: top left;
        margin-left: 100dvw;
    }
}

.scale-container {
    margin: auto;
    position: relative;
}

.app-wrapper {
    transform-origin: top left;
    width: 1000px;
    height: 700px;
}

.main-content {
    width: 100%;
    height: 100%;
    position: relative;
}

.start-main-content {
    width: 100%;
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}
</style>
