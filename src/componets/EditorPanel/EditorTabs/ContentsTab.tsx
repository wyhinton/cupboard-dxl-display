import React, { useState, useEffect, useRef, FC } from "react";
import { useStoreState } from "../../../hooks";
import IXDrop from "../../IXDrop";
import XDrag from "../../XDrag";
import CardData from "../../../data_structs/CardData";
import "../../../css/table.css";
import { TextInput, Menu, StatusIndicator } from "evergreen-ui";
import fuzzysort from "fuzzysort";
import TableHeader from "../TableHeader";
import UseTip from "./UseTip";
import { DndTypes } from "../../../enums";
/**
 * Content tab display a list of the availalbe cards, and search bar for quickly finding cards by their title.
 * @returns
 */

const ContentsTab: FC = () => {
  const availableCards = useStoreState(
    (state) => state.appModel.availableCards
  );
  const [filterKey, setFilterKey] = useState<string | undefined>(undefined);
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
  // const sortBy = (k: keyof CardData, func: (c: CardData) => number): void => {
  //   const clone = [...cardList.current];
  //   cardList.current = clone.sort(func);
  // };

  return (
    <div>
      <UseTip tip={"Drag and drop a table row to a card to load new content"} />
      <TextInput
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          setSearchTerm(e.currentTarget.value)
        }
        placeholder={"search title"}
      ></TextInput>

      <div style={{ paddingBottom: ".5em", paddingTop: ".5em" }}>
        <Menu.Divider></Menu.Divider>
      </div>
      <IXDrop
        className={"table-container"}
        droppableId={"Card Content Table"}
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
            {filteredCards.map((card, i) => {
              return (
                <XDrag
                  dndType={DndTypes.CARD_ROW}
                  draggableId={card.sourceId}
                  index={i}
                  key={i.toString()}
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

interface CardTitleProps {
  card: CardData;
}

/**
 * Fetches a favicon for a card and displays the cards title
 * @param card
 * @returns
 */
const TitleWithIcon: FC<CardTitleProps> = (card) => {
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
