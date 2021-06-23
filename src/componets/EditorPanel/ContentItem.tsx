import React, { useState, useEffect, ReactNode } from "react";
import CardData from "../../data_structs/cardData";
import "../../css/contentItem.css";
import { JsxElement } from "typescript";
// https://codesandbox.io/s/github/lby1024/react-beautiful-dnd/tree/main/?file=/src/component/drag.tsx

const ContentItem = ({ card, index }: { card: CardData; index: number }) => {
  return <div>{card.title}</div>;
};

export default ContentItem;
