import React, { useState, useEffect, useRef } from "react";
import { Table } from "evergreen-ui";
import { useStoreState, useStoreActions } from "../../hooks";
import ContentItem from "./ContentItem";
import IXDrop from "../IXDrop";
import XDrag from "../XDrag";

const ContentTable = () => {
  // const [, setcur] = useState(value);
  const availableCards = useStoreState((state) => state.appData.availableCards);
  useEffect(() => {
    console.log(availableCards);
  }, [availableCards]);
  return (
    <div>
      <IXDrop droppableId={"Card Content Table"}>
        <div style={{ height: "fit-content", border: "1px solid red" }}>
          {availableCards.map((card, i) => {
            console.log(i);
            return (
              <XDrag draggableId={card.instanceId} index={i} key={i.toString()}>
                <ContentItem card={card} index={i} />
              </XDrag>
            );
          })}
        </div>
      </IXDrop>
      <IXDrop droppableId={"drop 2"}>
        <div
          style={{ height: 200, width: "100%", border: "1px solid blue" }}
        ></div>
      </IXDrop>
    </div>
  );
};

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
