import React, { useState, useEffect, FC } from "react";
import LayoutTable from "./LayoutTable";
import formEmbedUrl from "../../../../static/formEmbedUrl";
import Collapsible from "react-collapsible";
import {
  Menu,
  ClipboardIcon,
  CaretUpIcon,
  CaretDownIcon,
  InlineAlert,
  DocumentIcon,
} from "evergreen-ui";
import Button from "../../../Shared/Button";
import classNames from "classnames";
import GoogleFormPopup from "./GoogleFormPopup";
import { useStoreState, useStoreActions } from "../../../../hooks";
import Panel from "../../../Shared/Panel"; 

const LayoutTab: FC = () => {
  const layoutState = useStoreState((state) => state.layoutsModel.activeLayout);
  const bufferState = useStoreState((state) => state.layoutsModel.bufferLayout);
  const [isShown, setIsShown] = useState(false);
  const fetchCardDataGoogleSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchAppGoogleSheet
  );
  const [layoutString, setLayoutString] = useState(JSON.stringify(layoutState));
  useEffect(() => {
    setLayoutString(JSON.stringify(bufferState));
  }, [layoutState, bufferState]);

  return (
    <>
      <Panel>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Button
          iconBefore={<DocumentIcon />}
          text={"Add New Layout"}
          onClick={(e) => {
            setIsShown(true);
          }}
          width={400}
        />
      </div>
      {isShown ? (
        <GoogleFormPopup
          onCloseComplete={() => {
            //reload the layouts after closing the add layout dialog
            fetchCardDataGoogleSheetThunk()
            setIsShown(false);
          }}
          visible={isShown}
        />
      ) : (
        <></>
      )}
      <div>
        <LayoutTable />
      </div>
      </Panel>
    </>

  );
};

export default LayoutTab;
