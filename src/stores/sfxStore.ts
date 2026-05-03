import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useSfxStore = defineStore('sfx', () => {
    const volume = ref(1.0);

    const savedVolume = localStorage.getItem('mahjong_sfx_volume');
    if (savedVolume !== null) {
        volume.value = parseFloat(savedVolume);
    }

    watch(volume, (newVal) => {
        localStorage.setItem('mahjong_sfx_volume', newVal.toString());
    });

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
        if (volume.value === 0) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            // Apply x^3 curve for natural logarithmic human volume perception
            const v = Math.pow(volume.value, 3);
            
            // Use a triangle wave for a softer, wood-like tone
            osc.type = 'triangle';
            // Subtle pitch drop from 300hz down to 80hz
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
            
            // Soft filter to remove any sharpness
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, ctx.currentTime);
            
            // Gentler attack and smoother release, scaled by exponential volume
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.4 * v, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.01 * v), ctx.currentTime + 0.12);
            
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
        if (volume.value === 0) return;
        try {
            const ctx = getAudioContext();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            const v = Math.pow(volume.value, 3);
            
            // Luxurious, ethereal major 7th chord (Amaj7)
            const frequencies = [440.00, 554.37, 659.25, 830.61]; 
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1500, ctx.currentTime);
            
            // Very soft, slow attack and long, luxurious fade, scaled by volume
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.15 * v, ctx.currentTime + 0.1); // Smooth fade in
            gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.001 * v), ctx.currentTime + 1.5); // Long 1.5s fade out
            
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
        if (volume.value === 0) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            const v = Math.pow(volume.value, 3);
            
            // Soft sine wave instead of harsh sawtooth
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.2);
            
            filter.type = 'lowpass';
            filter.frequency.value = 400; // Very muffled
            
            // Soft, plush thud, scaled by volume
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2 * v, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.01 * v), ctx.currentTime + 0.2);
            
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
        volume,
        playClack,
        playChime,
        playBuzzer
    };
});
