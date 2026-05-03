export type Coordinate = [number, number, number];

export interface TileData {
  id: number;
  type: string;
  src: string;
}

export interface TileState {
  coord: Coordinate;
  tileData: TileData;
  selected: boolean;
  alerted: boolean;
  hidden: boolean;
  isOpen: boolean;
  animating?: boolean;
}
