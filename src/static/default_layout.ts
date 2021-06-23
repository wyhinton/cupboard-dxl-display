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
    i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_1",
    x: 0,
    y: 1,
    w: 1,
    h: 1,
    static: true,
  },
  {
    i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_3",
    x: 2,
    y: 0,
    w: 1,
    h: 1,
    minW: 2,
    maxW: 4,
  },
  { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_3", x: 2, y: 0, w: 1, h: 1 },
  { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_3", x: 3, y: 0, w: 1, h: 1 },
  { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_5", x: 0, y: 1, w: 1, h: 1 },
  { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_6", x: 1, y: 1, w: 1, h: 1 },
  { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_7", x: 2, y: 1, w: 1, h: 1 },
  { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_8", x: 3, y: 1, w: 1, h: 1 },
  { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_9", x: 0, y: 3, w: 1, h: 1 },
  { i: "b2d9c003-8edc-4304-a05e-d78b9e8f782f_10", x: 1, y: 3, w: 1, h: 1 },
];

const defaultLayouts: Layouts = {
  lg: defaultGridLayoutArr,
  md: defaultGridLayoutArr,
  sm: defaultGridLayoutArr,
  xs: defaultGridLayoutArr,
  xxs: defaultGridLayoutArr,
};

export default defaultLayouts;
