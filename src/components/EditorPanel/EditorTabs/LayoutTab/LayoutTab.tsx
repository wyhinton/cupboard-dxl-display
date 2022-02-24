import { AddIcon, IconButton, RefreshIcon } from "evergreen-ui";
import React, { FC, useEffect, useState } from "react";

import {
  useLayout,
  useSheets,
  useStoreActions,
  useStoreState,
} from "../../../../hooks";
import formEmbedUrl from "../../../../static/formEmbedUrl";
import Button from "../../../Shared/Button";
import FlexRow from "../../../Shared/FlexRow";
import Panel from "../../../Shared/Panel";
import TabPane from "../TabPane";
import GoogleFormPopup from "./GoogleFormPopup";
import LayoutTable from "./LayoutTable";

const LayoutTab = (): JSX.Element => {
  const bufferState = useStoreState((state) => state.layoutsModel.bufferLayout);
  const { activeLayout } = useLayout();
  const { fetchTopLevelSheet } = useSheets();

  const [showNewLayoutPopup, setShowNewLayoutPopup] = useState(false);

  const [layoutString, setLayoutString] = useState(
    JSON.stringify(activeLayout)
  );

  useEffect(() => {
    setLayoutString(JSON.stringify(bufferState));
  }, [activeLayout, bufferState]);

  return (
    <div>
      <TabPane
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Button
          appearance="primary"
          iconBefore={<AddIcon />}
          intent="success"
          onClick={(e) => {
            setShowNewLayoutPopup(true);
          }}
          text="Add New Layout"
          width="55%"
        />
        <div style={{ height: "auto", width: "10%" }}>
          <IconButton
            height="100%"
            icon={<RefreshIcon />}
            onClick={(
              _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              fetchTopLevelSheet();
            }}
            width="20%"
          />
        </div>
      </TabPane>
      {showNewLayoutPopup && (
        <GoogleFormPopup
          onCloseComplete={() => {
            fetchTopLevelSheet();
            setShowNewLayoutPopup(false);
          }}
          visible={showNewLayoutPopup}
        />
      )}
      <div>
        <LayoutTable />
      </div>
    </div>
  );
};

export default LayoutTab;
