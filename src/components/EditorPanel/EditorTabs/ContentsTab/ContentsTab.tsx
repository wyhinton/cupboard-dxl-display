import React, { useState, useEffect, useRef, FC } from "react";
import { useStoreState } from "../../../../hooks";
import IXDrop from "../../../IXDrop";
import XDrag from "../../../XDrag";
import CardData from "../../../../data_structs/CardData";
import "../../../../css/table.css";
import "../../../../css/contentTable.css";
import { SearchInput, Menu, StatusIndicator } from "evergreen-ui";
import fuzzysort from "fuzzysort";
import TableHeader from "../../TableHeader";
import UseTip from "../UseTip";
import { DndTypes, DragSource } from "../../../../enums";
import { Scrollbars } from "react-custom-scrollbars";
import { formatDate } from "../../../../utils";
/**
 * Content tab display a list of the availalbe cards, and search bar for quickly finding cards by their title.
 * @returns
 */

const ContentsTab: FC = () => {
  const availableCards = useStoreState(
    (state) => state.appModel.availableCards
  );
  const [filterKey, setFilterKey] = useState<string | undefined>();
  const [cardItems, setCardItems] = useState(availableCards);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTr, setSelectedTr] = useState(null);
  const [filteredCards, setFilteredCards] =
    useState<CardData[]>(availableCards);

  //use search input to filter cards
  useEffect(() => {
    if (searchTerm.length > 0) {
      const sortResult = fuzzysort.go(
        searchTerm,
        cardItems.map((c) => c.title)
      );
      // let filtered = sortResult.map((s) => s.);
      const aboveThreshholdCardTitles: string[] = sortResult.map(
        (s) => s.target
      );
      console.log(aboveThreshholdCardTitles);
      const filtered = cardItems.filter((c) =>
        aboveThreshholdCardTitles.includes(c.title)
      );
      setFilteredCards(filtered);
    } else {
      setFilteredCards(cardItems);
    }
  }, [searchTerm, cardItems]);

  //sort values by column attribute
  useEffect(() => {
    const key = filterKey as keyof CardData;
    const clone = [...availableCards];
    setCardItems(
      clone.sort((a, b) => {
        const aText = a[key];
        const bText = b[key];
        console.log(aText, bText);
        if (aText && bText) {
          if (aText < bText) {
            return -1;
          }
          if (aText > bText) {
            return 1;
          }
        }
        return 0;
      })
    );
    console.log(filterKey);
  }, [filterKey, availableCards]);

  const cardList = useRef<CardData[]>(availableCards);
  const contentTabHeader = "contents-table-header";
  return (
    <div className={"contents-tab-container"}>
      <div style={{ padding: "0.5em" }}>
        <SearchInput
          width={"100%"}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setSearchTerm(e.currentTarget.value)
          }
          placeholder={"search title"}
        ></SearchInput>
      </div>
      <IXDrop
        className={"table-container"}
        droppableId={DragSource.CARD_TABLE}
        isDropDisabled={true}
        cardType={DndTypes.CLOCK}
      >
        <table className={"contents-tab-table"}>
          <tbody>
            <tr>
              <TableHeader
                className={contentTabHeader}
                title={"Title"}
                onClick={() => setFilterKey("title")}
              ></TableHeader>
              <TableHeader
                className={contentTabHeader}
                title={"Date Added"}
                onClick={() => setFilterKey("added")}
              ></TableHeader>
              <TableHeader
                className={contentTabHeader}
                title={"URL"}
                onClick={() => setFilterKey("sourceId")}
              ></TableHeader>
              <TableHeader
                className={contentTabHeader}
                title={"Author"}
                onClick={() => setFilterKey("author")}
              ></TableHeader>
              <TableHeader
                className={contentTabHeader}
                title={"Interaction"}
                onClick={() => setFilterKey("interaction")}
              ></TableHeader>
            </tr>
          </tbody>
        </table>
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={319}
          onScrollFrame={(v) => console.log(v)}
        >
          <table style={{ padding: "2em" }}>
            <tbody>
              {filteredCards.map((card, index) => {
                const { added, src, author, interaction, sourceId, isActive } =
                  card;
                return (
                  <XDrag
                    dndType={DndTypes.CARD_ROW}
                    draggableId={sourceId}
                    index={index}
                    key={index.toString()}
                    isDragDisabled={isActive}
                    className={
                      isActive ? "content-row-active" : "content-row-inactive"
                    }
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

interface CardTitleProperties {
  card: CardData;
}

/**
 * Fetches a favicon for a card and displays the cards title
 * @param card
 * @returns
 */
const TitleWithIcon: FC<CardTitleProperties> = (card) => {
  return (
    <div style={{ display: "flex" }}>
      <img
        className={"row-favicon"}
        src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${card.card.src}`}
      ></img>
      <div
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          textAlign: "left",
        }}
      >
        {card.card.src}
      </div>
    </div>
  );
};

export default ContentsTab;
