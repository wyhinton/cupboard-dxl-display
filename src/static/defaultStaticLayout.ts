import { Layout, Layouts } from "react-grid-layout";
import LayoutData, { ExtendedLayout } from "../data_structs/LayoutData";
import RawLayoutRow from "../interfaces/RawLayoutRow";
// const availableHandles: ResizeHandle[] = [
//   "s",
//   "w",
//   "e",
//   "n",
//   "sw",
//   "nw",
//   "se",
//   "ne",
// ];
const defaultGridLayoutArray: Layout[] = [
  // { i: "clock", x: 0, y: 0, w: 2, h: 1, static: true },
  {
    i: "https://codepen.io/rcyou/embed/QEObEk?height=265&theme-id=light&default-tab=css,result",
    x: 2,
    y: 2,
    w: 1,
    h: 1,
    static: false,
  },
  {
    i: "https://sketchfab.com/models/e55956fee6444011b574bad021a03eae/embed?autostart=1",
    x: 3,
    y: 0,
    w: 1,
    h: 1,
    minW: 1,
  },
  {
    i: "https://www.lib.ncsu.edu/huntlibrary",
    x: 3,
    y: 1,
    w: 1,
    h: 1,
    minW: 1,
  },
];

// {"layout":{"lg":[{"w":2,"h":1,"x":0,"y":0,"i":"clock","moved":false,"static":true},{"w":2,"h":2,"x":2,"y":0,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png","moved":false,"static":false},{"w":1,"h":2,"x":0,"y":1,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg","moved":false,"static":false}],"md":[{"w":2,"h":1,"x":0,"y":0,"i":"clock","moved":false,"static":true},{"w":2,"h":2,"x":2,"y":0,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png","moved":false,"static":false},{"w":1,"h":2,"x":0,"y":1,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg","moved":false,"static":false}],"sm":[{"w":2,"h":1,"x":0,"y":0,"i":"clock","moved":false,"static":true},{"w":2,"h":2,"x":2,"y":0,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png","moved":false,"static":false},{"w":1,"h":2,"x":0,"y":1,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg","moved":false,"static":false}],"xs":[{"w":2,"h":1,"x":0,"y":0,"i":"clock","moved":false,"static":true},{"w":2,"h":2,"x":2,"y":0,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png","moved":false,"static":false},{"w":1,"h":2,"x":0,"y":1,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg","moved":false,"static":false}],"xxs":[{"w":2,"h":1,"x":0,"y":0,"i":"clock","moved":false,"static":true},{"w":2,"h":2,"x":2,"y":0,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/DuBois_Racism.png","moved":false,"static":false},{"w":1,"h":2,"x":0,"y":1,"i":"https://raw.githubusercontent.com/wyhinton/dxl_content/master/images/VideoGames.jpeg","moved":false,"static":false}]},"layoutSettings":{"gridSettings":{"defaultBackgroundColor":"red"},"cardSettings":[]}}

// const defaultGridLayoutArr: Layout[] = [
//   { i: "clock", x: 0, y: 0, w: 2, h: 1, static: true },
//   {
//     i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_1",
//     x: 0,
//     y: 1,
//     w: 1,
//     h: 1,
//     static: true,
//   },
//   {
//     i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_3",
//     x: 2,
//     y: 0,
//     w: 1,
//     h: 1,
//     minW: 2,
//     maxW: 4,
//   },
//   { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_3", x: 2, y: 0, w: 1, h: 1 },
//   { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_3", x: 3, y: 0, w: 1, h: 1 },
//   { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_5", x: 0, y: 1, w: 1, h: 1 },
//   { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_6", x: 1, y: 1, w: 1, h: 1 },
//   { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_7", x: 2, y: 1, w: 1, h: 1 },
//   { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_8", x: 3, y: 1, w: 1, h: 1 },
//   { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_9", x: 0, y: 3, w: 1, h: 1 },
//   { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_10", x: 1, y: 3, w: 1, h: 1 },
// ];

const defaultStaticLayout: ExtendedLayout = {
  layout: {
    lg: defaultGridLayoutArray,
    md: defaultGridLayoutArray,
    sm: defaultGridLayoutArray,
    xs: defaultGridLayoutArray,
    xxs: defaultGridLayoutArray,
  },
  layoutSettings: {
    cardSettings: [],
    gridSettings: {
      defaultBackgroundColor: "red"
    }
  }
};

const fakeLayoutRow: RawLayoutRow = {
  title: "default static layout",
  author: "webb",
  timestamp: "1/1/2021",
  layout: JSON.stringify(defaultStaticLayout),
  interaction: "active",
}

const defaultLayoutData = new LayoutData(fakeLayoutRow)

// console.log(JSON.stringify(defaultLayouts));
export default defaultLayoutData;
