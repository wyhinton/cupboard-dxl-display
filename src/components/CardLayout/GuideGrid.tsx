import IXDrop from '../IXDrop';
import React, { useState } from 'react';
import ViewCard from './ViewCard/ViewCard';
import { DndTypes } from '../../enums';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import '../../css/cardLayout.css';
import appConfig from '../../static/appConfig';
import { GridPosition } from '../../interfaces/GridPosition';

type GuideGridSettings = Partial<ReactGridLayout.ResponsiveProps>

export const GuideGrid = ({gridSettings}:{ gridSettings: GuideGridSettings}): JSX.Element => {
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const guideCards = generateFilledLayout(appConfig.gridRows, appConfig.gridCols)
  const justCardNames = guideCards.lg.map(c=>c.i)

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
            layouts={guideCards}
            resizeHandles={[]}
            preventCollision={true}
            isDraggable={false}
            isResizable={false}
          >
            {justCardNames.map((p, index) => {
              return (
                <div key={p}>
                  <IXDrop
                    key={index}
                    droppableId={p}
                    cardType={DndTypes.PLACEHOLDER}
                    className = {"droppable-guide"}
                  >
                    <ViewCard
                      key={p}
                      cardId={p}
                      cardType={DndTypes.PLACEHOLDER}
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