<template>
  <header class="app-header">
    <span id="statusText" class="status-text" v-html="store.statusText"></span>
    <span id="controls" class="controls">
      <template v-if="['playing', 'deadlock'].includes(store.gameState)">
        <button class="undo-btn" id="undoButton" @click="store.undoMove" :disabled="store.moveHistory.length === 0" title="Undo Move">
          <svg viewBox="0 0 100 100" class="yin-yang-svg">
            <circle cx="50" cy="50" r="48" fill="#fff" stroke="#00ccff" stroke-width="4" />
            <path d="M50 2 a48 48 0 0 1 0 96 a24 24 0 0 1 0 -48 a24 24 0 0 0 0 -48" fill="#001a33" />
            <circle cx="50" cy="26" r="6" fill="#fff" />
            <circle cx="50" cy="74" r="6" fill="#001a33" />
          </svg>
        </button>
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
  align-items: center;
}

.undo-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.undo-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  filter: grayscale(100%);
}

.undo-btn:not(:disabled):hover {
  transform: rotate(-45deg) scale(1.1);
  filter: drop-shadow(0 0 8px rgba(0, 204, 255, 0.8));
}

.undo-btn:not(:disabled):active {
  transform: rotate(-90deg) scale(0.95);
}

.yin-yang-svg {
  width: 32px;
  height: 32px;
}
</style>
