import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../../../hooks";

/**
 * Table for displaying the available card layouts
 * @returns
 */

const LayoutsTable = () => {
  const externalLayoutsState = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );
  return (
    <div>
      {/* <div>
        <span>Current Layout</span>
      </div> */}
      <table>
        <tr>
          <th>Title</th>
          <th>Date Added</th>
          <th>Author</th>
        </tr>
        <tbody>
          {externalLayoutsState.map((l, index) => {
            return (
              <tr key={index}>
                <td key={index}>{l.title}</td>
                <td>{l.added.toString()}</td>
                <td>{l.author}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LayoutsTable;
