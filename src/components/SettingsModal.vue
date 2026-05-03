<template>
    <div class="modal-overlay" @click.self="store.showSettingsModal = false">
        <div class="modal-content">
            <h1 class="modal-title">SETTINGS</h1>
            
            <div class="settings-section">
                <h2 class="section-title">KEYBOARD CONTROLS</h2>
                <div class="shortcut-grid">
                    <div class="shortcut-item">
                        <span class="key">Ctrl+Z</span>
                        <span class="desc">Undo Last Move</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="key">H</span>
                        <span class="desc">Request Hint</span>
                    </div>
                    <div class="shortcut-item">
                        <span class="key">Esc</span>
                        <span class="desc">Return to Menu</span>
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <h2 class="section-title">AUDIO OPTIONS</h2>
                <div class="placeholder-text">Music & Sound Effects Coming Soon...</div>
            </div>

            <div class="modal-actions">
                <button class="modal-btn close-btn" @click="store.showSettingsModal = false">CLOSE</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';

const store = useGameStore();
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 5, 15, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease-out forwards;
}

.modal-content {
    text-align: left;
    padding: 40px;
    border: 2px solid #00ccff;
    background: rgba(0, 20, 40, 0.95);
    box-shadow: 0 0 30px rgba(0, 204, 255, 0.4), inset 0 0 20px rgba(0, 204, 255, 0.2);
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(24px, 4vw, 36px);
    margin: 0 0 30px 0;
    letter-spacing: 4px;
    text-shadow: 0 0 10px currentColor;
    color: #00ccff;
    text-align: center;
}

.settings-section {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 204, 255, 0.2);
}

.settings-section:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
}

.section-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px;
    color: #ff6600;
    margin-bottom: 15px;
    letter-spacing: 2px;
}

.shortcut-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.shortcut-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Share Tech Mono', monospace;
}

.key {
    background: rgba(0, 204, 255, 0.1);
    border: 1px solid #00ccff;
    color: #00ccff;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: 0 0 5px rgba(0, 204, 255, 0.2);
}

.desc {
    color: #fff;
    font-size: 14px;
    opacity: 0.8;
}

.placeholder-text {
    font-family: 'Share Tech Mono', monospace;
    color: #fff;
    opacity: 0.5;
    font-style: italic;
    text-align: center;
    padding: 10px 0;
}

.modal-actions {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.modal-btn {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    font-weight: bold;
    padding: 12px 40px;
    background: transparent;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-btn {
    color: #00ccff;
    border: 1px solid #00ccff;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.2);
}

.close-btn:hover {
    background: rgba(0, 204, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 204, 255, 0.6);
    transform: scale(1.05);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (max-height: 500px) {
    .modal-content {
        padding: 20px;
    }
    .modal-title {
        margin: 0 0 15px 0;
        font-size: 20px;
    }
    .settings-section {
        margin-bottom: 15px;
        padding-bottom: 10px;
    }
    .modal-actions {
        margin-top: 15px;
    }
    .modal-btn {
        padding: 8px 24px;
        font-size: 14px;
    }
}
</style>
