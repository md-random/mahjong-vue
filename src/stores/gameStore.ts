import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Coordinate, TileData, TileState } from '../types/game';
import { LAYOUTS, isOpen } from '../utils/coordinates';
import { generateTileDataMap } from '../utils/images';
import { shuffle, randEl, sleep } from '../utils/gameUtils';

export const useGameStore = defineStore('game', () => {
    const statusText = ref<string>('');
    const tilesState = ref<TileState[]>([]);
    const selectedCoords = ref<Coordinate | null>(null);
    const hintCoord = ref<Coordinate | null>(null);
    const gameState = ref<'start' | 'playing'>('start');
    const currentLayoutName = ref<string>('Classic Turtle');

    const currentCoords = computed<Coordinate[]>(() => 
        tilesState.value.filter(t => !t.hidden).map(t => t.coord)
    );

    const writeStatus = (text: string) => {
        statusText.value = text;
    };

    const startGame = async (layoutName: string = 'Classic Turtle') => {
        gameState.value = 'playing';
        currentLayoutName.value = layoutName;
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
        selectedCoords.value = null;
        hintCoord.value = null;
        
        tile1.hidden = true;
        tile1.selected = false;
        tile2.hidden = true;
        tile2.selected = false;

        updateOpenStatus();

        if (currentCoords.value.length === 0) {
            writeStatus("You won! 🎉");
        } else {
            await checkMovePossible("Computing...");
        }
    };

    const selectTileAt = (coord: Coordinate) => {
        const tile = getTileByCoord(coord);
        if (!tile || !tile.isOpen) return;

        if (selectedCoords.value) {
            if (coord.toString() === selectedCoords.value.toString()) {
                tile.selected = false;
                selectedCoords.value = null;
                return;
            } else {
                const selectedTile = getTileByCoord(selectedCoords.value);
                if (selectedTile && tile.tileData.type === selectedTile.tileData.type) {
                    executeMove(tile, selectedTile);
                    return;
                }
            }
        }
        
        if (selectedCoords.value) {
            const prevSelected = getTileByCoord(selectedCoords.value);
            if (prevSelected) prevSelected.selected = false;
        }
        selectedCoords.value = coord;
        tile.selected = true;
    };

    const triggerHint = async () => {
        if (!hintCoord.value) return;
        const tile = getTileByCoord(hintCoord.value);
        if (!tile) return;

        let toggleNumber = 6;
        let toggleDelay = 200;
        
        for (let i = 0; i < toggleNumber; i++) {
            setTimeout(() => {
                tile.alerted = !tile.alerted;
            }, toggleDelay * i);
        }
        
        setTimeout(() => {
            tile.alerted = false;
            selectTileAt(hintCoord.value!);
        }, toggleDelay * toggleNumber);
    };

    const restartGame = async () => {
        selectedCoords.value = null;
        hintCoord.value = null;
        await startGame(currentLayoutName.value);
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
        restartGame
    };
});
