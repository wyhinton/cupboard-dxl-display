import IXDrop from '../IXDrop';
import React, { useState } from 'react';
import ViewCard from './ViewCard/ViewCard';
import { DndTypes } from '../../enums';
import { Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import '../../css/cardLayout.css';

type GuideGridSettings = Partial<ReactGridLayout.ResponsiveProps>

export const GuideGrid = ({cards, gridSettings, layout}:{ cards: string[], gridSettings: GuideGridSettings, layout?: Layouts}): JSX.Element => {
  const ResponsiveGridLayout = WidthProvider(Responsive);

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
            layouts={layout}
            resizeHandles={[]}
            preventCollision={true}
            isDraggable={false}
            isResizable={false}
          >
            {cards.map((p, index) => {
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

