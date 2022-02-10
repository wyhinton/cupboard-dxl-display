import { AddIcon } from "evergreen-ui";
import React, { FC, useEffect, useState } from "react";

import { useStoreActions, useStoreState } from "../../../../hooks";
import formEmbedUrl from "../../../../static/formEmbedUrl";
import Button from "../../../Shared/Button";
import Panel from "../../../Shared/Panel";
import GoogleFormPopup from "./GoogleFormPopup";
import LayoutTable from "./LayoutTable";

const LayoutTab = (): JSX.Element => {
  const layoutState = useStoreState((state) => state.layoutsModel.activeLayout);
  const bufferState = useStoreState((state) => state.layoutsModel.bufferLayout);
  const [showNewLayoutPopup, setShowNewLayoutPopup] = useState(false);
  const fetchCardDataGoogleSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchAppGoogleSheet
  );
  const fetchTopLevelSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchTopLevelSheet
  );
  const [layoutString, setLayoutString] = useState(JSON.stringify(layoutState));
  useEffect(() => {
    setLayoutString(JSON.stringify(bufferState));
  }, [layoutState, bufferState]);

  const newLayoutPopup = (): JSX.Element => {
    return showNewLayoutPopup ? (
      <GoogleFormPopup
        onCloseComplete={() => {
          //reload the layouts after closing the add layout dialog
          fetchTopLevelSheetThunk();
          // fetchCardDataGoogleSheetThunk()
          setShowNewLayoutPopup(false);
        }}
        visible={showNewLayoutPopup}
      />
    ) : (
      <></>
    );
  };
  return (
    <Panel>
      <div
        style={{
          display: "flex",
          // justifyContent: "center",
          width: "100%",
          padding: ".5em",
          justifyContent: "flex-start",
        }}
      >
        <Button
          iconBefore={<AddIcon />}
          onClick={(e) => {
            setShowNewLayoutPopup(true);
          }}
          text="Add New Layout"
          width="55%"
          intent="success"
          appearance="primary"
        />
      </div>
      {newLayoutPopup()}
      <div>
        <LayoutTable />
      </div>
    </Panel>
  );
};

export default LayoutTab;
