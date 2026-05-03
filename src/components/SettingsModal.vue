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
                <div class="track-list">
                    <div v-for="track in audioStore.allTracks" :key="track.id" class="track-item" :class="{ disabled: !audioStore.enabledTracks.includes(track.id) }">
                        <img :src="track.thumbnail" :alt="track.title" class="track-thumb" />
                        <span class="track-title">{{ track.title }}</span>
                        <label class="toggle-switch">
                            <input type="checkbox" :checked="audioStore.enabledTracks.includes(track.id)" @change="audioStore.toggleTrackEnabled(track.id)" />
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button class="modal-btn close-btn" @click="store.showSettingsModal = false">CLOSE</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';
import { useAudioStore } from '../stores/audioStore';

const store = useGameStore();
const audioStore = useAudioStore();
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

.track-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.track-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    background: rgba(0, 204, 255, 0.05);
    border: 1px solid rgba(0, 204, 255, 0.2);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.track-item.disabled {
    opacity: 0.5;
    filter: grayscale(80%);
}

.track-thumb {
    width: 60px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #00ccff;
}

.track-title {
    flex: 1;
    color: #fff;
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
}

/* Toggle Switch Styles */
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    transition: .4s;
    border-radius: 24px;
    border: 1px solid rgba(0, 204, 255, 0.3);
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: #fff;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #00ccff;
    box-shadow: 0 0 10px #00ccff;
}

input:checked + .slider:before {
    transform: translateX(20px);
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
