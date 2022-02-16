import "../../../../css/table.css";
import "../../../../css/editorPanel.css";

import React from "react";
import Scrollbars from "react-custom-scrollbars";

import { useElementSize, useErrors } from "../../../../hooks";

/**
 * Table for displaying app errors
 */

const AppErrorTable = (): JSX.Element => {
  const { appErrors, layoutErrors, googleSheetsErrors } = useErrors();
  const [squareReference, { height }] = useElementSize();
  return (
    <div className="table-container" style={{ height: "100%" }}>
      <table>
        <tbody>
          <tr>
            <th>Error</th>
            <th>Source</th>
            <th>Link</th>
          </tr>
        </tbody>
      </table>
      <div
        ref={squareReference}
        style={{ border: "1px solid red", height: "100%" }}
      >
        <Scrollbars
          autoHide={false}
          id="app-error-scroll-container"
          style={{ width: "100%", height: height - 20 }}
        >
          <table>
            <tbody>
              {[...appErrors, ...layoutErrors, ...googleSheetsErrors].map(
                (error, index) => {
                  const { errorType, link, source } = error;

                  return (
                    <tr
                      key={index}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <td key={index} style={{ color: "#D14343" }}>
                        {`⚠ ${errorType}`}
                      </td>
                      <td>{source}</td>
                      <td>
                        <a
                          href={link}
                          rel="noreferrer"
                          style={{ color: "lightblue" }}
                          target="_blank"
                        >
                          {link}
                        </a>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </Scrollbars>
      </div>
    </div>
  );
};

export default AppErrorTable;
