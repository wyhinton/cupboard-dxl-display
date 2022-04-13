import "../../../../css/googleFormPopup.css";
import "../../../../css/copyField.css";

import { ClipboardIcon, Heading } from "evergreen-ui";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";

import { useLayout, useSheets, useStoreState } from "../../../../hooks";
import formEmbedUrl from "../../../../static/formEmbedUrl";
import DeleteButton from "../../../CardLayout/ViewCard/DeleteButton";
import Button from "../../../Shared/Button";
import FlexColumn from "../../../Shared/FlexColumn";
import FlexRow from "../../../Shared/FlexRow";
import Modal from "../../../Shared/Modal";

/**
 * Modal popup for displaying cards when in preview mode. Displays on top of the CardLayout, and renders
 * to <div id="google-form-popup"></div> in index.html.
 * @component
 */

interface GoogleFormPopupProperties {
  visible: boolean;
  onCloseComplete: () => void;
}

const GoogleFormPopup = ({
  visible,
  onCloseComplete,
}: GoogleFormPopupProperties): JSX.Element => {
  const { layoutSheetUrl } = useSheets();
  const { activeLayout } = useLayout();
  const [isShown, setIsShown] = useState(visible);
  const [isCopiedJSON, setIsCopiedJson] = useState(false);
  const [contentString, setContentString] = useState("");
  // const [trueLayoutString, setTrueLayoutString] = useState("");
  // const { activeLayout } = useLayout();
  const layoutString = useStoreState((state) =>
    JSON.stringify(state.layoutsModel.activeLayout)
  );
  const trueLayoutString = useStoreState((state) =>
    JSON.stringify(state.layoutsModel.activeLayout?.layout.lg)
  );

  useEffect(() => {
    // console.log(layoutString);
    // console.log(trueLayoutString);
    // const toEdit = JSON.parse(layoutString);
    // delete toEdit.backupLayout;
    // delete toEdit.sourceLayout;
    // toEdit.layout = JSON.parse(JSON.stringify(activeLayout?.layout.lg));
    // setContentString(JSON.stringify(toEdit));
    // console.log(toEdit);
  }, [layoutString, activeLayout]);

  return ReactDom.createPortal(
    <Modal
      onClose={() => {}}
      active={isShown}
      containerClassName="google-form-popup"
      backdropOpacity={0.5}
    >
      <div className={"google-form-popup-inner-container"}>
        <DeleteButton
          onClick={onCloseComplete}
          action={() => {
            onCloseComplete;
          }}
        />
        <FlexColumn>
          <div style={{ borderBottom: "1px solid white", padding: "1vmin" }}>
            <Heading color="white" size={900}>
              Add a new layout
            </Heading>
            <Heading color="white" size={400}>
              {`The layout will be stored in `}{" "}
              <a
                style={{ color: "lightblue" }}
                target="_blank"
                rel="noreferrer"
                href={layoutSheetUrl}
              >
                {layoutSheetUrl}
              </a>
            </Heading>
          </div>
          <FlexRow
            style={{
              height: "50vh",
              padding: "4vmin",
              // alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "min-content" }}>
              <CopyField
                onCopy={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  setIsCopiedJson(true);
                }}
                onCloseComplete={onCloseComplete}
                text={layoutString}
              />
            </div>
<<<<<<< Updated upstream
            <GoogleFormIframe src={formEmbedUrl} active={isCopiedJSON} />
=======
            <Button
              onClick={(e) => {
                navigator.clipboard.writeText(trueLayoutString);
                setIsCopiedJson(true);
              }}
            ></Button>
            <GoogleFormIframe active={isCopiedJSON} />
>>>>>>> Stashed changes
          </FlexRow>
        </FlexColumn>
      </div>
    </Modal>,
    document.querySelector("#google-form-popup") as HTMLElement
  );
};
export default GoogleFormPopup;
//TODO: IMPROVE INHERITANCE OF BUTTONS
const CopyField = ({
  text,
  onCloseComplete,
  onCopy,
  isCurrentClipBoardContent,
}: {
  text: string;
  isCurrentClipBoardContent?: boolean;
  onCloseComplete: () => void;
  onCopy: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}): JSX.Element => {
  const [isClipBoardCorrect, setIsClipBoardCorrect] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    navigator.clipboard
      .readText()
      .then((clipboardText) => {
        if (text === clipboardText) {
          setIsClipBoardCorrect(true);
          setIsCopied(true);
        } else {
          setIsCopied(false);
          setIsClipBoardCorrect(false);
        }
      })
      .catch((error) => {
        console.error("Failed to read clipboard contents:", error);
      });
  }, [text]);
  return (
    <>
      <Button
        iconBefore={<ClipboardIcon />}
        text={"Copy Layout To Clip Board"}
        onClick={(e) => {
          navigator.clipboard.writeText(text);
          setIsCopied(true);
          onCopy(e);
        }}
        width={250}
        height={100}
        intent={"success"}
        appearance={"primary"}
      />
      {/* <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: "1em",
          }}
        ></div>
      </div> */}
    </>
  );
};

const GoogleFormIframe = ({
  src,
  active,
}: {
  src: string;
  active: boolean;
}): JSX.Element => {
  return (
    <div
      style={{
        width: 500,
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "red",
          zIndex: 1,
          top: 0,
          left: 0,
          opacity: 0.5,
          display: "flex",
          alignItems: "center",
          pointerEvents: active ? "none" : "all",
        }}
        animate={active ? { opacity: 0 } : {}}
      >
        <div
          style={{
            width: "50%",
            margin: "auto",
            fontWeight: "bold",
            border: "1px solid white",
            padding: "1em",
            backgroundColor: "white",
            opacity: 1,
          }}
        >
          Press the Copy Layout Button before Submitting New Layout
        </div>
      </motion.div>
      <iframe
        src={src}
        // className={"google-form-iframe"}
        // width={"100%"}
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </div>
  );
};

const SideButton = (): JSX.Element => {
  return (
    <div
      style={{
        // position: "absolute",
        left: "-100%",
        height: 300,
        width: 300,
        backgroundColor: "red",
      }}
    >
      hello
    </div>
  );
};

{
  /* <Heading color={isCopiedJSON ? "green" : ""}>
            1. Press the Copy Button
          </Heading> */
}
{
  /* <Heading>
            {isCopiedJSON
              ? "2. Fill out the form, and paste the copied text into the Content field, then submit"
              : ""}
          </Heading> */
}
