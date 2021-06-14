import { Layout, Layouts } from "react-grid-layout";
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
const defaultGridLayoutArr: Layout[] = [
  { i: "clock", x: 0, y: 0, w: 2, h: 1, static: true },
  {
    i: "0",
    x: 0,
    y: 1,
    w: 1,
    h: 1,
    static: true,
  },
  {
    i: "1",
    x: 1,
    y: 1,
    w: 1,
    h: 1,
    minW: 2,
    maxW: 4,
  },
  { i: "2", x: 2, y: 1, w: 1, h: 1 },
  { i: "3", x: 3, y: 1, w: 1, h: 1 },
  { i: "4", x: 0, y: 2, w: 1, h: 1 },
  { i: "5", x: 1, y: 2, w: 1, h: 1 },
  { i: "6", x: 2, y: 2, w: 1, h: 1 },
  { i: "7", x: 3, y: 2, w: 1, h: 1 },
];

const defaultLayouts: Layouts = {
  lg: defaultGridLayoutArr,
  md: defaultGridLayoutArr,
  sm: defaultGridLayoutArr,
  xs: defaultGridLayoutArr,
  xxs: defaultGridLayoutArr,
};

export default defaultLayouts;
