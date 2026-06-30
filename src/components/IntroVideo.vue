<template>
  <div class="intro-container" :class="{ 'fade-out': fading }">
    <video
      ref="videoRef"
      class="intro-video"
      src="/FoolLogoIntro.mp4"
      muted
      playsinline
      @loadedmetadata="onLoadedMetadata"
      @ended="onVideoEnded"
    ></video>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../stores/gameStore';

const store = useGameStore();
const videoRef = ref<HTMLVideoElement | null>(null);
const fading = ref(false);

const onLoadedMetadata = () => {
  if (videoRef.value) {
    videoRef.value.play().catch((err) => {
      console.warn("Autoplay was prevented.", err);
      completeIntro();
    });
  }
};

const onVideoEnded = () => {
  fading.value = true;
  setTimeout(() => {
    completeIntro();
  }, 1000);
};

const completeIntro = () => {
  store.gameState = 'start';
};
</script>

<style scoped>
.intro-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 1s ease;
  opacity: 1;
}

.fade-out {
  opacity: 0;
  pointer-events: none;
}

.intro-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
