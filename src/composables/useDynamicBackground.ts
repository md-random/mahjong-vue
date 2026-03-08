import { computed, watch } from 'vue';

const layoutConfigs: Record<string, { bg: string, gridColor: string, bgPosition?: string }> = {
    'Classic Turtle': { bg: '/img/background-synth.jpg', gridColor: 'rgba(0, 255, 255, 0.1)' },
    'Deep Well': { bg: '/img/bg-deepwell.png', gridColor: 'rgba(255, 0, 255, 0.15)', bgPosition: '60% 75%' },
    'Eight Stacks': { bg: '/img/bg-eightstacks.png', gridColor: 'rgba(0, 255, 255, 0.15)' },
    'Fish': { bg: '/img/bg-fish.png', gridColor: 'rgba(0, 255, 128, 0.15)' }
};

export const useDynamicBackground = (getLayoutName: () => string) => {
    const currentConfig = computed(() => layoutConfigs[getLayoutName()] || layoutConfigs['Classic Turtle']!);

    watch(() => currentConfig.value.gridColor, (newColor) => {
        document.body.style.setProperty('--grid-color', newColor);
    }, { immediate: true });

    return { currentConfig };
};
