// eslint-disable-next-line simple-import-sort/imports
import React, { useState } from "react";
import ViewCard from "./ViewCard/ViewCard";
import { DndTypes } from "../../enums";
import type { Layout, Layouts} from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import "../../css/cardLayout.css";
import appConfig from "../../static/appConfig";
import type { GridPosition } from "../../interfaces/GridPosition";
import IXDrop from "../DragAndDrop/IXDrop";

type GuideGridSettings = Partial<ReactGridLayout.ResponsiveProps>;

export const GuideGrid = ({
  gridSettings,
}: {
  gridSettings: GuideGridSettings;
}): JSX.Element => {
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const guideCards = generateFilledLayout(
    appConfig.gridRows,
    appConfig.gridCols
  );
  const justCardNames = guideCards.lg.map((c) => c.i);

  return (
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
      <ResponsiveGridLayout
        {...gridSettings}
        className="card-layout"
        isDraggable={false}
        isResizable={false}
        layouts={guideCards}
        preventCollision
        resizeHandles={[]}
      >
        {justCardNames.map((p, index) => {
          return (
            <div key={p}>
              <IXDrop
                cardType={DndTypes.PLACEHOLDER}
                className="droppable-guide"
                droppableId={p}
                key={index}
              >
                <ViewCard
                  cardId={p}
                  // eslint-disable-next-line react/jsx-sort-props
                  cardType={DndTypes.PLACEHOLDER}
                  key={p}
                  useAnimation={false}
                ></ViewCard>
              </IXDrop>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};
export default React.memo(GuideGrid);

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
  // emptyCards.shift();
  // emptyCards.shift();
  return {
    lg: emptyCards,
    md: emptyCards,
    sm: emptyCards,
    xs: emptyCards,
    xxs: emptyCards,
  };
}
