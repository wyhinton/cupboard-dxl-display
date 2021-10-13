import CardData from '../../data_structs/CardData';
import Clock from '../Clock';
import defaultLayouts from '../../static/defaultLayouts';
import IFrameView from '../IFrameView';
import IXDrop from '../IXDrop';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState
  } from 'react';
import ViewCard from './ViewCard/ViewCard';
import { AppMode, DndTypes } from '../../enums';
import {
  Layout,
  Layouts,
  Responsive,
  WidthProvider
  } from 'react-grid-layout';
import { useStoreActions, useStoreState } from '../../hooks';
import '../../css/cardLayout.css';
import type { GridPosition } from "../../interfaces/GridPosition";
import GuideGrid from './GuideGrid';

export const CardGrid = (): JSX.Element => {
  const rows = 3;
  const cols = 4;
  const viewModeState = useStoreState((state) => state.appModel.appMode);
  const setBufferLayoutAction = useStoreActions(
    (actions) => actions.layoutsModel.setBufferLayout
  );

  const currentLayoutState = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );
  //use the size of the window in order to set the height of the cards
  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  const isEditMode = useMemo(() => {
    return viewModeState === AppMode.EDIT;
  }, [viewModeState]);

  const activeCards = useStoreState((state) => state.appModel.activeCards);
  const [placeholderCards, setPlaceholderCards] = useState<string[]>([]);
  const [filledLayout, setFilledLayout] = useState(defaultLayouts);
  const [realLayout, setRealLayout] = useState(currentLayoutState?.layout);

  //keep a local mutable reference to a layout in order to avoid making excess calls to store and causing re-renders on each new edit
  const localLayout = useRef<null | Layouts>(null);

  //each card has a unique key. Clicking a card sets the current active key. If a card's key is equal to the active key
  //then it will be rendered into the modal popup
  const activeKeyReference = useRef("");

  const removeItem = (id: string, layout: Layouts): void => {
    const old = { ...localLayout.current };
    if (old) {
      for (const [k, v] of Object.entries(old)) {
        old[k] = v.filter((l) => l.i !== id);
      }
    }
    localLayout.current = old;
  };

  const ResponsiveGridLayout = WidthProvider(Responsive);

  useEffect(() => {
    const allBlank = generateFilledLayout(rows, cols);
    const justPlaceholders = allBlank.lg
      .filter((l) => l.i.startsWith("empty"))
      .map((l) => l.i);
    setPlaceholderCards(justPlaceholders);
    setFilledLayout(allBlank);
    setRealLayout(currentLayoutState?.layout);
    if (currentLayoutState?.layout) {
      localLayout.current = currentLayoutState?.layout;
    }
  }, [activeCards, currentLayoutState]);
  useEffect(()=>{},[realLayout])
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
              <ResponsiveGridLayout
              {...sharedGridSettings}
              className="card-layout"
              layouts={realLayout}
              resizeHandles={["se"]}
              preventCollision={true}
              verticalCompact={true}
              isBounded={true}
              onDragStart={(
                layout,
                oldItem,
                newItem,
                placeholder,
                e,
                element
              ) => {
                console.log(oldItem);
                console.log(newItem);
                console.log(e);
                const previousStyle = element.style;
                previousStyle.border = "2px solid cyan";
                element.style.border = "4px solid cyan";
              }}
              onDragStop={(
                layout,
                oldItem,
                newItem,
                placeholder,
                e,
                element
              ) => {
                console.log(oldItem);
                console.log(newItem);
                // const previousStyle = element.style;
                // previousStyle.border = "2px solid cyan";
                // element.style.border = "4px solid cyan";
              }}
              onDrop={(layout, item, e) => {
                console.log(layout, item, e);
              }}
              onLayoutChange={(l) => {
                console.log(l);
                const newLayout: Layouts = {
                  lg: l,
                  md: l,
                  sm: l,
                  xs: l,
                  xxs: l,
                };
                localLayout.current = newLayout;
                setBufferLayoutAction(localLayout.current);
              }}
              isDraggable={isEditMode}
              isResizable={isEditMode}
            >
              <div key={"clock"}>
                <ViewCard cardType={DndTypes.CLOCK} onClick = {()=>{console.log("clock clicked");}}>
                  <Clock />
                </ViewCard>
              </div>
  
              {activeCards.map((card: CardData, index: number) => {
                return (
                  <div
                    //key provided here is the means of accessing a unique identifier for the cards
                    key={card.sourceId}
                    draggable={true}
                    className = {cardContainerClass(card, viewModeState)}
                  >
                    <IXDrop
                      key={index}
                      droppableId={card.sourceId}
                      cardType={DndTypes.IFRAME}
                    >
                      <ViewCard
                        cardType={DndTypes.IFRAME}
                        data={card}
                        key={index.toString()}
                        cardId={index.toString()}
                        onClick={() => {
                          activeKeyReference.current = index.toString();
                        }}
                        activeKey={activeKeyReference}
                      >
                        <IFrameView card = {card} src={card.src} />
                      </ViewCard>
                    </IXDrop>
                  </div>
                );
              })}
            </ResponsiveGridLayout>
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
        <GuideGrid layout={filledLayout} gridSettings={sharedGridSettings} cards = {placeholderCards}></GuideGrid>
        {/* {filledLayout ? (
          <ResponsiveGridLayout
            {...sharedGridSettings}
            className="card-layout"
            layouts={filledLayout}
            resizeHandles={[]}
            preventCollision={true}
            isDraggable={false}
            isResizable={false}
          >
            {placeholderCards.map((p, index) => {
              return (
                <div key={p}>
                  <IXDrop
                    key={index}
                    droppableId={p}
                    cardType={DndTypes.PLACEHOLDER}
                  >
                    <ViewCard
                      key={p}
                      cardId={p}
                      activeKey={activeKeyReference}
                      cardType={DndTypes.PLACEHOLDER}
                    ></ViewCard>
                  </IXDrop>
                </div>
              );
            })}
          </ResponsiveGridLayout>
        ) : (
          <div className={"centered-flex"}>not loaded</div>
        )} */}
      </div>
    </div>
  );
};
export default React.memo(CardGrid);

const cardContainerClass =(card: CardData, appMode: AppMode): string=>{
    const isFailed = card.failed;
    if(isFailed && appMode === AppMode.DISPLAY){
      return "card-container-hidden"
    } else if (isFailed && appMode === AppMode.EDIT){
      return "card-container-error"
    } else {
      return "card-container"
    }
}

const createLayout = (cards: CardData[], cols: number, rows: number) => {
  const pos: GridPosition = { x: 0, y: 0 };
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // allGridSpots.push({ x: x, y: y });
    }
  }
};

function generateFilledLayout(rows: number, cols: number): Layouts {
  const allGridSpots: GridPosition[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      allGridSpots.push({ x: x, y: y });
    }
  }

  const emptyCards = allGridSpots.map((rr) => {
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
  // const filled = layout.concat(emptyCards);
  //pop off the first two positions where the clock is
  emptyCards.shift();
  emptyCards.shift();
  return {
    lg: emptyCards,
    md: emptyCards,
    sm: emptyCards,
    xs: emptyCards,
    xxs: emptyCards,
  };
}

function findFilledPositions(layouts: Layout[]): GridPosition[] {
  const takenSpots: GridPosition[] = [];
  for (const l of layouts) {
    takenSpots.push({ x: l.x, y: l.y });
    for (let index = 1; index < l.w; index++) {
      const fullSpotX: GridPosition = {
        x: l.x + index,
        y: l.y,
      };
      takenSpots.push(fullSpotX);
    }
    for (let index = 1; index < l.h; index++) {
      const fullSpotY: GridPosition = {
        x: l.x,
        y: l.y + index,
      };
      takenSpots.push(fullSpotY);
    }
  }
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
  const stringFilledSpots = new Set(
    filledSpots.map((fs) => [fs.x, fs.y].toString())
  );

  return allGridSpots.filter(
    (gs) => !stringFilledSpots.has([gs.x, gs.y].toString())
  );
}
