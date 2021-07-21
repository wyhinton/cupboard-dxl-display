import React, { useEffect, useState, FC, useMemo, useRef } from "react";
import Clock from "./Clock";
import IFrameView from "./IFrameView";
import GridLayout, { WidthProvider, Responsive } from "react-grid-layout";
import "../css/cardLayout.css";
import ViewCard from "./ViewCard";
import { useStoreState, useStoreActions } from "../hooks";
import CardData from "../data_structs/CardData";
import { AppMode } from "../enums";
import Modal from "./Modal";
import IXDrop from "./IXDrop";
import type { GridPosition } from "../interfaces/GridPosition";
import { Layout, Layouts } from "react-grid-layout";
import Card from "module";
import { DndTypes } from "../enums";
import classNames from "classnames";
import defaultLayouts from "../static/defaultLayouts";
import TestDrag from "./TestDrag";
/**
 * Responsible for managing the layout of card components. Accesses a list of available card data from the store, then maps them into Card Components
 * @component
 *
 */

export const CardGrid: FC = () => {
  const rows = 3;
  const cols = 4;
  const viewModeState = useStoreState((state) => state.appModel.appMode);
  const setBufferLayoutAction = useStoreActions(
    (actions) => actions.layoutsModel.setBufferLayout
  );

  const currentLayoutState = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );
  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const containerRef = useRef(null);
  const testViewMode = useMemo(() => {
    //only allow dragging/resizing when in edit mode
    console.log(viewModeState);
    console.log(AppMode.EDIT === viewModeState);
    return viewModeState === AppMode.EDIT;
  }, [viewModeState]);

  const [activeCardKey, setActiveCardKey] = useState<string | undefined>(
    undefined
  );
  const lockedCardClass = classNames("locked-card", {
    "locked-card-edit": viewModeState === AppMode.EDIT,
    "locked-card-display": viewModeState !== AppMode.EDIT,
  });

  const activeCards = useStoreState((state) => state.appModel.activeCards);
  const [placeholderCards, setPlaceholderCards] = useState<string[]>([]);
  const [filledLayout, setFilledLayout] = useState(defaultLayouts);
  const [realLayout, setRealLayout] = useState(currentLayoutState?.layout);
  const localLayout = useRef<null | Layouts>(null);
  const ResponsiveGridLayout = WidthProvider(Responsive);

  useEffect(() => {
    console.log("cards changed");
    console.log(currentLayoutState);
    const allGridSpots: GridPosition[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        allGridSpots.push({ x: x, y: y });
      }
    }
    const emptyLayout: Layout[] = [];
    const allBlank = generateFilledLayout(emptyLayout, allGridSpots);
    const justPlaceholders = allBlank.lg
      .filter((l) => l.i.startsWith("empty"))
      .map((l) => l.i);
    // console.log(justPlaceholders);
    setPlaceholderCards(justPlaceholders);
    // console.log(finalLayouts);
    console.log(allBlank);
    setFilledLayout(allBlank);
    setRealLayout(currentLayoutState?.layout);
    console.log(currentLayoutState);
  }, [activeCards, currentLayoutState]);

  const activeKeyRef = useRef("");

  const sharedGridSettings = {
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 },
    rowHeight: size.y / 3.5,
    margin: [20, 20] as [number, number],
    preventCollision: true,
    compactType: null,
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        {realLayout ? (
          <ResponsiveGridLayout
            {...sharedGridSettings}
            className="card-layout"
            layouts={realLayout}
            resizeHandles={["se", "ne", "e", "w"]}
            // onLayoutChange={(l, l ays) => addEditHistory(lays)}
            preventCollision={true}
            verticalCompact={false}
            onDragStart={(
              layout,
              oldItem,
              newItem,
              placeholder,
              e,
              element
            ) => {
              const prevStyle = element.style;
              prevStyle.border = "2px solid cyan";
              element.style.border = "4px solid cyan";
            }}
            onDrop={(layout, item, e) => {
              console.log(layout, item, e);
            }}
            onLayoutChange={(l) => {
              let newLayout: Layouts = {
                lg: l,
                md: l,
                sm: l,
                xs: l,
                xxs: l,
              };
              localLayout.current = newLayout;
              setBufferLayoutAction(localLayout.current);
            }}
            isDraggable={testViewMode}
            isResizable={testViewMode}
          >
            <div key={"clock"}>
              <ViewCard cardType={DndTypes.CLOCK}>
                <Clock />
              </ViewCard>
            </div>

            {activeCards.map((card: CardData, i: number) => {
              console.log(filledLayout);
              return (
                <div
                  //key provided here is the means of accessing a unique identifier for the cards
                  key={card.sourceId}
                  draggable={true}
                  ref={containerRef}
                  // style={cardContainerStyle}
                >
                  <IXDrop
                    key={i}
                    droppableId={card.sourceId}
                    cardType={DndTypes.IFRAME}
                  >
                    <ViewCard
                      cardType={DndTypes.IFRAME}
                      data={card}
                      key={i.toString()}
                      testkey={i.toString()}
                      setModal={() => {
                        console.log(card);
                        activeKeyRef.current = i.toString();
                      }}
                      activeKey={activeKeyRef}
                    >
                      {activeCardKey == i.toString() ? (
                        <Modal text={"hello"}></Modal>
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
          <div className={"centered-flex"}>not loaded</div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        {filledLayout ? (
          <ResponsiveGridLayout
            {...sharedGridSettings}
            className="card-layout"
            layouts={filledLayout}
            resizeHandles={[]}
            preventCollision={true}
            onDrop={(layout, item, e) => {
              console.log(layout, item, e);
            }}
            isDraggable={false}
            isResizable={false}
          >
            {placeholderCards.map((p, i) => {
              return (
                <div key={p}>
                  <IXDrop
                    key={i}
                    droppableId={p}
                    cardType={DndTypes.PLACEHOLDER}
                  >
                    <ViewCard
                      key={p}
                      testkey={p}
                      activeKey={activeKeyRef}
                      cardType={DndTypes.PLACEHOLDER}
                    ></ViewCard>
                  </IXDrop>
                </div>
              );
            })}
          </ResponsiveGridLayout>
        ) : (
          <div className={"centered-flex"}>not loaded</div>
        )}
      </div>
    </div>
  );
};
export default React.memo(CardGrid);

const createLayout = (cards: CardData[], cols: number, rows: number) => {
  let pos: GridPosition = { x: 0, y: 0 };
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // allGridSpots.push({ x: x, y: y });
    }
  }
};

function generateFilledLayout(
  layout: Layout[],
  emptyPosArr: GridPosition[]
): Layouts {
  const emptyCards = emptyPosArr.map((rr) => {
    return {
      x: rr.x,
      y: rr.y,
      w: 1,
      h: 1,
      i: `empty_card_[${rr.x}, ${rr.y}]`,
      minW: 1,
      maxW: 1,
      minH: 1,
      maxH: 1,
      static: false,
      // static: true,
      isDraggable: false,
      isResizable: false,
      resizeHandles: [],
    } as Layout;
  });
  //TODO: MORE FUNCTIONAL SOLUTION
  const filled = layout.concat(emptyCards);
  //pop off the first two positions where the clock is
  filled.shift();
  filled.shift();
  return {
    lg: filled,
    md: filled,
    sm: filled,
    xs: filled,
    xxs: filled,
  };
}

function findFilledPositions(layouts: Layout[]): GridPosition[] {
  const takenSpots: GridPosition[] = [];
  layouts.forEach((l) => {
    takenSpots.push({ x: l.x, y: l.y });
    for (let i = 1; i < l.w; i++) {
      const fullSpotX: GridPosition = {
        x: l.x + i,
        y: l.y,
      };
      takenSpots.push(fullSpotX);
    }
    for (let i = 1; i < l.h; i++) {
      const fullSpotY: GridPosition = {
        x: l.x,
        y: l.y + i,
      };
      takenSpots.push(fullSpotY);
    }
  });
  return takenSpots;
}
function findEmptyGridPositions(
  layouts: Layout[],
  rows: number,
  cols: number
): GridPosition[] {
  const allGridSpots: GridPosition[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      allGridSpots.push({ x: x, y: y });
    }
  }
  const filledSpots = findFilledPositions(layouts);
  const stringFilledSpots = filledSpots.map((fs) => [fs.x, fs.y].toString());

  return allGridSpots.filter(
    (gs) => !stringFilledSpots.includes([gs.x, gs.y].toString())
  );
}

// activeCards.map((card: CardData, i: number) => {
//   return (
//     <div
//       //key provided here is the means of accesing a unique identifier for the cards
//       key={card.sourceId}
//       // style={cardContainerStyle}
//     >
//       <IXDrop key={i} droppableId={card.sourceId}>
//         <ViewCard
//           data={card}
//           key={i.toString()}
//           testkey={i.toString()}
//           setModal={() => {
//             console.log(card);
//             // if (card.sourceId !== "clock") {
//             activeKeyRef.current = i.toString();
//             // }
//           }}
//           activeKey={activeKeyRef}
//         >
//           {activeCardKey == i.toString() ? (
//             <Modal text={"hello"}></Modal>
//           ) : (
//             <div></div>
//           )}

//           <IFrameView src={card.src} />
//         </ViewCard>
//       </IXDrop>
//     </div>
//   );
// });

// we need to memo any children of the gird layout to avoid re-renders
//github.com/react-grid-layout/react-grid-layout
// const memoCards = useMemo(() => {
//   return activeCards.map((card: CardData, i: number) => {
//     return (
//       <div
//         //key provided here is the means of accesing a unique identifier for the cards
//         key={card.sourceId}
//         // style={cardContainerStyle}
//         onMouseUp={(e) => {
//           console.log(e.target);
//           console.log(i);
//         }}
//         onMouseDown={(e) => {
//           console.log(e);
//         }}
//       >
//         <IXDrop key={i} droppableId={card.sourceId}>
//           <ViewCard
//             data={card}
//             key={i.toString()}
//             testkey={i.toString()}
//             setModal={() => {
//               activeKeyRef.current = i.toString();
//             }}
//             activeKey={activeKeyRef}
//           >
//             {activeCardKey == i.toString() ? (
//               <Modal text={"hello"}></Modal>
//             ) : (
//               <div></div>
//             )}

//             <IFrameView src={card.src} />
//           </ViewCard>
//         </IXDrop>
//       </div>
//     );
//   });
// }, [activeCards]);
