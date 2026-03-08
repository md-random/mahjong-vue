import type { TileData } from "../types/game";

export const TILE_WIDTH = 56;
export const TILE_HEIGHT = 80;

const types = [
    { name: "dots", number: 9, multiplicity: 4 },
    { name: "bamboo", number: 9, multiplicity: 4 },
    { name: "character", number: 9, multiplicity: 4 },
    { name: "wind", number: 4, multiplicity: 4 },
    { name: "dragon", number: 3, multiplicity: 4 },
    { name: "flower", number: 4, multiplicity: 1 },
    { name: "season", number: 4, multiplicity: 1 },
];

export const generateTileDataMap = (): TileData[] => {
    const tileDataArray: TileData[] = [];
    let idCounter = 0;

    for (const type of types) {
        for (let j = 1; j <= type.number; j++) {
            for (let i = 1; i <= type.multiplicity; i++) {
                tileDataArray.push({
                    id: idCounter++,
                    type: type.multiplicity > 1 ? `${type.name}${j}` : type.name,
                    src: `img/${type.name}${j}.png`
                });
            }
        }
    }
    return tileDataArray;
};
