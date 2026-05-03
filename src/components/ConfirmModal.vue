<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <h1 class="modal-title">WARNING</h1>
            <p class="modal-text">Are you sure you want to abandon the current simulation?</p>
            <div class="modal-actions">
                <button class="modal-btn cancel-btn" @click="store.cancelConfirmAction">CANCEL</button>
                <button class="modal-btn confirm-btn" @click="store.executeConfirmAction">CONFIRM</button>
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
    text-align: center;
    padding: 40px;
    border: 2px solid #ff0055;
    background: rgba(0, 20, 40, 0.95);
    box-shadow: 0 0 30px rgba(255, 0, 85, 0.4), inset 0 0 20px rgba(255, 0, 85, 0.2);
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-title {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(24px, 4vw, 36px);
    margin: 0 0 20px 0;
    letter-spacing: 4px;
    text-shadow: 0 0 10px currentColor;
    color: #ff0055;
}

.modal-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 18px;
    color: #fff;
    margin-bottom: 30px;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.modal-btn {
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    font-weight: bold;
    padding: 12px 30px;
    background: transparent;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cancel-btn {
    color: #00ccff;
    border: 1px solid #00ccff;
    box-shadow: 0 0 10px rgba(0, 204, 255, 0.2);
}

.cancel-btn:hover {
    background: rgba(0, 204, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 204, 255, 0.6);
    transform: scale(1.05);
}

.confirm-btn {
    color: #ff0055;
    border: 1px solid #ff0055;
    box-shadow: 0 0 10px rgba(255, 0, 85, 0.2);
}

.confirm-btn:hover {
    background: rgba(255, 0, 85, 0.2);
    box-shadow: 0 0 20px rgba(255, 0, 85, 0.6);
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
        margin: 0 0 10px 0;
        font-size: 20px;
    }
    .modal-text {
        margin-bottom: 20px;
        font-size: 14px;
    }
    .modal-btn {
        padding: 8px 24px;
        font-size: 14px;
    }
}
</style>
