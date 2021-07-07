import React, {
  useEffect,
  useState,
  FC,
  useMemo,
  forwardRef,
  useRef,
} from "react";
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

export const CardGrid: FC = () => {
  const viewModeState = useStoreState((state) => state.appModel.appMode);
  const currentLayoutState = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );
  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const testViewMode = useMemo(() => {
    //only allow dragging/resizing when in edit mode
    console.log(viewModeState);
    console.log(AppMode.EDIT === viewModeState);
    return viewModeState === AppMode.EDIT;
  }, [viewModeState]);

  const [activeCardKey, setActiveCardKey] =
    useState<string | undefined>(undefined);

  const activeCards = useStoreState((state) => state.appModel.activeCards);

  const ResponsiveGridLayout = WidthProvider(Responsive);
  useEffect(() => {
    console.log("cards changed");
    console.log(currentLayoutState);
  }, [activeCards, currentLayoutState]);

  const activeKeyRef = useRef("");

  // we need to memo any children of the gird layout to avoid re-renders
  //github.com/react-grid-layout/react-grid-layout
  const memoCards = useMemo(() => {
    return activeCards.map((card: CardData, i: number) => {
      return (
        <div
          //key provided here is the means of accesing a unique identifier for the cards
          key={card.sourceId}
          // style={cardContainerStyle}
          onMouseUp={(e) => {
            console.log(e.target);
            console.log(i);
          }}
          onMouseDown={(e) => {
            console.log(e);
          }}
        >
          <IXDrop key={i} droppableId={card.sourceId}>
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
                <Modal text={"hello"}></Modal>
              ) : (
                <div></div>
              )}

              <IFrameView src={card.src} />
            </ViewCard>
          </IXDrop>
        </div>
      );
    });
  }, [activeCards]);
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
          // onLayoutChange={(l, lays) => addEditHistory(lays)}
          preventCollision={false}
          onDragStart={(layout, oldItem, newItem, placeholder, e, element) => {
            const prevStyle = element.style;
            prevStyle.border = "2px solid cyan";
            element.style.border = "4px solid cyan";
          }}
          onDragStop={(layout, oldItem, newItem, placeholder, e, element) => {
            console.log("drag ended");
            console.log(element);
            element.style.border = "2px solid blue";
          }}
          isDraggable={testViewMode}
          isResizable={testViewMode}
        >
          <div key={"clock"}>
            <ViewCard>
              <Clock />
            </ViewCard>
          </div>
          {/* {memoCards} */}
          {activeCards.map((card: CardData, i: number) => {
            return (
              <div
                //key provided here is the means of accesing a unique identifier for the cards
                key={card.sourceId}
                // style={cardContainerStyle}
              >
                <IXDrop key={i} droppableId={card.sourceId}>
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
        <div>not loaded</div>
      )}
    </div>
  );
};
export default React.memo(CardGrid);
// function propsAreEqual(
//   prevProps: Readonly<PropsWithChildren<ViewCardProps>>,
//   nextProps: Readonly<PropsWithChildren<ViewCardProps>>
// ): boolean {
//   console.log(prevProps.data);
//   console.log(nextProps.data);
//   return true;
// }
