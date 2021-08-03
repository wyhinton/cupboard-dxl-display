import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../../../hooks";
import IXDrop from "../../../IXDrop";
import XDrag from "../../../XDrag";
import { DndTypes, DragSource } from "../../../../enums";
/**
 * Table for displaying the available card layouts
 * @returns
 */

const LayoutTable = (): JSX.Element => {
  const externalLayoutsState = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );
  return (
    <div>
      {/* <div>
        <span>Current Layout</span>
      </div> */}
      <IXDrop
        className={"table-container"}
        droppableId={DragSource.LAYOUT_TABLE}
        isDropDisabled={false}
        cardType={DndTypes.CLOCK}
      >
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th>Date Added</th>
              <th>Author</th>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            {externalLayoutsState.map((l, index) => {
              return (
                <XDrag
                  dndType={DndTypes.LAYOUT}
                  draggableId={l.id}
                  index={index}
                  key={index.toString()}
                  isDragDisabled={false}
                  className={"layout-row-active"}
                >
                  <>
                    <td key={index}>{l.title}</td>
                    <td>{l.added.toString()}</td>
                    <td>{l.author}</td>
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

export default LayoutTable;
