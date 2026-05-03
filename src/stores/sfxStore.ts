import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useSfxStore = defineStore('sfx', () => {
    const isEnabled = ref(true);

    const savedEnabled = localStorage.getItem('mahjong_sfx_enabled');
    if (savedEnabled !== null) {
        isEnabled.value = savedEnabled === 'true';
    }

    watch(isEnabled, (newVal) => {
        localStorage.setItem('mahjong_sfx_enabled', newVal.toString());
    });

    const toggleSfx = () => {
        isEnabled.value = !isEnabled.value;
    };

    // Initialize AudioContext lazily so we don't break auto-play policies
    let audioCtx: AudioContext | null = null;
    
    const getAudioContext = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    };

    const playClack = () => {
        if (!isEnabled.value) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            // Use a triangle wave for a softer, wood-like tone
            osc.type = 'triangle';
            // Subtle pitch drop from 300hz down to 80hz
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
            
            // Soft filter to remove any sharpness
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, ctx.currentTime);
            
            // Gentler attack and smoother release
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            console.warn("SFX playback failed", e);
        }
    };

    const playChime = () => {
        if (!isEnabled.value) return;
        try {
            const ctx = getAudioContext();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            // Luxurious, ethereal major 7th chord (Amaj7)
            const frequencies = [440.00, 554.37, 659.25, 830.61]; 
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1500, ctx.currentTime);
            
            // Very soft, slow attack and long, luxurious fade
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1); // Smooth fade in
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5); // Long 1.5s fade out
            
            frequencies.forEach(freq => {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                // Subtle pitch drift for a "shimmering" effect
                osc.frequency.linearRampToValueAtTime(freq + 5, ctx.currentTime + 1.5);
                
                osc.connect(filter);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 1.6);
            });

            filter.connect(gain);
            gain.connect(ctx.destination);
            
        } catch (e) {
            console.warn("SFX playback failed", e);
        }
    };

    const playBuzzer = () => {
        if (!isEnabled.value) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            // Soft sine wave instead of harsh sawtooth
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.2);
            
            filter.type = 'lowpass';
            filter.frequency.value = 400; // Very muffled
            
            // Soft, plush thud
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {
            console.warn("SFX playback failed", e);
        }
    };

    return {
        isEnabled,
        toggleSfx,
        playClack,
        playChime,
        playBuzzer
    };
});
