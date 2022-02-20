import "../../../../css/table.css";
import "../../../../css/editorPanel.css";

import React from "react";
import Scrollbars from "react-custom-scrollbars";

import { useElementSize, useErrors } from "../../../../hooks";
import AppError from "../../../../interfaces/AppError";

/**
 * Table for displaying app errors from the apps store model
 */

const IssuesTable = (): JSX.Element => {
  const { appErrors, layoutErrors, googleSheetsErrors } = useErrors();
  const [squareReference, { height }] = useElementSize();
  return (
    <div
      className="table-container"
      style={{ height: 400, width: 500, overflowY: "scroll" }}
      // style={{ height: 400, width: "100%", overflowY: "scroll" }}
    >
      <div ref={squareReference} style={{ width: "100%" }}>
        {[...appErrors, ...layoutErrors, ...googleSheetsErrors].map(
          (error, index) => {
            return <ErrorMessage error={error} key={index} />;
          }
        )}
      </div>
    </div>
  );
};

const ErrorMessage = ({ error }: { error: AppError }): JSX.Element => {
  const { errorType, link, source } = error;

  return (
    <div
      style={{
        display: "flex",
        padding: "1vmin",
        flexDirection: "column",
        // height: 300,
        width: "100%",
        marginRight: "10vmin",
        backgroundColor: "#421717",
        borderBottom: "1px solid white",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          color: "#D14343",
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >{`⚠ ${errorType}`}</div>
      <div>{source}</div>
      <div>
        <a
          href={link}
          rel="noreferrer"
          style={{ color: "lightblue" }}
          target="_blank"
        >
          {link}
        </a>
      </div>
    </div>
  );
};

export default IssuesTable;
