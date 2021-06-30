import React, { useState, useEffect, useRef } from "react";
import { useStoreState, useStoreActions } from "../../hooks";
import ContentItem from "./ContentItem";
import IXDrop from "../IXDrop";
import XDrag from "../XDrag";
import classNames from "classnames";
import CardData from "../../data_structs/CardData";
import "../../css/table.css";
import { TextInput, Menu, StatusIndicator } from "evergreen-ui";
import fuzzysort from "fuzzysort";
import TableHeader from "./TableHeader";
import ReactTable from "react-table";
// import "react-table/react-table.css";

// type InterfaceToCardData = {
//   [key: string]: CardData;
// };

const ContentTable = () => {
  const availableCards = useStoreState(
    (state) => state.appModel.availableCards
  );
  const [filterKey, setFilterKey] = useState<string | undefined>(undefined);
  const [cardItems, setCardItems] = useState(availableCards);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log(searchTerm);
    const test = fuzzysort.go(
      searchTerm,
      cardItems.map((c) => c.title)
    );
    console.log(test);
  }, [searchTerm]);

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
      // setCardItems(availableCards);
    );
    console.log(filterKey);
  }, [filterKey, availableCards]);

  const cardList = useRef<CardData[]>(availableCards);
  // const sortBy = () => {}
  const sortBy = (k: keyof CardData, func: (c: CardData) => number): void => {
    const clone = [...cardList.current];
    cardList.current = clone.sort(func);
  };
  useEffect(() => {
    console.log(availableCards);
  }, [availableCards]);
  return (
    <div>
      <div>{/* <ReactTable data={availableCards}></ReactTable> */}</div>
      <TextInput
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          setSearchTerm(e.currentTarget.value)
        }
        placeholder={"search title"}
      ></TextInput>

      <div style={{ paddingBottom: ".5em", paddingTop: ".5em" }}>
        <Menu.Divider></Menu.Divider>
      </div>
      <IXDrop className={"table-container"} droppableId={"Card Content Table"}>
        <table>
          <tbody>
            {/* <thead> */}
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
              <TableHeader
                title={"Status"}
                onClick={() => setFilterKey("active")}
              ></TableHeader>
            </tr>
            {/* </thead> */}
            {cardItems.map((card, i) => {
              console.log(i);
              return (
                <tr
                  key={i}
                  className={
                    card.isActive
                      ? "content-row-active"
                      : "contnet-row-inactive"
                  }
                >
                  <td>
                    <XDrag
                      draggableId={card.sourceId}
                      index={i}
                      key={i.toString()}
                      isDragDisabled={card.isActive}
                    >
                      <div style={{ display: "flex" }}>
                        <img
                          className={"row-favicon"}
                          src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${card.src}`}
                        ></img>
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
                    </XDrag>
                  </td>

                  <td>{formatDate(card.added)}</td>
                  <td>{card.src}</td>
                  <td>{card.author}</td>
                  <td>{card.interaction}</td>
                  <td className={"status-indicator"}>
                    <div>
                      <StatusIndicator color={"sucess"}></StatusIndicator>
                    </div>
                  </td>
                </tr>
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
export default ContentTable;

// import React, { useState, useEffect, useRef } from "react";
// import { Table } from "evergreen-ui";
// import { useStoreState, useStoreActions } from "../../hooks";

// const ContentTable = () => {
//   // const [, setcur] = useState(value);
//   const availableCards = useStoreState((state) => state.appData.availableCards);
//   useEffect(()=>{
//     console.log(availableCards);
//   },[availableCards]);
//   return (
//     <div>
//       <Table>
//         <Table.Head>
//           <Table.SearchHeaderCell />
//           <Table.TextHeaderCell>Title</Table.TextHeaderCell>
//           <Table.TextHeaderCell>URL</Table.TextHeaderCell>
//           <Table.TextHeaderCell>Date Added</Table.TextHeaderCell>
//         </Table.Head>

//         {/* <Table.VirtualBody allowAutoHeight = {true} estimatedItemSize = {40}> */}
//         <Table.VirtualBody height = {250} estimatedItemSize = {10}>
//           {availableCards.map((card) => (
//             <Table.Row
//               height = {40}
//               key={card.src}
//               isSelectable
//               onSelect={() => alert(card.src)}
//             >
//               <Table.TextCell>{card.src}</Table.TextCell>
//               <Table.TextCell>{card.title}</Table.TextCell>
//               <Table.TextCell>{card.added?.toString()??"undefined"}</Table.TextCell>
//             </Table.Row>
//           ))}
//         </Table.VirtualBody>
//       </Table>
//     </div>
//   );
// };

// export default ContentTable;
