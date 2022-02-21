import React, { useState, useEffect, useRef } from "react";
import ReactDom from "react-dom";
import "../../../../css/googleFormPopup.css";
import { Pane, Dialog } from "evergreen-ui";
import Modal from "../../../Shared/Modal";
import formEmbedUrl from "../../../../static/formEmbedUrl";
import { useLayout, useStoreState } from "../../../../hooks";
import classNames from "classnames";
import Button from "../../../Shared/Button";
import {
  ClipboardIcon,
  InlineAlert,
  CrossIcon,
  Heading,
  ArrowRightIcon,
} from "evergreen-ui";
import "../../../../css/copyField.css";
import Scrollbars from "react-custom-scrollbars";
import FlexRow from "../../../Shared/FlexRow";
import { motion } from "framer-motion";
import DeleteButton from "../../../CardLayout/ViewCard/DeleteButton";
import FlexColumn from "../../../Shared/FlexColumn";

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
  const layoutState = useStoreState((state) => state.layoutsModel.activeLayout);
  const ls = useStoreState((state) => state.layoutsModel.layoutsString);
  const layoutSheetUrl = useStoreState(
    (state) => state.googleSheetsModel.layoutSheetUrl
  );
  // console.log(layoutState?.extendedLayout);
  // console.log(layoutState?.extendedLayout.layoutSettings);

  const [isShown, setIsShown] = useState(visible);
  const [isCopiedJSON, setIsCopiedJson] = useState(false);
  console.log("HELLO IM HERE");
  const { activeLayout } = useLayout();
  const layoutString = useStoreState((state) =>
    JSON.stringify(state.layoutsModel.activeLayout)
  );
  const bufferLayout = useStoreState((state) =>
    JSON.stringify(state.layoutsModel.bufferLayout)
  );
  useEffect(() => {
    // console.log(state.layoutsModel.activeLayout);
    // activeLayout?.layout;
    // bufferLayout;
    console.log(bufferLayout);
  }, [bufferLayout]);
  useEffect(() => {
    // console.log(state.layoutsModel.activeLayout);
    // activeLayout?.layout;
    // bufferLayout;
    console.log(layoutString);
  }, [layoutString]);
  // useEffect(() => {
  //   // console.log(state.layoutsModel.activeLayout);
  //   activeLayout?.layout;
  // }, [activeLayout?.layout]);
  console.log(layoutString);

  return ReactDom.createPortal(
    <Modal
      onClose={onCloseComplete}
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
            <div
              // className={copyFieldContainerClass}
              style={{ width: "min-content" }}
            >
              <CopyField
                onCopy={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  setIsCopiedJson(true);
                }}
                onCloseComplete={onCloseComplete}
                text={layoutString}
              />
            </div>
            <GoogleFormIframe src={formEmbedUrl} active={isCopiedJSON} />
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
