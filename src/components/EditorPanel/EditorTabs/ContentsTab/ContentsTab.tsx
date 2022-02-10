import "../../../../css/table.css";

import { SearchInput } from "evergreen-ui";
import fuzzysort from "fuzzysort";
import React, { useEffect, useRef, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import CardData from "../../../../data_structs/CardData";
import { DndTypes, DragSource } from "../../../../enums";
import { useLayout, useStoreActions, useStoreState } from "../../../../hooks";
import { formatDate } from "../../../../utils";
import IXDrop from "../../../DragAndDrop/IXDrop";
import Button from "../../../Shared/Button";
import FlexRow from "../../../Shared/FlexRow";
import XDrag from "../../../DragAndDrop/DraggableRow";
import TableHeader from "../../TableHeader";
import ReactImageFallback from "react-image-fallback";
import ReactTooltip from "react-tooltip";
import ToolTip from "react-portal-tooltip";

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
              {["title", "added", "sourceId", "author", "interaction"].map(
                (s, index) => {
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
                }
              )}
            </tr>
          </tbody>
        </table>
        <Scrollbars
          autoHeight
          autoHeightMax={319}
          autoHeightMin={100}
          onScrollFrame={(v) => console.log(v)}
        >
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
                        {/* <Tooltip
                          content={<img src={src}> </img>}
                          position={"left"}
                        > */}
                        <TitleWithIcon card={card} />
                        {/* </Tooltip> */}
                      </td>
                      <td>{formatDate(added)}</td>
                      <td>
                        {/* <Tooltip
                          content={<img src={src}> </img>}
                          position={"left"}
                        > */}
                        <div>{src}</div>
                        {/* </Tooltip> */}
                      </td>
                      <td>{author}</td>
                      <td>{interaction}</td>
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
  const pRef = useRef<HTMLDivElement>(null);
  return (
    <div
      style={{ display: "flex", border: "1px solid red", overflow: "visible" }}
    >
      <div id={id} style={{ width: 20 }} ref={pRef}>
        <ReactImageFallback
          style={{ width: "100%", maxWidth: 20 }}
          className={
            card.isActive ? "row-favicon-active" : "row-favicon-inactive"
          }
          fallbackImage={`${process.env.PUBLIC_URL}/question_mark.svg`}
          // onError={(e)=>}
          src={
            card.contentType === "image"
              ? src
              : `https://s2.googleusercontent.com/s2/favicons?domain_url=${card.src}`
          }
        />
      </div>
      {/* 
      <ToolTip active={true} parent={pRef.current as React.RefObject<unknown>}>
        <div>hello</div>
      </ToolTip> */}
      <div
        style={{
          width: 100,
          height: 30,
          position: "absolute",
          backgroundColor: "red",
        }}
      ></div>
      {/* <ReactTooltip id={id} place="top" effect="solid">
        Tooltip for the register button
      </ReactTooltip> */}
      <div
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          textAlign: "left",
        }}
      >
        {card.title}
      </div>
    </div>
  );
};

export default ContentsTab;
