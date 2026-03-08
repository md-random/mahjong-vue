<template>
  <header class="app-header">
    <span id="statusText" class="status-text" v-html="store.statusText"></span>
    <span id="controls" class="controls">
      <template v-if="store.gameState === 'playing'">
        <button class="nav-btn" id="hintButton" @click="store.triggerHint">Hint</button>
        <button class="nav-btn" id="restartButton" @click="store.restartGame">Restart</button>
        <button class="nav-btn" id="menuButton" @click="store.returnToMenu">Menu</button>
      </template>
    </span>
  </header>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';

const store = useGameStore();
</script>

<style scoped>
.app-header {
  width: min(1000px, 95vw);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  gap: 15px;
}

@media (max-width: 600px) {
  .app-header {
    flex-direction: column;
  }
}

.status-text {
  font-size: 20px;
  font-weight: bold;
}

.controls {
  display: flex;
  gap: 10px;
}
</style>
