import React, { useState, useEffect, useRef, FC } from "react";
import { useStoreState } from "../../../../hooks";
import IXDrop from "../../../IXDrop";
import XDrag from "../../../XDrag";
import CardData from "../../../../data_structs/CardData";
import "../../../../css/table.css";
import { SearchInput, Menu, StatusIndicator } from "evergreen-ui";
import fuzzysort from "fuzzysort";
import TableHeader from "../../TableHeader";
import UseTip from "../UseTip";
import { DndTypes, DragSource } from "../../../../enums";
import { Scrollbars } from "react-custom-scrollbars";
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
        <table>
          <tbody>
            <tr>
              <TableHeader
                title={"Title"}
                onClick={() => setFilterKey("title")}
              ></TableHeader>
              <TableHeader
                title={"Date Added"}
                onClick={() => setFilterKey("added")}
              ></TableHeader>
              <TableHeader
                title={"URL"}
                onClick={() => setFilterKey("sourceId")}
              ></TableHeader>
              <TableHeader
                title={"Author"}
                onClick={() => setFilterKey("author")}
              ></TableHeader>
              <TableHeader
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
                return (
                  <XDrag
                    dndType={DndTypes.CARD_ROW}
                    draggableId={card.sourceId}
                    index={index}
                    key={index.toString()}
                    isDragDisabled={card.isActive}
                    className={
                      card.isActive
                        ? "content-row-active"
                        : "contnet-row-inactive"
                    }
                  >
                    <>
                      <td>
                        <TitleWithIcon card={card} />
                      </td>
                      <td>{formatDate(card.added)}</td>
                      <td>{card.src}</td>
                      <td>{card.author}</td>
                      <td>{card.interaction}</td>
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

function formatDate(date: Date | undefined): string {
  if (date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  } else {
    return "faulty date";
  }
}

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
