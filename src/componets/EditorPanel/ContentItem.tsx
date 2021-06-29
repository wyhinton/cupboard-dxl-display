import React, { useState, useEffect, ReactNode } from "react";
import CardData from "../../data_structs/CardData";
import "../../css/contentItem.css";
import { JsxElement } from "typescript";
import classNames from "classnames";
// https://codesandbox.io/s/github/lby1024/react-beautiful-dnd/tree/main/?file=/src/component/drag.tsx

const ContentItem = ({ card, index }: { card: CardData; index: number }) => {
  const contentItemClass = classNames("content-item", {
    "content-active": card.isActive,
    "content-inactive": !card.isActive,
  });

  return <div className={contentItemClass}>{card.title}</div>;
};

export default ContentItem;
