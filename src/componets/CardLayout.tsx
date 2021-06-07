import React, { useEffect, useState, forwardRef } from "react";
import Clock from "./Clock";
import IFrameView from "./IFrameView";
import GridLayout, {
  WidthProvider,
  Responsive,
  Layouts,
  Layout,
} from "react-grid-layout";
import "../css/cardLayout.css";
import ViewCard from "./Card";
import { useStoreState, useStoreActions } from "../hooks";
import CardData from "../model/card_model";

/**
 * Responsible for managing the layout of card components. Accesses a list of available card data from the store, then maps them into Card Components
 * ```
 *  {availableCards.map((card: CardData, i: number) => {
 *   console.log(i.toString());
 *   return (
 *   <div key={i.toString()}>
 *     <ViewCard data={card} key={i.toString()}>
 *       <IFrameView src={rand<string>(testSources)} />
 *       </ViewCard>
 *       </div>
 *     );
 *   })}
 * ```
 * @component
 *
 */

export const CardGrid = (): JSX.Element => {
  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const availableCards = useStoreState((state) => state.appData.availableCards);
  const ResponsiveGridLayout = WidthProvider(Responsive);

  useEffect(() => {
    console.log("cards changed");
    console.log(availableCards);
    console.log(size.y);
  }, [availableCards]);

  const layout: Layout[] = [
    { i: "clock", x: 0, y: 0, w: 2, h: 1, static: true },
    { i: "0", x: 0, y: 1, w: 1, h: 1, static: true },
    { i: "1", x: 1, y: 1, w: 1, h: 1, minW: 2, maxW: 4 },
    { i: "2", x: 2, y: 1, w: 1, h: 1 },
    { i: "3", x: 3, y: 1, w: 1, h: 1 },
    { i: "4", x: 0, y: 2, w: 1, h: 1 },
    { i: "5", x: 1, y: 2, w: 1, h: 1 },
    { i: "6", x: 2, y: 2, w: 1, h: 1 },
    { i: "7", x: 3, y: 2, w: 1, h: 1 },
    // { i: "clock", x: 0, y: 0, w: 2, h: 1, static: true },
  ];
  const layouts: Layouts = {
    lg: layout,
    md: layout,
    sm: layout,
    xs: layout,
    xxs: layout,
  };

  interface GridProps {
    key: string;
  }

  const testSources = [
    "https://sketchfab.com/models/b70e888cb0ca4b07bfa5b51fe44ecd69/embed?autospin=0.2&amp;autostart=1&amp;preload=1",
    "https://www.youtube.com/embed/sGF6bOi1NfA",
    "http://meipokwan.org/Art/Kaleidoscope.htm",
    "http://tulpinteractive.com/on-time-every-time/",
  ];
  // const input = React.useRef<HTMLDivElement>(null);
  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 }}
      rowHeight={size.y / 3}
      margin={[20, 20]}
    >
      {/* <Component val={"clock"}> */}
      <div key={"clock"}>
        <ViewCard>
          <Clock />
        </ViewCard>
      </div>
      {availableCards.map((card: CardData, i: number) => {
        console.log(i.toString());
        return (
          <div key={i.toString()}>
            <ViewCard data={card} key={i.toString()}>
              <IFrameView src={card.src} />
              {/* <IFrameView src={rand<string>(testSources)} /> */}
              {/* <IFrameView src="https://sketchfab.com/models/b70e888cb0ca4b07bfa5b51fe44ecd69/embed?autospin=0.2&amp;autostart=1&amp;preload=1" /> */}
              {/* <IFrameView src="https://ww.youtube.com/embed/tgbNymZ7vqY" /> */}
            </ViewCard>
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
};
// react-draggable cssTransforms react-resizable react-grid-item
export default CardGrid;
// react-grid-item react-draggable cssTransforms react-resizable

function rand<T>(items: T[]): T {
  // "~~" for a closest "int"
  return items[~~(items.length * Math.random())];
}
