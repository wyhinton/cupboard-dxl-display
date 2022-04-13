import "../../../../css/table.css";

import { StatusIndicator } from "evergreen-ui";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import type LayoutData from "../../../../data_structs/LayoutData";
import { AppMode, DndTypes, DragSource } from "../../../../enums";
import {
  useApp,
  useLayout,
  useStoreActions,
  useStoreState,
  useWindowSize,
} from "../../../../hooks";
import appConfig from "../../../../static/appConfig";
import { formatDate } from "../../../../utils";
import CardLayout from "../../../CardLayout/CardLayout";
import IXDrop from "../../../DragAndDrop/IXDrop";
import PopOver from "../../PopOver";
/**
 * Displays the available layouts.
 */

const LayoutTable = (): JSX.Element => {
  const externalLayoutsState = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );
  const activeLayoutState = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );

  const { setActiveLayout } = useLayout();

  return (
    <div>
      <IXDrop
        cardType={DndTypes.CLOCK}
        className="table-container"
        droppableId={DragSource.LAYOUT_TABLE}
        isDropDisabled={false}
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
                <tr key={index} onClick={(e) => setActiveLayout(l)}>
                  <td
                    key={index}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {id === activeLayoutState?.id && (
                      <StatusIndicator color="success" />
                    )}
                    <LayoutTitle layout={l} />
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

const LayoutTitle = ({ layout }: { layout: LayoutData }): JSX.Element => {
  const [hovered, setHovered] = useState(false);

  const [position, setPosition] = useState([0, 0]);
  const { title } = layout;
  const { width, height } = useWindowSize();
  const scale = 0.5;
  const { appMode } = useApp();

  const layoutCardIds = layout.sources();
  const layoutWidgetsIds = layout.widgets();

  const cards = useStoreState((state) =>
    state.appModel.availableCards.filter((c) => layoutCardIds.includes(c.src))
  );

  const widgets = useStoreState((state) =>
    state.appModel.availableWidgets.filter((c) =>
      layoutWidgetsIds.includes(c.id)
    )
  );

  // const appMod
  return (
    <div>
      <div
        onMouseEnter={(e) => {
          const { pageX, pageY } = e;
          setPosition([pageX, pageY]);
          setHovered(true);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
        }}
        style={{
          textDecoration: hovered ? "underline" : "",
        }}
      >
        {title}
      </div>
      {appMode === AppMode.EDIT && hovered && (
        <PopOver
          height={height * scale}
          visible={hovered}
          width={width * scale}
          x={position[0]}
          y={position[1]}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "inherit",
              height,
              width,
            }}
          >
            <CardLayout
              appMode={AppMode.DISPLAY}
              cardSettings={layout.layoutSettings.cardSettings}
              cards={cards}
              cols={appConfig.gridSettings.gridCols}
              height={height}
              layout={layout.layout}
              margin={[20, 20]}
              onLayoutChange={(l) => {}}
              rows={appConfig.gridSettings.gridRows}
              widgets={widgets}
              width={width}
            />
          </div>
        </PopOver>
      )}
    </div>
  );
};
