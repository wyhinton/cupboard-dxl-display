import React, { useState, useEffect, useRef } from "react";
import ReactDom from "react-dom";
import "../../../../css/googleFormPopup.css";
import { Pane, Dialog } from "evergreen-ui";
import Modal from "../../../Shared/Modal";
import formEmbedUrl from "../../../../static/formEmbedUrl";
import { useStoreState } from "../../../../hooks";
import classNames from "classnames";
import Button from "../../../Shared/Button";
import { ClipboardIcon, InlineAlert, CrossIcon, Heading } from "evergreen-ui";
import "../../../../css/copyField.css";
import Scrollbars from "react-custom-scrollbars";
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
  const [isShown, setIsShown] = React.useState(visible);
  const layoutState = useStoreState((state) => state.layoutsModel.activeLayout);
  const [layoutString, setLayoutString] = useState(
    JSON.stringify(layoutState?.layout)
  );
  const copyString = useRef("");
  return ReactDom.createPortal(
    <Modal
      onClose={onCloseComplete}
      active={isShown}
      containerClassName="google-form-popup"
      backdropOpacity={0.5}
    >
      <div className={"google-form-popup-inner-container"}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        ></div>
        <CopyField onCloseComplete={onCloseComplete} text={layoutString} />
      </div>
      <iframe
        src={formEmbedUrl}
        width={"100%"}
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        style={{ height: "60em" }}
      >
        Loading…
      </iframe>
    </Modal>,
    document.querySelector("#google-form-popup") as HTMLElement
  );
};
export default GoogleFormPopup;
//TODO: IMPROVE INHERITANCE OF BUTTONS
const CopyField = ({
  text,
  onCloseComplete,
  isCurrentClipBoardContent,
}: {
  text: string;
  isCurrentClipBoardContent?: boolean;
  onCloseComplete: () => void;
}): JSX.Element => {
  const [isClipBoardCorrect, setIsClipBoardCorrect] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyFieldClass = classNames("copy-field", {
    "copy-field-success": isCopied && isClipBoardCorrect,
    "copy-field-failure": !isCopied && !isClipBoardCorrect,
  });
  useEffect(() => {
    navigator.clipboard
      .readText()
      .then((clipboardText) => {
        if (text === clipboardText) {
          setIsClipBoardCorrect(true);
          setIsCopied(true);
        } else {
          //   console.log("TEXT WAS NOT THE SAME");
          setIsCopied(false);
          setIsClipBoardCorrect(false);
        }
        // console.log("Pasted content:", clipboardText);
      })
      .catch((error) => {
        // console.error("Failed to read clipboard contents:", error);
      });
  }, [text]);
  return (
    // <Scrollbars width={500} height={400}>
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>Copy and paste the following JSON into the Content Field</div>
      </div>

      <div className={copyFieldClass}>
        <Scrollbars autoHeightMin={0} autoHeightMax={200}>
          {text}
        </Scrollbars>
      </div>
      {!isClipBoardCorrect ? (
        <InlineAlert intent="warning">
          Current clipboard content is out of sync with current layout, copy the
          layout to clipboard again.
        </InlineAlert>
      ) : (
        <InlineAlert intent="success">Clipboard is current</InlineAlert>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: "1em",
        }}
      >
        <Button
          iconBefore={<ClipboardIcon />}
          text={"Copy Layout To Clip Board"}
          onClick={(e) => {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
          }}
        />
        <Button
          iconBefore={<CrossIcon />}
          text={"Return"}
          onClick={onCloseComplete}
        />
      </div>
    </div>
  );
};

// interface BackdropProperties {
//   show: boolean;
//   children: JSX.Element | JSX.Element[];
// }
// const MyBackdrop = ({ show, children }: BackdropProperties) => {
//   return <div className={"modal-backdrop-active "}>{children}</div>;
// };
