import { ref, onMounted, onUnmounted, computed } from 'vue';

export const useWindowResize = () => {
    const windowWidth = ref(window.innerWidth);
    const windowHeight = ref(window.innerHeight);

    const onResize = () => {
        windowWidth.value = window.innerWidth;
        windowHeight.value = window.innerHeight;
    };

    onMounted(() => {
        window.addEventListener('resize', onResize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', onResize);
    });

    const appScale = computed(() => {
        const baseWidth = 1000;
        const baseHeight = 700;
        const headerBuffer = 100;

        // If in portrait mode on a mobile/tablet, the CSS will rotate the app.
        // Therefore, the physical screen height becomes our available width,
        // and the physical screen width becomes our available height.
        let effectiveWidth = windowWidth.value;
        let effectiveHeight = windowHeight.value;

        if (windowHeight.value > windowWidth.value && windowWidth.value <= 1024) {
            effectiveWidth = windowHeight.value;
            effectiveHeight = windowWidth.value;
        }

        const widthScale = (effectiveWidth - 20) / baseWidth;
        const heightScale = (effectiveHeight - headerBuffer) / baseHeight;

        // Removed upper limit of 1 to allow scaling up on tablets/large screens
        return Math.max(0.1, Math.min(widthScale, heightScale));
    });
    
    return {
        appScale
    };
};
