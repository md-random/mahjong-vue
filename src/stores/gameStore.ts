import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Coordinate, TileData, TileState } from '../types/game';
import { LAYOUTS, isOpen } from '../utils/coordinates';
import { generateTileDataMap } from '../utils/images';
import { shuffle, randEl, sleep } from '../utils/gameUtils';
import { useSfxStore } from './sfxStore';

export const useGameStore = defineStore('game', () => {
    const statusText = ref<string>('');
    const tilesState = ref<TileState[]>([]);
    const selectedCoords = ref<Coordinate | null>(null);
    const hintCoord = ref<Coordinate | null>(null);
    const gameState = ref<'intro' | 'start' | 'playing' | 'win' | 'deadlock'>('intro');
    const currentLayoutName = ref<string>('Classic Turtle');
    const moveHistory = ref<[Coordinate, Coordinate][]>([]);

    const hasSavedGame = ref(false);

    const showSettingsModal = ref(false);
    const confirmModal = ref<{ show: boolean; action: 'restart' | 'menu' | null }>({ show: false, action: null });

    const triggerConfirmAction = (action: 'restart' | 'menu') => {
        confirmModal.value = { show: true, action };
    };

    const cancelConfirmAction = () => {
        confirmModal.value = { show: false, action: null };
    };

    const executeConfirmAction = async () => {
        const action = confirmModal.value.action;
        confirmModal.value = { show: false, action: null };
        if (action === 'restart') {
            await restartGame();
        } else if (action === 'menu') {
            returnToMenu();
        }
    };

    const savedState = localStorage.getItem('mahjongGameState');
    if (savedState) {
        hasSavedGame.value = true;
    }

    const resumeGame = () => {
        const saved = localStorage.getItem('mahjongGameState');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.currentLayoutName) currentLayoutName.value = parsed.currentLayoutName;
                if (parsed.tilesState) tilesState.value = parsed.tilesState;
                if (parsed.moveHistory) moveHistory.value = parsed.moveHistory;
                if (parsed.gameState) gameState.value = parsed.gameState;
                
                updateOpenStatus();
                checkMovePossible("Game Resumed");
            } catch (e) {
                console.error("Failed to parse saved state", e);
            }
        }
    };

    watch([gameState, currentLayoutName, tilesState, moveHistory], () => {
        if (['playing', 'deadlock'].includes(gameState.value)) {
            localStorage.setItem('mahjongGameState', JSON.stringify({
                gameState: gameState.value,
                currentLayoutName: currentLayoutName.value,
                tilesState: tilesState.value,
                moveHistory: moveHistory.value
            }));
        } else if (gameState.value === 'win') {
            localStorage.removeItem('mahjongGameState');
        }
    }, { deep: true });

    const currentCoords = computed<Coordinate[]>(() => 
        tilesState.value.filter(t => !t.hidden).map(t => t.coord)
    );

    const writeStatus = (text: string) => {
        statusText.value = text;
    };

    const startGame = async (layoutName: string = 'Classic Turtle') => {
        gameState.value = 'playing';
        currentLayoutName.value = layoutName;
        moveHistory.value = [];
        const rawTileData = generateTileDataMap();
        shuffle(rawTileData);
        
        const layoutCoords = LAYOUTS[layoutName] ?? LAYOUTS['Classic Turtle'] as Coordinate[];

        tilesState.value = layoutCoords.map((coord, index) => {
            return {
                coord,
                tileData: rawTileData[index] as TileData,
                selected: false,
                alerted: false,
                hidden: false,
                isOpen: false
            };
        });

        updateOpenStatus();
        await checkMovePossible("");
    };

    const returnToMenu = () => {
        gameState.value = 'start';
        tilesState.value = [];
    };

    const updateOpenStatus = () => {
        const currentBoardCoords = currentCoords.value;
        tilesState.value.forEach(t => {
            if (!t.hidden) {
                t.isOpen = isOpen(t.coord, currentBoardCoords);
            }
        });
    };

    const getTileByCoord = (coord: Coordinate): TileState | undefined => {
        return tilesState.value.find(t => t.coord.toString() === coord.toString());
    };

    const checkMovePossible = async (message: string) => {
        writeStatus(message);
        await sleep(50);
        
        const moves: [Coordinate, Coordinate][] = [];
        const board = currentCoords.value;
        
        for (let i = 0; i < board.length; i++) {
            for (let j = i + 1; j < board.length; j++) {
                const p = board[i];
                const q = board[j];
                
                if (!p || !q) continue;

                const tileP = getTileByCoord(p);
                const tileQ = getTileByCoord(q);
                
                if (tileP && tileQ && 
                    tileP.tileData.type === tileQ.tileData.type &&
                    tileP.isOpen && tileQ.isOpen) {
                    moves.push([p, q]);
                }
            }
        }
        
        if (moves.length === 0) {
            writeStatus("There are no moves left. Gameover. 🚧");
            if (currentCoords.value.length > 0) {
                gameState.value = 'deadlock';
            }
        } else if (moves.length === 1) {
            writeStatus("There is <strong>exactly one</strong> possible move.");
        } else {
            writeStatus(`There are <strong>${moves.length}</strong> possible moves.`);
        }

        if (moves.length > 0) {
            hintCoord.value = randEl(randEl(moves));
        } else {
            hintCoord.value = null;
        }
    };

    const executeMove = async (tile1: TileState, tile2: TileState) => {
        const sfxStore = useSfxStore();
        sfxStore.playChime();

        selectedCoords.value = null;
        hintCoord.value = null;
        
        tile1.selected = false;
        tile2.selected = false;
        
        tile1.animating = true;
        tile2.animating = true;

        await sleep(500);

        tile1.animating = false;
        tile2.animating = false;
        tile1.hidden = true;
        tile2.hidden = true;

        moveHistory.value.push([tile1.coord, tile2.coord]);

        updateOpenStatus();

        if (currentCoords.value.length === 0) {
            writeStatus("You won! 🎉");
            gameState.value = 'win';
        } else {
            await checkMovePossible("Computing...");
        }
    };

    const selectTileAt = (coord: Coordinate) => {
        const sfxStore = useSfxStore();
        const tile = getTileByCoord(coord);
        
        if (!tile || !tile.isOpen) {
            sfxStore.playBuzzer();
            return;
        }

        if (selectedCoords.value) {
            if (coord.toString() === selectedCoords.value.toString()) {
                tile.selected = false;
                selectedCoords.value = null;
                sfxStore.playClack();
                return;
            } else {
                const selectedTile = getTileByCoord(selectedCoords.value);
                if (selectedTile && tile.tileData.type === selectedTile.tileData.type) {
                    executeMove(tile, selectedTile);
                    return;
                } else {
                    sfxStore.playBuzzer();
                }
            }
        }
        
        if (selectedCoords.value) {
            const prevSelected = getTileByCoord(selectedCoords.value);
            if (prevSelected) prevSelected.selected = false;
        }
        selectedCoords.value = coord;
        tile.selected = true;
        sfxStore.playClack();
    };

    const triggerHint = async () => {
        if (!hintCoord.value) return;
        const tile = getTileByCoord(hintCoord.value);
        if (!tile) return;

        let toggleNumber = 6;
        let toggleDelay = 200;
        
        for (let i = 0; i < toggleNumber; i++) {
            setTimeout(() => {
                if (tile) tile.alerted = !tile.alerted;
            }, toggleDelay * i);
        }
        
        setTimeout(() => {
            if (tile) tile.alerted = false;
            if (hintCoord.value) {
                selectTileAt(hintCoord.value);
            }
        }, toggleDelay * toggleNumber);
    };

    const restartGame = async () => {
        selectedCoords.value = null;
        hintCoord.value = null;
        await startGame(currentLayoutName.value);
    };

    const undoMove = async () => {
        if (moveHistory.value.length === 0) return;
        
        const lastMove = moveHistory.value.pop();
        if (lastMove) {
            const t1 = getTileByCoord(lastMove[0]);
            const t2 = getTileByCoord(lastMove[1]);
            
            if (t1 && t2) {
                t1.hidden = false;
                t2.hidden = false;
                
                if (gameState.value === 'deadlock') {
                    gameState.value = 'playing';
                }
                
                updateOpenStatus();
                await checkMovePossible("Undo successful.");
            }
        }
    };

    return {
        statusText,
        tilesState,
        currentCoords,
        selectedCoords,
        hintCoord,
        gameState,
        currentLayoutName,
        startGame,
        returnToMenu,
        selectTileAt,
        triggerHint,
        restartGame,
        undoMove,
        moveHistory,
        hasSavedGame,
        resumeGame,
        showSettingsModal,
        confirmModal,
        triggerConfirmAction,
        cancelConfirmAction,
        executeConfirmAction
    };
});
