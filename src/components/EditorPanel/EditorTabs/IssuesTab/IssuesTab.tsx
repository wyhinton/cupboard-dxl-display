import React, { useEffect, useRef,useState } from "react";

import FlexRow from "../../../Shared/FlexRow";
import IssuesTable from "./IssuesTable";

const IssuesTab = (): JSX.Element => {
  return (
    <div style={{ height: "100%", pointerEvents: "all" }}>
      <IssuesTable />
    </div>
  );
};

export default IssuesTab;
