import "../../../../css/table.css";

import { SearchInput } from "evergreen-ui";
import fuzzysort from "fuzzysort";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import CardData from "../../../../data_structs/CardData";
import { DndTypes, DragSource } from "../../../../enums";
import {
  useHover,
  useLayout,
  useStoreActions,
  useStoreState,
} from "../../../../hooks";
import { formatDate } from "../../../../utils";
import IXDrop from "../../../DragAndDrop/IXDrop";
import Button from "../../../Shared/Button";
import FlexRow from "../../../Shared/FlexRow";
import XDrag from "../../../DragAndDrop/DraggableRow";
import TableHeader from "../../TableHeader";
import ReactImageFallback from "react-image-fallback";
import ReactTooltip from "react-tooltip";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import PopOver from "../../PopOver";
import { Column, Table, SortDirection, AutoSizer } from "react-virtualized";
import imageThumbnail from "image-thumbnail";

/**
 * Content tab display a list of the availalbe cards, and search bar for quickly finding cards by their title.
 */

//TODO: REFACTOR

const ContentsTab = (): JSX.Element => {
  const availableCards = useStoreState(
    (state) => state.appModel.availableCards
  );

  const { clearCards, resetLayout } = useLayout();

  const [filterKey, setFilterKey] = useState<string | undefined>();
  const [filterDirection, setFilterDirection] = useState(true);
  const [cardItems, setCardItems] = useState(availableCards);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] =
    useState<CardData[]>(availableCards);

  //use search input to filter cards
  useEffect(() => {
    if (0 < searchTerm.length) {
      const sortResult = fuzzysort.go(
        searchTerm,
        cardItems.map((c) => c.title)
      );
      const aboveThreshholdCardTitles: string[] = sortResult.map(
        (s) => s.target
      );
      const filtered = cardItems.filter((c) =>
        aboveThreshholdCardTitles.includes(c.title)
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(cardItems);
    }
  }, [searchTerm, cardItems]);

  //sort values by column attribute, if filterDirection is true, sort descending, else sort ascending
  useEffect(() => {
    const key = filterKey as keyof CardData;
    const clone = [...availableCards];

    const sortedItems = clone.sort((a, b) => {
      const aText = a[key];
      const bText = b[key];
      if (aText && bText) {
        if (aText < bText) {
          return -1;
        }
        if (bText < aText) {
          return 1;
        }
      }
      return 0;
    });
    !filterDirection ? sortedItems.reverse() : null;
    setCardItems(sortedItems);
  }, [filterKey, availableCards, filterDirection]);

  const contentTabHeader = "contents-table-header";
  return (
    <div className="contents-tab-container">
      <FlexRow padding="0.5em">
        <SearchInput
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            setSearchTerm(event.currentTarget.value)
          }
          placeholder="search title"
          width="80%"
        />
        <Button
          appearance="default"
          intent="danger"
          onClick={(event) => {
            resetLayout();
          }}
          text="Reset Layout"
        />
        <Button
          appearance="minimal"
          intent="danger"
          onClick={(event) => {
            clearCards();
          }}
          // width={"10%"}
          text="Clear All"
        />
      </FlexRow>
      <IXDrop
        cardType={DndTypes.CLOCK}
        className="table-container"
        droppableId={DragSource.CARD_TABLE}
        isDropDisabled
      >
        <table className="contents-tab-table">
          <tbody>
            <tr>
              {["title", "author", "added"].map((s, index) => {
                return (
                  <TableHeader
                    activeFilter={filterKey}
                    className={contentTabHeader}
                    headerTitle={s}
                    key={index}
                    setFilter={setFilterKey}
                    setFilterDirection={setFilterDirection}
                  ></TableHeader>
                );
              })}
            </tr>
          </tbody>
        </table>
        <Scrollbars autoHeight autoHeightMax={319} autoHeightMin={100}>
          <table style={{ padding: "2em" }}>
            <tbody>
              {filteredCards.map((card, index) => {
                const {
                  added,
                  src,
                  author,
                  interaction,
                  sourceId,
                  isActive,
                  title,
                } = card;
                return (
                  <XDrag
                    className={
                      isActive ? "content-row-active" : "content-row-inactive"
                    }
                    dndType={DndTypes.CARD_ROW}
                    draggableId={sourceId}
                    index={index}
                    isDragDisabled={isActive}
                    key={index.toString()}
                  >
                    <>
                      <td>
                        <TitleWithIcon card={card} />
                      </td>
                      <td>{author}</td>
                      <td>{formatDate(added)}</td>
                    </>
                  </XDrag>
                );
              })}
            </tbody>
          </table>
        </Scrollbars>
      </IXDrop>
    </div>
  );
};

/**
 * Fetches a favicon for a card and displays the cards title
 */
const TitleWithIcon = ({ card }: { card: CardData }): JSX.Element => {
  const { src, id } = card;
  const [position, setPosition] = useState([0, 0]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    console.log(position);
  }, [position]);

  // const tb = useMemo(() => {
  //   if (card.contentType === "image") {
  //     imageThumbnail(card.src)
  //       .then((thumbnail: any) => {
  //         console.log(thumbnail);
  //       })
  //       .catch((err: any) => console.error(err));
  //   }
  // }, []);

  // const tb = useMemo(() => {
  //   if (card.contentType === "image") {
  //     return generate(card.src, { x: 50, y: 50 }, 50);
  //   }
  // }, []);
  // console.log(tb);

  return (
    <div style={{ display: "flex" }}>
      <div
        id={id}
        onMouseEnter={(e) => {
          const { pageX, pageY } = e;
          setPosition([pageX, pageY]);
          setHovered(true);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
        }}
        style={{ display: "flex", width: 20 }}
      >
        <ReactImageFallback
          className={
            card.isActive ? "row-favicon-active" : "row-favicon-inactive"
          }
          fallbackImage={`${process.env.PUBLIC_URL}/question_mark.svg`}
          src={
            card.contentType === "image"
              ? src
              : `https://s2.googleusercontent.com/s2/favicons?domain_url=${card.src}`
          }
          // onError={(e)=>}
          style={{ width: "100%", maxWidth: 20 }}
        />
      </div>

      <PopOver
        x={position[0]}
        y={position[1]}
        visible={hovered && card.contentType === "image"}
        // title={`Image Preview ${card.title}`}
      >
        <ReactImageFallback
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          fallbackImage={`${process.env.PUBLIC_URL}/question_mark.svg`}
          // onError={(e)=>}
          src={
            card.contentType === "image"
              ? src
              : `https://s2.googleusercontent.com/s2/favicons?domain_url=${card.src}`
          }
        />
      </PopOver>
      <div
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          textAlign: "left",
          paddingLeft: "1em",
        }}
      >
        {card.title}
      </div>
    </div>
  );
};

export default ContentsTab;

// function ThumbnailGenerator() {

function generate(
  imgSrc: string,
  thumbDims: { x: number; y: number },
  compression: number
): Promise<string> {
  const resizeCanvas = document.createElement("canvas") as HTMLCanvasElement;

  [resizeCanvas.width, resizeCanvas.height] = [thumbDims.x, thumbDims.y];
  const ctx = resizeCanvas.getContext("2d") as CanvasRenderingContext2D;

  const tmp = new Image();
  // tmp.setAttribute()
  tmp.setAttribute("crossorigin", "anonymous");
  const ret = new Promise((resolve) => {
    tmp.onload = () => {
      ctx.drawImage(tmp, 0, 0, thumbDims.x, thumbDims.y);
      resolve(resizeCanvas.toDataURL("image/jpeg", compression || 0.5));
    };
  });
  tmp.src = imgSrc;
  return ret as Promise<string>;
}

// function generateBatch(imgSrcs: string[], thumbDims: {x: number, y: number}[], compression: number) {
//   return Promise.all(imgSrcs.map(img =>generate(img, thumbDims, compression)));
// }

// return this;
// }

// const Popover = (): JSX.Element =>{

//   return(
//     <div>hello</div>
//   )

// }
