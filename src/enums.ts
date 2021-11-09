export enum AppMode {
  DISPLAY = "DISPLAY",
  EDIT = "EDIT",
  CYCLE = "CYCLE",
}

export enum CardView {
  GRID = "GRID",
  PREVIEW = "PREVIEW",
  FULL_SCREEN = "FULL_SCREEN",
}

export enum DragType {
  CARD_TABLE_DATA = "CARD_TABLE_DATA",
  DISPLAY_CARD = "DISPLAY_CARD",
}

export enum InteractionType {
  ACTIVE = "ACTIVE",
  STATIC = "STATIC",
  FIXED = "FIXED",
  IMAGE = "IMAGE",
}

export enum DndTypes {
  PLACEHOLDER = "PLACEHOLDER",
  CLOCK = "CLOCK",
  IFRAME = "IFRAME",
  CARD_ROW = "CARD_ROW",
  LAYOUT = "LAYOUT",
  WIDGET = "WIDGET",
}

export enum DragSource {
  LAYOUT_TABLE = "LAYOUT_TABLE",
  CARD_TABLE = "CARD_TABLE",
  CARD_GRID = "CARD_GRID",
  WIDGETS_TABLE = "WIDGETS_TABLE"
}

export type SheetNames = "CARDS" | "LAYOUTS" | "TOP_LEVEL"