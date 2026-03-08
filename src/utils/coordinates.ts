import { interval, matrixInterval } from "./gameUtils";
import type { Coordinate } from "../types/game";

const classicLevel0: Coordinate[] = [
    ...(interval(1, 12, (x) => [x as number, 0, 0] as Coordinate)),
    ...(interval(3, 10, (x) => [x as number, 1, 0] as Coordinate)),
    ...(interval(2, 11, (x) => [x as number, 2, 0] as Coordinate)),
    [0, 3.5, 0] as Coordinate,
    ...(interval(1, 12, (x) => [x as number, 3, 0] as Coordinate)),
    ...(interval(1, 12, (x) => [x as number, 4, 0] as Coordinate)),
    [13, 3.5, 0] as Coordinate,
    [14, 3.5, 0] as Coordinate,
    ...(interval(2, 11, (x) => [x as number, 5, 0] as Coordinate)),
    ...(interval(3, 10, (x) => [x as number, 6, 0] as Coordinate)),
    ...(interval(1, 12, (x) => [x as number, 7, 0] as Coordinate)),
].reverse();

const classicLevel1: Coordinate[] = (matrixInterval(4, 9, 1, 6, (x, y) => [x, y, 1]) as Coordinate[]).reverse();
const classicLevel2: Coordinate[] = (matrixInterval(5, 8, 2, 5, (x, y) => [x, y, 2]) as Coordinate[]).reverse();
const classicLevel3: Coordinate[] = (matrixInterval(6, 7, 3, 4, (x, y) => [x, y, 3]) as Coordinate[]).reverse();
const classicLevel4: Coordinate[] = [[6.5, 3.5, 4]];

export const LAYOUT_CLASSIC: Coordinate[] = [...classicLevel0, ...classicLevel1, ...classicLevel2, ...classicLevel3, ...classicLevel4];

export const LAYOUT_DEEP_WELL: Coordinate[] = (() => {
    const deepWell: Coordinate[] = [];
    for (let z = 0; z < 5; z++) {
        for (let x = 4; x <= 9; x++) {
            deepWell.push([x, 1, z]);
            deepWell.push([x, 6, z]);
        }
        for (let y = 2; y <= 5; y++) {
            deepWell.push([4, y, z]);
            deepWell.push([9, y, z]);
        }
    }
    for (let z = 0; z < 3; z++) {
        for (let x = 5; x <= 8; x++) {
            deepWell.push([x, 2, z]);
            deepWell.push([x, 5, z]);
        }
        for (let y = 3; y <= 4; y++) {
            deepWell.push([5, y, z]);
            deepWell.push([8, y, z]);
        }
    }
    for (let z = 0; z < 2; z++) {
        for (let x = 6; x <= 7; x++) {
            deepWell.push([x, 3, z]);
            deepWell.push([x, 4, z]);
        }
    }
    return deepWell;
})();

export const LAYOUT_EIGHT_STACKS: Coordinate[] = (() => {
    const eightStacks: Coordinate[] = [];
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
            const startX = 1 + (col * 3.5);
            const startY = 1 + (row * 4);
            for (let z = 0; z < 4; z++) {
                for (let dx = 0; dx <= 1; dx++) {
                    for (let dy = 0; dy <= 1; dy++) {
                        eightStacks.push([startX + dx, startY + dy, z]);
                    }
                }
            }
            eightStacks.push([startX + 0.5, startY, 4]);
            eightStacks.push([startX + 0.5, startY + 1, 4]);
        }
    }
    return eightStacks;
})();

const parseFish = (layers: string[]): Coordinate[] => {
    const coords: Coordinate[] = [];
    for (let z = 0; z < layers.length; z++) {
        const layerStr = layers[z];
        if (!layerStr) continue;
        const rows = layerStr.split('\n').filter(r => r.length > 0);
        for (let y = 0; y < rows.length; y++) {
            const rowStr = rows[y];
            if (!rowStr) continue;
            for (let x = 0; x < rowStr.length; x++) {
                if (rowStr[x] === '1') {
                    coords.push([x + 0.5, y, z]);
                }
            }
        }
    }
    return coords;
}

export const LAYOUT_FISH: Coordinate[] = parseFish([
`     11       
   111111     
 1111111111 1 
11111111111111
11111111111111
 1111111111 1 
   111111     
     11       `,
`              
    1111      
  11111111    
 1111111111   
 1111111111   
  11111111    
    1111      
              `,
`              
              
   111111     
  11111111    
  11111111    
   111111     
              
              `,
`              
              
              
   111        
   111        
              
              
              `
]);


export const LAYOUTS: Record<string, Coordinate[]> = {
    'Classic Turtle': LAYOUT_CLASSIC,
    'Deep Well': LAYOUT_DEEP_WELL,
    'Eight Stacks': LAYOUT_EIGHT_STACKS,
    'Fish': LAYOUT_FISH
};
export const isOpen = (coord: Coordinate, currentCoords: Coordinate[]): boolean => {
    const [x, y, z] = coord;
    let blockedOnTop = false;
    let blockedLeft = false;
    let blockedRight = false;
    
    for (const other of currentCoords) {
        if (other[0] === x && other[1] === y && other[2] === z) continue;
        
        const [ox, oy, oz] = other;
        
        const yOverlaps = Math.abs(y - oy) < 1.0;
        const xOverlaps = Math.abs(x - ox) < 1.0;
        
        if (oz > z && xOverlaps && yOverlaps) {
            blockedOnTop = true;
            break;
        }
        
        if (oz === z && yOverlaps && ox < x && (x - ox) <= 1.0) {
            blockedLeft = true;
        }
        
        if (oz === z && yOverlaps && ox > x && (ox - x) <= 1.0) {
            blockedRight = true;
        }
    }
    
    if (blockedOnTop) return false;
    return !blockedLeft || !blockedRight;
}
