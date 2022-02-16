import "../../css/cardLayout.css";
import "../../css/libs/reactDraggable.css";

import { Variants } from "framer-motion";
import React, { useEffect } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";

import CardData from "../../data_structs/CardData";
import LayoutData from "../../data_structs/LayoutData";
import WidgetData from "../../data_structs/WidgetData";
import { AppMode, DndTypes } from "../../enums";
import appConfig from "../../static/appConfig";
import IXDrop from "../DragAndDrop/IXDrop";
import IFrameView from "../IFrameView";
import GuideGrid from "./GuideGrid";
import ViewCard from "./ViewCard/ViewCard";
import WidgetWrapper from "./ViewCard/WidgetWrapper";

export const CardLayout = ({
  layout,
  appMode,
  width,
  height,
  margin,
  onLayoutChange,
  cards,
  widgets,
  isDraggable,
  isResizable,
}: {
  layout: LayoutData;
  appMode: AppMode;
  width: number;
  height: number;
  margin: [number, number];
  onLayoutChange?: (l: Layout[]) => void;
  cards: CardData[];
  widgets: WidgetData[];
  isDraggable?: boolean;
  isResizable?: boolean;
}): JSX.Element => {
  const activeLayout = layout;

  useEffect(() => {
    console.log(activeLayout?.id);
  }, [activeLayout?.id]);

  const variants = {
    show: {
      opacity: [1, 0, 1],
      transition: {
        duration: 0.5,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  } as Variants;

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
    rowHeight: (height - appConfig.gridBottomPadding) / appConfig.gridRows,
    margin: margin,
    preventCollision: true,
    compactType: null,
  };

  return (
    <div>
      <div className="card-grid-container">
        <ResponsiveGridLayout
          {...sharedGridSettings}
          className="card-layout"
          isDraggable={isDraggable ?? false}
          isResizable={isResizable ?? false}
          layouts={activeLayout ? activeLayout.layout : { lg: [] }}
          onDragStart={(layout, oldItem, newItem, placeholder, e, element) => {
            const previousStyle = element.style;
            previousStyle.border = "2px solid cyan";
            element.style.border = "4px solid cyan";
          }}
          onLayoutChange={onLayoutChange}
          preventCollision
          resizeHandles={["se"]}
          verticalCompact
        >
          {[...cards, ...widgets].map(
            (card: CardData | WidgetData, index: number) => {
              return (
                <div className="card-container" draggable key={card.id}>
                  <IXDrop
                    cardType={DndTypes.IFRAME}
                    className="droppable-card"
                    droppableId={card.id}
                    key={index}
                  >
                    <ViewCard
                      cardId={index.toString()}
                      cardType={DndTypes.IFRAME}
                      data={card}
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
                            return (
                              <WidgetWrapper
                                widget={card as WidgetData}
                                scale={scale}
                              />
                            );
                          }}
                      {}
                    </ViewCard>
                  </IXDrop>
                </div>
              );
            }
          )}
        </ResponsiveGridLayout>
      </div>
      <GuideGrid gridSettings={sharedGridSettings} />
    </div>
  );
};
export default React.memo(CardLayout);

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
