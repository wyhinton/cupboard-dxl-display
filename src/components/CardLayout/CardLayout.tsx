import appConfig from '../../static/appConfig';
import CardData from '../../data_structs/CardData';
import Clock from '../Widgets/Clock';
import GuideGrid from './GuideGrid';
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
  Layouts,
  Responsive,
  WidthProvider
  } from 'react-grid-layout';
import { useStoreActions, useStoreState } from '../../hooks';
import '../../css/cardLayout.css';
import '../../css/libs/reactDraggable.css';

export const CardGrid = (): JSX.Element => {
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
  const [realLayout, setRealLayout] = useState(currentLayoutState?.extendedLayout.layout);
  //keep a local mutable reference to a layout in order to avoid making excess calls to store and causing re-renders on each new edit
  const localLayout = useRef<null | Layouts>(null);

  //each card has a unique key. Clicking a card sets the current active key. If a card's key is equal to the active key
  //then it will be rendered into the modal popup
  const activeKeyReference = useRef("");
  const ResponsiveGridLayout = WidthProvider(Responsive);

  useEffect(() => {
    setRealLayout(currentLayoutState?.layout);
    if (currentLayoutState?.layout) {
      localLayout.current = currentLayoutState?.layout;
    }
  }, [activeCards, currentLayoutState]);

  const sharedGridSettings = {
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: appConfig.gridCols, md: appConfig.gridCols, sm: appConfig.gridCols, xs: appConfig.gridCols, xxs: appConfig.gridCols},
    rowHeight: size.y / appConfig.gridRows,
    margin: [20, 20] as [number, number],
    preventCollision: true,
    compactType: null,
  };

  return (
    <div>
      <div className="card-grid-container">
        <ResponsiveGridLayout
          {...sharedGridSettings}
          className="card-layout"
          layouts={realLayout}
          resizeHandles={["se"]}
          preventCollision={true}
          verticalCompact={true}
          isBounded={true}
          onDragStart={(layout, oldItem, newItem, placeholder, e, element) => {
            const previousStyle = element.style;
            previousStyle.border = "2px solid cyan";
            element.style.border = "4px solid cyan";
          }}
          onLayoutChange={(l) => {
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
          {/* <div key={"clock"}>
            <ViewCard
              cardType={DndTypes.CLOCK}
              onClick={() => {
                console.log("clock clicked");
              }}
            >
              {(scale) => {
                return <Clock />;
              }}
            </ViewCard>
          </div> */}

          {activeCards.map((card: CardData, index: number) => {
            return (
              <div
                key={card.sourceId}
                draggable={true}
                className={cardContainerClass(card, viewModeState)}
              >
                <IXDrop
                  key={index}
                  droppableId={card.sourceId}
                  cardType={DndTypes.IFRAME}
                  className={"droppable-card"}
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
                    {(scale) => {
                      return (
                        <IFrameView card={card} src={card.src} scale={scale} />
                      );
                    }}
                  </ViewCard>
                </IXDrop>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
      <GuideGrid gridSettings={sharedGridSettings}/>
    </div>
  );
};
export default React.memo(CardGrid);

const cardContainerClass = (card: CardData, appMode: AppMode): string => {
  const isFailed = card.failed;
  if (isFailed && appMode === AppMode.DISPLAY) {
    return "card-container-hidden";
  } else if (isFailed && appMode === AppMode.EDIT) {
    return "card-container-error";
  } else {
    return "card-container";
  }
};

