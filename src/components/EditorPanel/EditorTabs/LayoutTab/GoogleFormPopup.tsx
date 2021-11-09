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
  const layoutState = useStoreState((state) => state.layoutsModel.activeLayout);
  console.log(layoutState?.extendedLayout);
  console.log(layoutState?.extendedLayout.layoutSettings);
  
  const [isShown, setIsShown] = useState(visible);
  const [isCopiedJSON, setIsCopiedJson] = useState(false)
  console.log("HELLO IM HERE");
  // const [layoutString, setLayoutString] = useState(
  //   JSON.stringify(layoutState?.layout)
  // );

  // const [layoutString, setLayoutString] = useState(
  //   JSON.stringify(layoutState?.extendedLayout)
  // );

  const layoutString = useStoreState((state) => JSON.stringify(state.layoutsModel.activeLayout?.extendedLayout));
  console.log(layoutString);
  const copyFieldContainerClass = classNames("copy-field-container", {
    "copy-field-container-closed": isCopiedJSON,
  });


  return ReactDom.createPortal(
    <Modal
      onClose={onCloseComplete}
      active={isShown}
      containerClassName="google-form-popup"
      backdropOpacity={0.5}
    >
      <div className={"google-form-popup-inner-container"}>
      <Heading>
            1. Press the Copy Button
        </Heading>
        <Heading>
          {
             isCopiedJSON?"2. Fill out the form, and paste the copied text into the Content field, then submit":""
          }
        </Heading>
        <div
          className={copyFieldContainerClass}
        >
        <CopyField onCopy = {(e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{setIsCopiedJson(true)}} onCloseComplete={onCloseComplete} text={layoutString} />
        </div>
      </div>
      {isCopiedJSON?
      <GoogleFormIframe src = {formEmbedUrl}/>:<></>
     }

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
  onCopy: (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>void;
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
          setIsCopied(false);
          setIsClipBoardCorrect(false);
        }
      })
      .catch((error) => {
        console.error("Failed to read clipboard contents:", error);
      });
  }, [text]);
  return (
    <div>
            <Button
          iconBefore={<ClipboardIcon />}
          text={"Copy Layout To Clip Board"}
          onClick={(e) => {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
            onCopy(e)
          }}
          width = {"100%"}
          intent={"success"}
          appearance={"primary"}
        />
      {/* <div className={copyFieldClass}>
        <Scrollbars autoHeightMin={0} autoHeightMax={200}>
          {text}
        </Scrollbars>
      </div> */}
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
          iconBefore={<CrossIcon />}
          text={"Return"}
          onClick={onCloseComplete}
        />
      </div>
    </div>
  );
};


const GoogleFormIframe = ({src}:{src: string}): JSX.Element =>{
  return(
    <iframe
    src={src}
    className = {"google-form-iframe"}
    width={"100%"}
    frameBorder={0}
    marginHeight={0}
    marginWidth={0}
    // style={{ height: "60em" }}
    ></iframe>
  )
}
