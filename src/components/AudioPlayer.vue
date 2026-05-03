<template>
    <div class="audio-panel" :class="{ 'is-open': isOpen }">
        <button class="toggle-btn" @click="isOpen = !isOpen">
            <svg viewBox="0 0 24 24" class="music-icon" :class="{ playing: audioStore.isPlaying }">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="currentColor"/>
            </svg>
        </button>

        <div class="panel-content">
            <div class="track-info">
                <img v-if="audioStore.currentTrack" :src="audioStore.currentTrack.thumbnail" class="now-playing-thumb" />
                <div v-else class="now-playing-placeholder"></div>
                <div class="track-details">
                    <div class="now-playing-label">NOW PLAYING</div>
                    <div class="track-name">{{ audioStore.currentTrack ? audioStore.currentTrack.title : 'No track selected' }}</div>
                </div>
            </div>

            <div class="controls-row">
                <div class="playback-controls">
                    <button class="ctrl-btn play-btn" @click="audioStore.togglePlay" :disabled="audioStore.enabledTracks.length === 0">
                        <svg v-if="audioStore.isPlaying" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/></svg>
                        <svg v-else viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                    </button>
                    <button class="ctrl-btn skip-btn" @click="audioStore.playNext" :disabled="audioStore.enabledTracks.length === 0">
                        <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor"/></svg>
                    </button>
                </div>

                <div class="volume-control">
                    <div class="vol-icon" @click="audioStore.toggleMute" title="Toggle Mute">
                        <svg v-if="audioStore.isMuted" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/></svg>
                        <svg v-else viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/></svg>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" v-model.number="audioStore.volume" class="vol-slider" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAudioStore } from '../stores/audioStore';

const audioStore = useAudioStore();
const isOpen = ref(false);
</script>

<style scoped>
.audio-panel {
    position: fixed;
    top: 50%;
    left: 0;
    transform: translateY(-50%) translateX(-100%);
    z-index: 1000;
    display: flex;
    align-items: center;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.audio-panel.is-open {
    transform: translateY(-50%) translateX(0);
}

.toggle-btn {
    position: absolute;
    right: -40px;
    width: 40px;
    height: 60px;
    background: rgba(0, 20, 40, 0.95);
    border: 2px solid #00ccff;
    border-left: none;
    border-radius: 0 10px 10px 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #00ccff;
    box-shadow: 5px 0 15px rgba(0, 204, 255, 0.2);
    transition: all 0.2s ease;
}

.toggle-btn:hover {
    background: rgba(0, 204, 255, 0.1);
    width: 45px;
    right: -45px;
}

.music-icon {
    width: 24px;
    height: 24px;
}

.music-icon.playing {
    animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
    from { transform: scale(0.9); opacity: 0.8; }
    to { transform: scale(1.1); opacity: 1; text-shadow: 0 0 10px #00ccff; }
}

.panel-content {
    background: rgba(0, 20, 40, 0.95);
    border: 2px solid #00ccff;
    border-radius: 0 10px 10px 0;
    padding: 15px;
    width: 300px;
    box-shadow: 0 0 20px rgba(0, 204, 255, 0.3);
    backdrop-filter: blur(8px);
}

.track-info {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(0, 204, 255, 0.2);
}

.now-playing-thumb {
    width: 60px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #00ccff;
}

.now-playing-placeholder {
    width: 60px;
    height: 40px;
    background: rgba(0, 204, 255, 0.1);
    border: 1px dashed #00ccff;
    border-radius: 4px;
}

.track-details {
    flex: 1;
    overflow: hidden;
}

.now-playing-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: #ff6600;
    letter-spacing: 1px;
    margin-bottom: 4px;
}

.track-name {
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.controls-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.playback-controls {
    display: flex;
    gap: 10px;
}

.ctrl-btn {
    background: transparent;
    border: 1px solid #00ccff;
    color: #00ccff;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.ctrl-btn:hover:not(:disabled) {
    background: rgba(0, 204, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.4);
}

.ctrl-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: #555;
    color: #555;
}

.ctrl-btn svg {
    width: 20px;
    height: 20px;
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 120px;
}

.vol-icon {
    width: 20px;
    height: 20px;
    color: #00ccff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
}

.vol-icon:hover {
    transform: scale(1.1);
    color: #fff;
    text-shadow: 0 0 10px #00ccff;
}

.vol-icon svg {
    width: 100%;
    height: 100%;
}

.vol-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    background: rgba(0, 204, 255, 0.2);
    border-radius: 2px;
    outline: none;
}

.vol-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #00ccff;
    cursor: pointer;
    box-shadow: 0 0 5px #00ccff;
}

@media (max-width: 600px) {
    .panel-content {
        width: 240px;
    }
}
</style>
