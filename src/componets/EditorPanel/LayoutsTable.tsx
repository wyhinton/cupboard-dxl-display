import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../hooks";

const LayoutsTable = () => {
  const externalLayoutsState = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );
  return (
    <table>
      <tr>
        <th>Title</th>
        <th>Date Added</th>
        <th>Author</th>
      </tr>
      <tbody>
        {externalLayoutsState.map((l, i) => {
          // <div style={{ height: "fit-content" }}>hello</div>;
          return (
            <tr key={i}>
              <td key={i}>{l.title}</td>
              <td>{l.added.toString()}</td>
              <td>{l.author}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LayoutsTable;
