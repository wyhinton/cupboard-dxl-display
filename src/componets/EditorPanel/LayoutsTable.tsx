import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../hooks";

// const SubmissionForm = (art) => {
//   const artString = JSON.stringify(art);
//   return (
//     //anyway to get the artString into a field in the iframe?
//     <iframe
//       src="https://docs.google.com/forms/d/e/1FAIpQLSeKP2imQv_UCj4qrGNk7mT6Rzz83F30IvEl8ZFdERIdzSnvig/viewform?usp=sf_link"
//       width={"100%"}
//       height={673}
//       frameBorder={0}
//       marginHeight={0}
//       marginWidth={0}
//     >
//       Loading…
//     </iframe>
//   );
// };
const LayoutsTable = () => {
  const externalLayoutsState = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );
  return (
    <div>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSeKP2imQv_UCj4qrGNk7mT6Rzz83F30IvEl8ZFdERIdzSnvig/viewform?usp=sf_link"
        width={"100%"}
        height={673}
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
      >
        Loading…
      </iframe>
      <div>
        <span>Current Layout</span>
        {/* <tee */}
      </div>
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
    </div>
  );
};

export default LayoutsTable;
