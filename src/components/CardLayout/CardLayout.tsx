import "../../css/cardLayout.css";
import "../../css/libs/reactDraggable.css";

import React, { useEffect, useRef, useState } from "react";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";

import CardData from "../../data_structs/CardData";
import WidgetData from "../../data_structs/WidgetData";
import { AppMode, DndTypes } from "../../enums";
import { useApp, useLayout } from "../../hooks";
import appConfig from "../../static/appConfig";
import IFrameView from "../IFrameView";
import IXDrop from "../DragAndDrop/IXDrop";
import Clock from "../Widgets/Clock";
import GuideGrid from "./GuideGrid";
import ViewCard from "./ViewCard/ViewCard";
import { AnimatePresence, motion, useAnimation, Variants } from "framer-motion";
import { randomNumber } from "../../utils";

// import defaultLayout

export const CardGrid = (): JSX.Element => {
  const { appMode } = useApp();
  const { activeLayout, setBufferLayout, activeCards, activeWidgets } =
    useLayout();

  //rerender whenever the layout changes
  useEffect(() => {
    console.log(activeLayout?.id);
  }, [activeLayout?.id]);
  //use the size of the window in order to set the height of the cards
  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  const controls = useAnimation();

  const variants = {
    show: {
      opacity: [1, 0, 1],
      transition: {
        duration: 0.5,
        // repeat: 1,
        // repeatType: "mirror",
      },
    },
    hidden: {
      opacity: 0,
      // opacity: [1, 0, 1],
      transition: {
        duration: 0.5,
        // repeat: 1,
        // repeatType: "mirror",
      },
    },
  } as Variants;

  const activeKeyReference = useRef("");
  const ResponsiveGridLayout = WidthProvider(Responsive);

  const sharedGridSettings = {
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: {
      lg: appConfig.gridCols,
      md: appConfig.gridCols,
      sm: appConfig.gridCols,
      xs: appConfig.gridCols,
      xxs: appConfig.gridCols,
    },
    rowHeight: (size.y - appConfig.gridBottomPadding) / appConfig.gridRows,
    margin: [20, 20] as [number, number],
    preventCollision: true,
    compactType: null,
  };

  const renderWidget = (widgetData: WidgetData): JSX.Element | undefined => {
    let widget = undefined;

    switch (widgetData.id) {
      case "clock":
        widget = (
          <ViewCard
            useAnimation={false}
            cardType={DndTypes.CLOCK}
            onClick={() => {}}
          >
            {(scale) => {
              return <Clock />;
            }}
          </ViewCard>
        );

        break;
      case "info":
        widget = (
          <ViewCard useAnimation={false} cardType={DndTypes.CLOCK}>
            {(scale) => {
              // return <HowToUse />;
              return <div></div>;
            }}
          </ViewCard>
        );
        break;
    }
    console.log(widget);
    return widget;
  };

  return (
    <div>
      <div className="card-grid-container">
        <ResponsiveGridLayout
          {...sharedGridSettings}
          className="card-layout"
          // isBounded
          isDraggable={appMode === AppMode.EDIT}
          isResizable={appMode === AppMode.EDIT}
          layouts={activeLayout ? activeLayout.layout : { lg: [] }}
          // layouts={realLayout}
          onDragStart={(layout, oldItem, newItem, placeholder, e, element) => {
            const previousStyle = element.style;
            previousStyle.border = "2px solid cyan";
            element.style.border = "4px solid cyan";
          }}
          onLayoutChange={(l) => {
            console.log(activeLayout?.layout.lg);
            console.log("changed layout");
            const newLayout: Layouts = {
              lg: l,
              md: l,
              sm: l,
              xs: l,
              xxs: l,
            };
            setBufferLayout(newLayout);
          }}
          preventCollision
          resizeHandles={["se"]}
          verticalCompact
        >
          {[...activeCards, ...activeWidgets].map(
            (card: CardData | WidgetData, index: number) => {
              return (
                // <AnimatePresence>
                <div
                  className="card-container"
                  draggable
                  key={card.id}
                  // initial={"hidden"}
                  // style={{ opacity: 1 }}
                  // exit={{ opacity: 1 }}
                  // layoutId={card.id}
                  // animate={{ opacity: 1 }}
                  // style={{ opacity: 0 }}
                  // initial
                  // initial="hidden"
                  // opacity={0}
                  // animate={controls}
                >
                  <IXDrop
                    cardType={DndTypes.IFRAME}
                    className="droppable-card"
                    droppableId={card.id}
                    key={index}
                  >
                    <ViewCard
                      // activeKey={activeKeyReference}
                      cardId={index.toString()}
                      cardType={DndTypes.IFRAME}
                      data={card}
                      onClick={() => {
                        activeKeyReference.current = index.toString();
                      }}
                      useAnimation={card.contentType !== "widget"}
                    >
                      {card.contentType !== "widget"
                        ? (scale, cardView, onError, onLoad) => {
                            const contentCard = card as CardData;
                            return (
                              <IFrameView
                                card={contentCard}
                                scale={scale}
                                cardView={cardView}
                                onError={onError}
                                onLoad={onLoad}
                              />
                            );
                          }
                        : (scale) => {
                            return renderWidget(card as WidgetData);
                          }}
                      {}
                    </ViewCard>
                  </IXDrop>
                </div>
                // </AnimatePresence>
              );
            }
          )}
        </ResponsiveGridLayout>
      </div>
      <GuideGrid gridSettings={sharedGridSettings} />
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

//
