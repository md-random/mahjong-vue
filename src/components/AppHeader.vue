<template>
  <header class="app-header">
    <span id="statusText" class="status-text" v-html="store.statusText"></span>
    <span id="controls" class="controls">
      <template v-if="['playing', 'deadlock'].includes(store.gameState)">
        <button class="icon-btn" id="undoButton" @click="store.undoMove" :disabled="store.moveHistory.length === 0" title="Undo Move">
          <div class="icon-wrapper">
            <svg viewBox="0 0 100 100" class="action-svg">
              <circle cx="50" cy="50" r="48" fill="#fff" stroke="#00ccff" stroke-width="4" />
              <path d="M50 2 a48 48 0 0 1 0 96 a24 24 0 0 1 0 -48 a24 24 0 0 0 0 -48" fill="#001a33" />
              <circle cx="50" cy="26" r="6" fill="#fff" />
              <circle cx="50" cy="74" r="6" fill="#001a33" />
            </svg>
          </div>
          <span class="btn-label">Undo</span>
        </button>
        <button class="icon-btn" id="hintButton" @click="store.triggerHint" title="Get Hint">
          <div class="icon-wrapper">
            <svg viewBox="0 0 100 100" class="action-svg">
              <circle cx="50" cy="50" r="48" fill="#001a33" stroke="#00ccff" stroke-width="4" />
              <path d="M 15 50 Q 50 15 85 50 Q 50 85 15 50" fill="#fff" />
              <circle cx="50" cy="50" r="18" fill="#00ccff" />
              <circle cx="50" cy="50" r="8" fill="#001a33" />
              <circle cx="45" cy="45" r="4" fill="#fff" />
            </svg>
          </div>
          <span class="btn-label">Hint</span>
        </button>
        <button class="icon-btn" id="restartButton" @click="store.triggerConfirmAction('restart')" title="Restart Game">
          <div class="icon-wrapper">
            <svg viewBox="0 0 100 100" class="action-svg">
              <circle cx="50" cy="50" r="48" fill="#001a33" stroke="#00ccff" stroke-width="4" />
              <path d="M 50 25 A 25 25 0 1 1 25 50" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" />
              <polygon points="15,55 35,55 25,35" fill="#00ccff" />
            </svg>
          </div>
          <span class="btn-label">Restart</span>
        </button>
        <button class="icon-btn" id="menuButton" @click="store.triggerConfirmAction('menu')" title="Main Menu">
          <div class="icon-wrapper">
            <svg viewBox="0 0 100 100" class="action-svg">
              <circle cx="50" cy="50" r="48" fill="#001a33" stroke="#00ccff" stroke-width="4" />
              <rect x="25" y="30" width="50" height="8" rx="4" fill="#fff" />
              <rect x="25" y="46" width="50" height="8" rx="4" fill="#00ccff" />
              <rect x="25" y="62" width="50" height="8" rx="4" fill="#fff" />
            </svg>
          </div>
          <span class="btn-label">Menu</span>
        </button>
        <button class="icon-btn" id="settingsButton" @click="store.showSettingsModal = true" title="Settings">
          <div class="icon-wrapper">
            <svg viewBox="0 0 100 100" class="action-svg">
              <circle cx="50" cy="50" r="48" fill="#001a33" stroke="#00ccff" stroke-width="4" />
              <g fill="#00ccff">
                  <rect x="44" y="20" width="12" height="60" rx="3" />
                  <rect x="20" y="44" width="60" height="12" rx="3" />
                  <rect x="44" y="20" width="12" height="60" rx="3" transform="rotate(45 50 50)" />
                  <rect x="20" y="44" width="60" height="12" rx="3" transform="rotate(45 50 50)" />
              </g>
              <circle cx="50" cy="50" r="18" fill="#fff" />
              <circle cx="50" cy="50" r="8" fill="#001a33" />
            </svg>
          </div>
          <span class="btn-label">Options</span>
        </button>
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
  gap: 15px;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.icon-wrapper {
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: #00ccff;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.icon-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  filter: grayscale(100%);
}

.icon-btn:not(:disabled):hover .icon-wrapper {
  filter: drop-shadow(0 0 8px rgba(0, 204, 255, 0.8));
}

.icon-btn:not(:disabled):hover .btn-label {
  opacity: 1;
  text-shadow: 0 0 5px rgba(0, 204, 255, 0.8);
}

#undoButton:not(:disabled):hover .icon-wrapper {
  transform: rotate(-45deg) scale(1.1);
}

#undoButton:not(:disabled):active .icon-wrapper {
  transform: rotate(-90deg) scale(0.95);
}

#hintButton:not(:disabled):hover .icon-wrapper {
  transform: scale(1.15);
}

#hintButton:not(:disabled):active .icon-wrapper {
  transform: scale(0.95);
}

#restartButton:not(:disabled):hover .icon-wrapper {
  transform: rotate(-90deg) scale(1.1);
}

#restartButton:not(:disabled):active .icon-wrapper {
  transform: rotate(-180deg) scale(0.95);
}

#menuButton:not(:disabled):hover .icon-wrapper {
  transform: scale(1.15);
}

#menuButton:not(:disabled):active .icon-wrapper {
  transform: scale(0.95);
}

#settingsButton:not(:disabled):hover .icon-wrapper {
  transform: rotate(90deg) scale(1.1);
}

#settingsButton:not(:disabled):active .icon-wrapper {
  transform: rotate(180deg) scale(0.95);
}

.action-svg {
  width: 32px;
  height: 32px;
}

@media (max-width: 800px), (max-height: 500px) {
  .app-header {
    padding: 10px 0;
  }
  .controls {
    gap: 8px;
  }
  .icon-wrapper {
    padding: 6px;
  }
  .action-svg {
    width: 24px;
    height: 24px;
  }
  .btn-label {
    font-size: 10px;
    margin-top: 2px;
  }
}
</style>
