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
      defaultBackgroundColor: "red",
    },
  },
  widgets: [],
};

const fakeLayoutRow: RawLayoutRow = {
  title: "default static layout",
  author: "webb",
  timestamp: "1/1/2021",
  layout: JSON.stringify(defaultStaticLayout),
  interaction: "active",
};

const defaultLayoutData = new LayoutData(fakeLayoutRow);

// console.log(JSON.stringify(defaultLayouts));
// export default defaultLayoutData;

export default null;

// const defaultLayoutData =" f"
// export default defaultLayoutData;
