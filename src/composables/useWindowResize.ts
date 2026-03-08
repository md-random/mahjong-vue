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

        const widthScale = (windowWidth.value - 20) / baseWidth;
        const heightScale = (windowHeight.value - headerBuffer) / baseHeight;

        return Math.max(0.1, Math.min(widthScale, heightScale, 1));
    });
    
    return {
        appScale
    };
};
