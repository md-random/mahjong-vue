<template>
  <div class="ripple-grid-container">
      <div class="ripple-ring ring-1"></div>
      <div class="ripple-ring ring-2"></div>
      <div class="ripple-ring ring-3"></div>
      <div class="ripple-ring ring-4"></div>
      <div class="ripple-ring ring-5"></div>
      <div class="ripple-ring ring-6"></div>
      <div class="ripple-ring ring-7"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.ripple-grid-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1; 
  pointer-events: none;
  overflow: hidden;

  -webkit-mask-image: 
      linear-gradient(#fff 2px, transparent 2px),
      linear-gradient(90deg, #fff 2px, transparent 2px);
  mask-image: 
      linear-gradient(#fff 2px, transparent 2px),
      linear-gradient(90deg, #fff 2px, transparent 2px);
  -webkit-mask-size: 50px 50px;
  mask-size: 50px 50px;
}

.ripple-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  width: 0;
  height: 0;
  opacity: 0;
  
  border: 6px solid transparent; 
  
  animation: ripplePulse 5.6s infinite linear;
}

.ring-1 { 
  border-color: rgba(255, 0, 85, 0.95);
  box-shadow: 0 0 30px rgba(255, 0, 85, 0.8), inset 0 0 30px rgba(255, 0, 85, 0.8);
  animation-delay: 0s; 
}
.ring-2 { 
  border-color: rgba(0, 255, 102, 0.95);
  box-shadow: 0 0 30px rgba(0, 255, 102, 0.8), inset 0 0 30px rgba(0, 255, 102, 0.8);
  animation-delay: 0.33s; 
}
.ring-3 { 
  border-color: rgba(0, 204, 255, 0.95);
  box-shadow: 0 0 30px rgba(0, 204, 255, 0.8), inset 0 0 30px rgba(0, 204, 255, 0.8);
  animation-delay: 0.66s; 
}
.ring-4 { 
  border-color: rgba(204, 0, 255, 0.95);
  box-shadow: 0 0 30px rgba(204, 0, 255, 0.8), inset 0 0 30px rgba(204, 0, 255, 0.8);
  animation-delay: 0.99s; 
}
.ring-5 { 
  border-color: rgba(255, 204, 0, 0.95);
  box-shadow: 0 0 30px rgba(255, 204, 0, 0.8), inset 0 0 30px rgba(255, 204, 0, 0.8);
  animation-delay: 1.32s; 
}
.ring-6 { 
  border-color: rgba(255, 102, 0, 0.95);
  box-shadow: 0 0 30px rgba(255, 102, 0, 0.8), inset 0 0 30px rgba(255, 102, 0, 0.8);
  animation-delay: 1.65s; 
}
.ring-7 { 
  border-color: rgba(200, 255, 255, 0.95);
  box-shadow: 0 0 30px rgba(200, 255, 255, 0.8), inset 0 0 30px rgba(200, 255, 255, 0.8);
  animation-delay: 1.98s; 
}

@keyframes ripplePulse {
  0%   { width: 0; height: 0; opacity: 1; }
  50%  { opacity: 1; }
  100% { width: 150vmax; height: 150vmax; opacity: 0; }
}
</style>
