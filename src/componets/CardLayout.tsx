import React, { useEffect } from "react";
// import _ from "lodash";
import GridLayout, { WidthProvider } from "react-grid-layout";
import ViewCard from "./ViewCard";
import { useStoreState, useStoreActions } from "../hooks";
import type { CardData } from "../model/card_model";

export const CardGrid = () => {
  const availableCards = useStoreState((state) => state.appData.availableCards);
  useEffect(() => {
    console.log("cards changed");
    console.log(availableCards);
  }, [availableCards]);
  const layout = [
    { i: "0", x: 0, y: 2, w: 1, h: 2, static: true },
    { i: "1", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "2", x: 3, y: 0, w: 1, h: 2 },
    { i: "3", x: 4, y: 0, w: 1, h: 2 },
    { i: "4", x: 4, y: 0, w: 1, h: 2 },
    { i: "5", x: 4, y: 0, w: 1, h: 2 },
    { i: "6", x: 4, y: 0, w: 1, h: 2 },
    { i: "7", x: 4, y: 0, w: 1, h: 2 },
    { i: "8", x: 4, y: 0, w: 1, h: 2 },
  ];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      // width={1200}
    >
      {availableCards.map((card: CardData, i: number) => {
        console.log(i.toString());
        return <ViewCard src={card.src} key={i.toString()} />;
      })}
    </GridLayout>
  );
};

export default CardGrid;
