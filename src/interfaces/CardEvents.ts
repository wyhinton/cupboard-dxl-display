import CardData from "../data_structs/CardData";
// import { GridPosition } from '../data_structs/LayoutData';
import type { GridPosition } from "./GridPosition";

export interface CardAddEvent {
  sourceId: string;
  targetPosition: GridPosition;
}
export interface CardSwapEvent {
  sourceId: string;
  targetId: string;
}
export interface CardDeleteEvent {
  sourceId: string;
}
