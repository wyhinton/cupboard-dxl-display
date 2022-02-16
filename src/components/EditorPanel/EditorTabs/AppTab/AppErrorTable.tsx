import React, { useState, useEffect } from "react";
import {
  useStoreState,
  useStoreActions,
  useApp,
  useElementSize,
  useErrors,
} from "../../../../hooks";
import { DndTypes, DragSource } from "../../../../enums";
import "../../../../css/table.css";
import "../../../../css/editorPanel.css";
import Scrollbars from "react-custom-scrollbars";

/**
 * Table for displaying app errors
 */

const AppErrorTable = (): JSX.Element => {
  //   const { appErrors } = useApp();
  // const appErrors = useStoreState((state) => state.appModel.appErrors);
  // const layoutErrors = useStoreState((state) => state.appModel.l);

  const { appErrors, layoutErrors } = useErrors();
  const [squareRef, { width, height }] = useElementSize();
  console.log(height);
  return (
    <div style={{ height: "100%" }} className={"table-container"}>
      <table>
        <tbody>
          <tr>
            <th>Error</th>
            <th>Source</th>
            <th>Link</th>
          </tr>
        </tbody>
      </table>
      <div ref={squareRef} style={{ border: "1px solid red", height: "100%" }}>
        <Scrollbars
          // style={{ width: "100%", height: height / 1.5 }}
          style={{ width: "100%", height: height - 30 }}
          // autoHeight
          autoHide={false}
          // style={{ width: "100%", height: height / 1.5 }}
          id="app-error-scroll-container"
        >
          <table>
            <tbody>
              {[...appErrors, ...layoutErrors].map((error, index) => {
                const { errorType, description, link, source } = error;

                return (
                  <tr key={index}>
                    <td key={index} style={{ color: "#D14343" }}>
                      {`⚠ ${errorType}`}
                    </td>
                    <td>{source}</td>
                    <td>
                      <a
                        href={link}
                        target="_blank"
                        style={{ color: "lightblue" }}
                      >
                        {link}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Scrollbars>
      </div>
    </div>
  );
};

export default AppErrorTable;
