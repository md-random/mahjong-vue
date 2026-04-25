<template>
  <div class="rotate-overlay">
    <div class="rotate-content">
      <div class="phone-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      </div>
      <h2>Please Rotate Your Device</h2>
      <p>For the best experience, Mahjong is played in landscape mode.</p>
    </div>
  </div>
</template>

<style scoped>
.rotate-overlay {
  display: none;
}

@media screen and (orientation: portrait) and (max-width: 900px) {
  .rotate-overlay {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(15, 15, 15, 0.98);
    backdrop-filter: blur(10px);
    z-index: 9999;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    text-align: center;
    padding: 2rem;
    box-sizing: border-box;
  }
}

.rotate-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 400px;
}

.phone-icon {
  width: 100px;
  height: 100px;
  animation: rotatePhone 2.5s ease-in-out infinite;
}

.phone-icon svg {
  width: 100%;
  height: 100%;
  stroke: #00ccff;
}

@keyframes rotatePhone {
  0% { transform: rotate(0deg); }
  15% { transform: rotate(0deg); }
  50% { transform: rotate(-90deg); }
  65% { transform: rotate(-90deg); }
  100% { transform: rotate(0deg); }
}

h2 {
  margin: 0;
  font-family: 'Orbitron', sans-serif;
  color: #ff6600;
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

p {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.8;
  font-family: 'Share Tech Mono', monospace;
}
</style>
