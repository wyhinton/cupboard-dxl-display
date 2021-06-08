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
import testDefaultLayout from "../static/default_layout";
import { ViewMode } from "../model/enums";
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
  const availableHandles = ["s", "w", "e", "n", "sw", "nw", "se", "ne"];
  // const originalLayout = getFromLS("layout") || [];
  const viewMode = useStoreState((state) => state.appData.viewMode);
  const currentLayout = useStoreState((state) => state.appData.currentLayout);
  const [cardContainerStyle, setCardContainerStyle] = useState({
    display: "block",
  } as React.CSSProperties);
  const setCurrentLayout = useStoreActions(
    (actions) => actions.appData.setCurrentLayout
  );

  const availableCards = useStoreState((state) => state.appData.availableCards);
  const activeCards = useStoreState((state) => state.appData.activeCards);
  const [viewModeProps, setViewModeProps] = useState({
    isDraggable: false,
    isResizable: false,
  });
  const ResponsiveGridLayout = WidthProvider(Responsive);
  useEffect(() => {
    console.log("cards changed");
    console.log(availableCards);
    console.log(size.y);
  }, [availableCards, activeCards, currentLayout]);

  useEffect(() => {
    setViewModeProps({
      isDraggable: viewMode === ViewMode.EDIT ? true : false,
      isResizable: viewMode === ViewMode.EDIT ? true : false,
    });
    viewMode == ViewMode.EDIT
      ? setCardContainerStyle({ border: "1px solid blue" })
      : setCardContainerStyle({ border: "none" });
  }, [viewMode]);

  const layouts: Layouts = {
    lg: currentLayout,
    md: currentLayout,
    sm: currentLayout,
    xs: currentLayout,
    xxs: currentLayout,
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 }}
      rowHeight={size.y / 3}
      margin={[20, 20]}
      resizeHandle={TestHandle}
      resizeHandles={["se"]}
      {...viewModeProps}
    >
      <div key={"clock"} style={cardContainerStyle}>
        <ViewCard>
          <Clock />
        </ViewCard>
      </div>
      {activeCards.map((card: CardData, i: number) => {
        console.log(i.toString());
        return (
          <div key={i.toString()} style={cardContainerStyle}>
            <ViewCard data={card} key={i.toString()}>
              <IFrameView src={card.src} />
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

const TestHandle = ({}) => {
  // const handleStyle = {
  //   width: 10,
  //   height: 10,
  //   backgroundColor: "red",
  //   zIndex: 1,
  // };
  return <div className="react-resizable-handle"></div>;
};
//TODO: BETTER NULL HANDLING
// function getFromLS(key: string): any {
//   let ls = {};
//   if (global.localStorage) {
//     try {
//       ls = JSON.parse(global.localStorage.getItem("rgl-7") ?? "");
//       // ls = JSON.parse(global.localStorage.getItem("rgl-7")) || {};
//     } catch (e) {
//       /*Ignore*/
//     }
//   }
//   return ls[key];
// }

// function saveToLS(key: string, value: Layout[]) {
//   if (global.localStorage) {
//     global.localStorage.setItem(
//       "rgl-7",
//       JSON.stringify({
//         [key]: value,
//       })
//     );
//   }
// }

/**
 * Check if localStorage has an Item / exists with the give key
 * @param key the key of the Item
 */
// function localStorage_hasItem(key) {
//   return localStorage.getItem(key) !== null;
// }
