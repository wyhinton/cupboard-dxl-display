import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../../../hooks";
import IXDrop from "../../../DragAndDrop/IXDrop";
import XDrag from "../../../DragAndDrop/DraggableRow";
import { DndTypes, DragSource } from "../../../../enums";
import { StatusIndicator } from "evergreen-ui";
import { formatDate } from "../../../../utils";
import "../../../../css/table.css";
/**
 * Table for displaying the available card layouts
 * @returns
 */

const LayoutTable = (): JSX.Element => {
  const externalLayoutsState = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );
  const activeLayoutState = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );

  const setActiveLayoutAction = useStoreActions(
    (actions) => actions.layoutsModel.setActiveLayout
  );
  return (
    <div>
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
              const { id, title, author, added } = l;
              return (
                <tr key={index} onClick={(e) => setActiveLayoutAction(l)}>
                  <td key={index}>
                    {id === activeLayoutState?.id ? (
                      <StatusIndicator color="success" />
                    ) : (
                      <></>
                    )}
                    {title}
                  </td>
                  <td>{formatDate(added)}</td>
                  <td>{author}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </IXDrop>
    </div>
  );
};

export default LayoutTable;
