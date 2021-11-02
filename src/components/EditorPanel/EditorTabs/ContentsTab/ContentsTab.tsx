import "../../../../css/table.css";

import { SearchInput } from "evergreen-ui";
import fuzzysort from "fuzzysort";
import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import CardData from "../../../../data_structs/CardData";
import { DndTypes, DragSource } from "../../../../enums";
import { useStoreActions, useStoreState } from "../../../../hooks";
import { formatDate } from "../../../../utils";
import IXDrop from "../../../IXDrop";
import Button from "../../../Shared/Button";
import FlexRow from "../../../Shared/FlexRow";
import XDrag from "../../../XDrag";
import TableHeader from "../../TableHeader";
/**
 * Content tab display a list of the availalbe cards, and search bar for quickly finding cards by their title.
 */

//TODO: REFACTOR

const ContentsTab = (): JSX.Element => {
  const availableCards = useStoreState(
    (state) => state.appModel.availableCards
  );
  const clearCardsAction = useStoreActions(
    (actions) => actions.layoutsModel.clearCards
  );
  const resetLayoutAction = useStoreActions(
    (actions) => actions.layoutsModel.resetLayout
  );

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
            resetLayoutAction();
          }}
          text="Reset Layout"
        />
        <Button
          appearance="minimal"
          intent="danger"
          onClick={(event) => {
            clearCardsAction();
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
                const { added, src, author, interaction, sourceId, isActive } =
                  card;
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
                      <td>{formatDate(added)}</td>
                      <td>{src}</td>
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
  return (
    <div style={{ display: "flex" }}>
      <img
        className={
          card.isActive ? "row-favicon-active" : "row-favicon-inactive"
        }
        src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${card.src}`}
      ></img>
      <div
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          textAlign: "left",
        }}
      >
        {card.src}
      </div>
    </div>
  );
};

export default ContentsTab;
