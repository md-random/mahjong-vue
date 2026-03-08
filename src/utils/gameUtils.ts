export const shuffle = <T>(list: T[]): void => {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = list[i];
        if (temp !== undefined && list[j] !== undefined) {
             list[i] = list[j] as T;
             list[j] = temp as T;
        }
    }
};

export const interval = <T = number>(a: number, b: number, mapfunction?: (x: number) => T): T[] => {
    if (mapfunction) {
        return new Array(b - a + 1).fill(0).map((_, index) => mapfunction(a + index)) as T[];
    }
    return new Array(b - a + 1).fill(0).map((_, index) => a + index) as unknown as T[];
};

export const matrixInterval = <T>(a: number, b: number, c: number, d: number, mapfunction: (x: number, y: number) => T): T[] => {
    return (interval(c, d, (y) => interval(a, b, (x) => mapfunction(x as number, y as number))) as T[][]).flat(1);
};

export const disjoint = <T extends { toString: () => string }>(list1: T[], list2: T[]): boolean => {
    return list1.every((a) => list2.every((b) => a.toString() !== b.toString()));
};

export const remove = <T extends { toString: () => string }>(element: T, list: T[]): void => {
    const i = list.findIndex((search) => search.toString() === element.toString());
    if (i !== -1) {
        list.splice(i, 1);
    }
};

export const randEl = <T>(list: T[]): T => {
    const index = Math.floor(Math.random() * list.length);
    return list[index] as T;
};

export const sleep = (milliseconds: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
