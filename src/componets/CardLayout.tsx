import React, { useEffect, useState, forwardRef, useRef } from "react";
import Clock from "./Clock";
import IFrameView from "./IFrameView";
import GridLayout, { WidthProvider, Responsive } from "react-grid-layout";
import "../css/cardLayout.css";
import ViewCard from "./Card";
import { useStoreState, useStoreActions } from "../hooks";
import CardData from "../data_structs/cardData";
import { AppMode } from "../enums";
import TestModal from "./TestModal";
import TestForward from "./TestForward";
import IXDrop from "./IXDrop";
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
  const viewModeState = useStoreState((state) => state.appData.appMode);
  const currentLayoutState = useStoreState(
    (state) => state.layoutsData.activeLayout
  );
  // const currentLayout = useStoreState((state) => state.appData.currentLayout);
  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  // const elementRef = useRef<HTMLDivElement>(null);

  const [cardContainerStyle, setCardContainerStyle] = useState({
    display: "block",
    height: "100%",
  } as React.CSSProperties);
  // const elementRef = useRef();
  // const longPressEvent = useLongPress(onLongPress,)
  const [activeCardKey, setActiveCardKey] =
    useState<string | undefined>(undefined);
  const addEditHistory = useStoreActions(
    (actions) => actions.historyData.addEditHistory
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
    console.log(currentLayoutState);
  }, [availableCards, activeCards, currentLayoutState]);

  // useEffect(() => {
  //   console.log("active key chaged");
  //   console.log(activeCardKey);
  // }, [activeCardKey]);
  const activeKeyRef = useRef("");

  useEffect(() => {
    setViewModeProps({
      isDraggable: viewModeState === AppMode.EDIT ? true : false,
      isResizable: viewModeState === AppMode.EDIT ? true : false,
    });
    viewModeState == AppMode.EDIT
      ? setCardContainerStyle({ border: "1px solid blue" })
      : setCardContainerStyle({ border: "none" });
  }, [viewModeState]);
  const [portal, setPortal] = useState(undefined);

  return (
    <div>
      {currentLayoutState ? (
        <ResponsiveGridLayout
          className="card-layout"
          layouts={currentLayoutState.layout}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 }}
          rowHeight={size.y / 3}
          margin={[20, 20]}
          resizeHandles={["se", "ne", "e", "w"]}
          onLayoutChange={(l, lays) => addEditHistory(lays)}
          preventCollision={false}
          onDragStart={(layout, oldItem, newItem, placeholder, e, element) => {
            const prevStyle = element.style;
            prevStyle.border = "2px solid cyan";
            element.style.border = "4px solid cyan";
            console.log(prevStyle);
          }}
          onDragStop={(layout, oldItem, newItem, placeholder, e, element) => {
            console.log("drag ended");
            // console.log(item);
            console.log(element);
            element.style.border = "2px solid blue";
          }}
          {...viewModeProps}
        >
          <div key={"clock"} style={cardContainerStyle}>
            <ViewCard>
              <Clock />
            </ViewCard>
          </div>
          {activeCards.map((card: CardData, i: number) => {
            return (
              <div
                //key provided here is the means of accesing a unique identifier for the cards
                // key={i.toString()}
                key={card.instanceId}
                style={cardContainerStyle}
                onMouseUp={(e) => {
                  console.log(e.target);
                  console.log(i);
                }}
                onMouseDown={(e) => {
                  console.log(e);
                }}
              >
                <IXDrop key={i} droppableId={card.instanceId}>
                  <ViewCard
                    data={card}
                    key={i.toString()}
                    testkey={i.toString()}
                    setModal={() => {
                      activeKeyRef.current = i.toString();
                    }}
                    activeKey={activeKeyRef}
                  >
                    {activeCardKey == i.toString() ? (
                      <TestModal text={"hello"}></TestModal>
                    ) : (
                      <div></div>
                    )}

                    <IFrameView src={card.src} />
                  </ViewCard>
                </IXDrop>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      ) : (
        <div>not loaded</div>
      )}
    </div>
  );
};
export default React.memo(CardGrid);
