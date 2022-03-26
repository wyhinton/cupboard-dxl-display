import "../../css/cardLayout.css";
import "../../css/libs/reactDraggable.css";

import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { useEffect } from "react";
import type { Layout, Layouts } from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";

import type CardData from "../../data_structs/CardData";
import LayoutData from "../../data_structs/LayoutData";
import type WidgetData from "../../data_structs/WidgetData";
import type { AppMode } from "../../enums";
import { DndTypes } from "../../enums";
import type { CardSettings } from "../../interfaces/CardSettings";
import appConfig from "../../static/appConfig";
import IFrameView from "../CardContent";
import IXDrop from "../DragAndDrop/IXDrop";
import WidgetRenderer from "../Widgets/WidgetRenderer";
import GuideGrid from "./GuideGrid";
import ViewCard from "./ViewCard/ViewCard";
import WidgetWrapper from "./ViewCard/WidgetWrapper";

export const CardLayout = ({
  appMode,
  layout,
  cardSettings,
  width,
  height,
  margin,
  onLayoutChange,
  cards,
  widgets,
  cols,
  rows,
  isDraggable,
  isResizable,
}: {
  appMode: AppMode;
  cards: CardData[];
  cols: number;
  cardSettings: CardSettings[];
  height: number;
  layout: Layouts | undefined;
  margin: [number, number];
  rows: number;
  onLayoutChange?: (l: Layout[]) => void;
  isDraggable?: boolean;
  isResizable?: boolean;
  widgets: WidgetData[];
  width: number;
}): JSX.Element => {
  const activeLayout = layout;

  useEffect(() => {
    console.log(activeLayout?.id);
  }, [activeLayout?.id]);

  console.log(activeLayout);

  const ResponsiveGridLayout = WidthProvider(Responsive);

  const sharedGridSettings = {
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: {
      lg: cols,
      md: cols,
      sm: cols,
      xs: cols,
      xxs: cols,
    },
    // rowHeight: 500,
    rowHeight: height / appConfig.gridSettings.gridRows,
    // rowHeight: (height - appConfig.gridBottomPadding) / appConfig.gridRows,
    margin: margin,
    preventCollision: true,
    compactType: null,
    // containerPadding: [0, 0],
  };

  console.log(widgets);
  return (
    <div>
      <motion.div
        animate={{ opacity: 1, y: 0, transition: { delay: 1 } }}
        className="card-grid-container"
        initial={{ opacity: 0, y: 50 }}
      >
        <ResponsiveGridLayout
          {...sharedGridSettings}
          className="card-layout"
          isDraggable={isDraggable ?? false}
          isResizable={isResizable ?? false}
          layouts={layout ?? { lg: [] }}
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
                <motion.div
                  className="card-container"
                  exit={{ y: -100 }}
                  id={`${card.id}_grid_container`}
                  key={card.id}
                  style={{ width: "100%" }}
                >
                  <IXDrop
                    cardType={DndTypes.IFRAME}
                    className="droppable-card"
                    droppableId={card.id}
                    key={index}
                  >
                    <ViewCard
                      cardId={index.toString()}
                      cardSettings={cardSettings.find((s) => s.id === card.id)}
                      cardType={DndTypes.IFRAME}
                      data={card}
                      useAnimation={card.contentType !== "widget"}
                    >
                      {card.contentType !== "widget"
                        ? (scale, cardView, onError, onLoad, cardSettings) => {
                            const contentCard = card as CardData;
                            return (
                              <IFrameView
                                card={contentCard}
                                cardSettings={cardSettings}
                                cardView={cardView}
                                onError={onError}
                                onLoad={onLoad}
                                scale={scale}
                              />
                            );
                          }
                        : (scale, cardView, onError, onLoad, cardSettings) => {
                            return (
                              <WidgetRenderer
                                cardSettings={cardSettings}
                                scale={1}
                                widget={card as WidgetData}
                              />
                            );
                          }}
                      {}
                    </ViewCard>
                  </IXDrop>
                </motion.div>
              );
            }
          )}
        </ResponsiveGridLayout>
      </motion.div>
      <GuideGrid gridSettings={sharedGridSettings} />
    </div>
  );
};
export default CardLayout;
