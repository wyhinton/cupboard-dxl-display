import type { ExtendedLayout, GridSettings, LayoutSettings } from "../data_structs/LayoutData"

const layout = { "lg": [{ "w": 2, "h": 1, "x": 0, "y": 0, "i": "clock", "moved": false, "static": true }, { "w": 2, "h": 2, "x": 2, "y": 0, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png", "moved": false, "static": false }, { "w": 1, "h": 2, "x": 0, "y": 1, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg", "moved": false, "static": false }], "md": [{ "w": 2, "h": 1, "x": 0, "y": 0, "i": "clock", "moved": false, "static": true }, { "w": 2, "h": 2, "x": 2, "y": 0, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png", "moved": false, "static": false }, { "w": 1, "h": 2, "x": 0, "y": 1, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg", "moved": false, "static": false }], "sm": [{ "w": 2, "h": 1, "x": 0, "y": 0, "i": "clock", "moved": false, "static": true }, { "w": 2, "h": 2, "x": 2, "y": 0, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png", "moved": false, "static": false }, { "w": 1, "h": 2, "x": 0, "y": 1, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg", "moved": false, "static": false }], "xs": [{ "w": 2, "h": 1, "x": 0, "y": 0, "i": "clock", "moved": false, "static": true }, { "w": 2, "h": 2, "x": 2, "y": 0, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png", "moved": false, "static": false }, { "w": 1, "h": 2, "x": 0, "y": 1, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg", "moved": false, "static": false }], "xxs": [{ "w": 2, "h": 1, "x": 0, "y": 0, "i": "clock", "moved": false, "static": true }, { "w": 2, "h": 2, "x": 2, "y": 0, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png", "moved": false, "static": false }, { "w": 1, "h": 2, "x": 0, "y": 1, "i": "https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg", "moved": false, "static": false }] }

const gridSettings: GridSettings = {
    defaultBackgroundColor: "red"
}
const layoutSettings: LayoutSettings  = {
    gridSettings: gridSettings,
    cardSettings: [],
}

const extendedLayoutTest: ExtendedLayout = {
    layout: layout,
    layoutSettings: layoutSettings,
    widgets: [],
}

export default extendedLayoutTest