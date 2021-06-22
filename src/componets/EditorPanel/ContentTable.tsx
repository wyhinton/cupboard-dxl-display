import React, { useState, useEffect, useRef } from "react";
import { Table } from "evergreen-ui";
import { useStoreState, useStoreActions } from "../../hooks";

const ContentTable = () => {
  // const [, setcur] = useState(value);
  const availableCards = useStoreState((state) => state.appData.availableCards);
  useEffect(()=>{
    console.log(availableCards);
  },[availableCards]);
  return (
    <div>
      <Table>
        <Table.Head>
          <Table.SearchHeaderCell />
          <Table.TextHeaderCell>Title</Table.TextHeaderCell>
          <Table.TextHeaderCell>URL</Table.TextHeaderCell>
          <Table.TextHeaderCell>Date Added</Table.TextHeaderCell>
        </Table.Head>

        {/* <Table.VirtualBody allowAutoHeight = {true} estimatedItemSize = {40}> */}
        <Table.VirtualBody height = {250} estimatedItemSize = {10}>
          {availableCards.map((card) => (
            <Table.Row
              height = {40}
              key={card.src}
              isSelectable
              onSelect={() => alert(card.src)}
            >
              <Table.TextCell>{card.src}</Table.TextCell>
              <Table.TextCell>{card.title}</Table.TextCell>
              <Table.TextCell>{card.added?.toString()??"undefined"}</Table.TextCell>
            </Table.Row>
          ))}
        </Table.VirtualBody>
      </Table>
    </div>
  );
};

export default ContentTable;
