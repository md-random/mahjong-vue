import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export interface Track {
    id: string;
    title: string;
    audioFile: string;
    thumbnail: string;
}

export const allTracks: Track[] = [
    { id: 'porcelain', title: 'Porcelain Velocity', audioFile: '/audio/Porcelain_Velocity.mp3', thumbnail: '/images/thumbnails/Porcelain_Velocity.png' },
    { id: 'seven', title: 'Seven Tiles One Bullet', audioFile: '/audio/Seven_Tiles_One_Bullet.mp3', thumbnail: '/images/thumbnails/Seven_Tiles_One_Bullet.png' },
    { id: 'last', title: 'The Last Mahjong Hand', audioFile: '/audio/The_Last_Mahjong_Hand.mp3', thumbnail: '/images/thumbnails/The_Last_Mahjong_Hand.png' },
    { id: 'titanium', title: 'Titanium Spur', audioFile: '/audio/Titanium_Spur.mp3', thumbnail: '/images/thumbnails/Titanium_Spur.png' },
    { id: 'twelve', title: 'Twelve Tiles Falling', audioFile: '/audio/Twelve_Tiles_Falling.mp3', thumbnail: '/images/thumbnails/Twelve_Tiles_Falling.png' },
    { id: 'click', title: 'Click of the Final Tile', audioFile: '/audio/Click_of_the_Final_Tile.mp3', thumbnail: '/images/thumbnails/Click_of_the_Final_Tile.png' },
    { id: 'seven_left', title: 'Seven Tiles Left', audioFile: '/audio/Seven_Tiles_Left.mp3', thumbnail: '/images/thumbnails/Seven_Tiles_Left.png' },
    { id: 'last_down', title: 'The Last Tile Down', audioFile: '/audio/The_Last_Tile_Down.mp3', thumbnail: '/images/thumbnails/The_Last_Tile_Down.png' }
];

export const useAudioStore = defineStore('audio', () => {
    const enabledTracks = ref<string[]>(allTracks.map(t => t.id));
    const volume = ref<number>(0.5);
    const currentTrackId = ref<string | null>(null);
    const isPlaying = ref(false);
    const isMuted = ref(false);
    const playBlocked = ref(false);
    
    // Load preferences
    const savedEnabled = localStorage.getItem('mahjong_audio_enabled');
    if (savedEnabled) {
        try { 
            const parsed = JSON.parse(savedEnabled); 
            if (Array.isArray(parsed)) {
                // Filter allTracks by parsed IDs to maintain the strict hardcoded order
                const filtered = allTracks.map(t => t.id).filter(id => parsed.includes(id));
                if (filtered.length > 0) {
                    enabledTracks.value = filtered;
                } else {
                    // Fallback to all tracks if no matching tracks are enabled
                    enabledTracks.value = allTracks.map(t => t.id);
                }
            }
        } catch(e){}
    }
    const savedVolume = localStorage.getItem('mahjong_audio_volume');
    if (savedVolume) {
        const parsedVolume = parseFloat(savedVolume);
        if (!isNaN(parsedVolume)) {
            volume.value = parsedVolume;
        }
    }
    
    let audioEl = new Audio();
    audioEl.volume = volume.value;
    
    // Watchers for persistence
    watch(enabledTracks, (newVal) => {
        localStorage.setItem('mahjong_audio_enabled', JSON.stringify(newVal));
    }, { deep: true });
    
    watch(volume, (newVal) => {
        audioEl.volume = newVal;
        localStorage.setItem('mahjong_audio_volume', newVal.toString());
    });
    
    const currentTrack = computed(() => allTracks.find(t => t.id === currentTrackId.value));
    
    const playNext = () => {
        if (enabledTracks.value.length === 0) {
            pause();
            return;
        }
        
        let nextIndex = 0;
        if (currentTrackId.value) {
            const currentIndex = enabledTracks.value.indexOf(currentTrackId.value);
            if (currentIndex !== -1) {
                nextIndex = (currentIndex + 1) % enabledTracks.value.length;
            }
        }
        
        const nextTrackId = enabledTracks.value[nextIndex];
        if (nextTrackId) {
            playTrack(nextTrackId);
        }
    };
    
    audioEl.addEventListener('ended', playNext);
    
    const playTrack = (id: string) => {
        const track = allTracks.find(t => t.id === id);
        if (!track) return;
        
        if (currentTrackId.value !== id) {
            currentTrackId.value = id;
            audioEl.src = track.audioFile;
        }
        
        audioEl.play().then(() => {
            isPlaying.value = true;
            playBlocked.value = false;
        }).catch(err => {
            console.warn('Audio play blocked by browser policy:', err);
            isPlaying.value = false;
            playBlocked.value = true;
        });
    };
    
    const play = () => {
        if (!currentTrackId.value && enabledTracks.value.length > 0) {
            const firstTrack = enabledTracks.value[0];
            if (firstTrack) {
                playTrack(firstTrack);
            }
        } else if (currentTrackId.value) {
            audioEl.play().then(() => {
                isPlaying.value = true;
                playBlocked.value = false;
            }).catch(e => {
                 console.warn('Audio play blocked by browser policy:', e);
                 isPlaying.value = false;
                 playBlocked.value = true;
            });
        }
    };

    // Attempt to unblock audio on the first user interaction
    const handleFirstInteraction = () => {
        if (playBlocked.value && !isMuted.value) {
            play();
        }
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    
    const pause = () => {
        audioEl.pause();
        isPlaying.value = false;
    };
    
    const togglePlay = () => {
        if (isPlaying.value) pause();
        else play();
    };
    
    const toggleTrackEnabled = (id: string) => {
        const index = enabledTracks.value.indexOf(id);
        if (index === -1) {
            // Enable it, but maintain the strict order defined by allTracks
            const currentSet = new Set(enabledTracks.value);
            currentSet.add(id);
            enabledTracks.value = allTracks.map(t => t.id).filter(tId => currentSet.has(tId));
        } else {
            enabledTracks.value.splice(index, 1);
            if (currentTrackId.value === id && isPlaying.value) {
                if (enabledTracks.value.length > 0) {
                    playNext();
                } else {
                    pause();
                }
            }
        }
    };
    
    const toggleMute = () => {
        isMuted.value = !isMuted.value;
        audioEl.muted = isMuted.value;
    };
    
    return {
        allTracks,
        enabledTracks,
        volume,
        currentTrack,
        isPlaying,
        isMuted,
        play,
        pause,
        togglePlay,
        playNext,
        toggleTrackEnabled,
        toggleMute
    };
});
