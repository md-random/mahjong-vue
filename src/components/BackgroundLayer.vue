<template>
  <div id="synth-bg" class="synth-bg" :style="{
      backgroundImage: `url(${bgImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: bgPosition
  }"></div>
</template>

<script setup lang="ts">
const { bgImage, bgPosition = 'center center' } = defineProps<{
    bgImage: string;
    bgPosition?: string;
}>();
</script>

<style scoped>
.synth-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-size: cover !important;
    -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%);
    mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%);
}
</style>
