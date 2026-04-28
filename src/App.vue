<template>
<div id="app-container" class="app-container">
    <RotateDeviceOverlay />
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
</div>
</template>

<script setup lang="ts">
import { useGameStore } from './stores/gameStore';
import { useWindowResize } from './composables/useWindowResize';
import { useDynamicBackground } from './composables/useDynamicBackground';
import RotateDeviceOverlay from './components/RotateDeviceOverlay.vue';
import IntroVideo from './components/IntroVideo.vue';
import GameBoard from './components/GameBoard.vue';
import StartScreen from './components/StartScreen.vue';
import AppHeader from './components/AppHeader.vue';
import BackgroundLayer from './components/BackgroundLayer.vue';
import PondRipple from './components/PondRipple.vue';

const store = useGameStore();

const { appScale } = useWindowResize();

const { currentConfig } = useDynamicBackground(() => store.currentLayoutName);
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
