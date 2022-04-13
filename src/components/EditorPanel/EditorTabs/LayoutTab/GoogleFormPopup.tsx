import "../../../../css/googleFormPopup.css";
import "../../../../css/copyField.css";

import { ClipboardIcon, Heading } from "evergreen-ui";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";

import { useLayout, useSheets, useStoreState } from "../../../../hooks";
import DeleteButton from "../../../CardLayout/ViewCard/DeleteButton";
import Button from "../../../Shared/Button";
import FlexColumn from "../../../Shared/FlexColumn";
import FlexRow from "../../../Shared/FlexRow";
import Modal from "../../../Shared/Modal";
import GoogleFormIframe from "./GoogleFormPopup/GoogleFormIframe";

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
  const { layoutSheetUrl, formUrl } = useSheets();

  const { activeLayout } = useLayout();
  const [isShown, setIsShown] = useState(visible);
  const [isCopiedJSON, setIsCopiedJson] = useState(false);
  const [contentString, setContentString] = useState("");
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
      active={isShown}
      backdropOpacity={0.5}
      containerClassName="google-form-popup"
      onClose={() => {}}
    >
      <div className="google-form-popup-inner-container">
        <DeleteButton
          action={() => {
            onCloseComplete;
          }}
          onClick={onCloseComplete}
        />
        <FlexColumn>
          <div style={{ borderBottom: "1px solid white", padding: "1vmin" }}>
            <Heading color="white" size={900}>
              Add a new layout
            </Heading>
            <Heading color="white" size={400}>
              {`The layout will be stored in `}{" "}
              <a
                href={layoutSheetUrl}
                rel="noreferrer"
                style={{ color: "lightblue" }}
                target="_blank"
              >
                {layoutSheetUrl}
              </a>
            </Heading>
          </div>
          <FlexRow
            style={{
              height: "50vh",
              padding: "4vmin",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "min-content" }}>
              {/* <CopyField
                onCloseComplete={onCloseComplete}
                onCopy={() => {
                  setIsCopiedJson(true);
                }}
                text={layoutString}
              /> */}
            </div>
<<<<<<< HEAD
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
=======
            <GoogleFormIframe active={isCopiedJSON} />
>>>>>>> 1831a28e736b88812ec445c3ac0c774b3b31a111
          </FlexRow>
        </FlexColumn>
      </div>
    </Modal>,
    document.querySelector("#google-form-popup") as HTMLElement
  );
};
export default GoogleFormPopup;

// //TODO: IMPROVE INHERITANCE OF BUTTONS
// const CopyField = ({
//   text,
//   onCloseComplete,
//   onCopy,
//   isCurrentClipBoardContent,
// }: {
//   text: string;
//   isCurrentClipBoardContent?: boolean;
//   onCloseComplete: () => void;
//   onCopy: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
// }): JSX.Element => {
//   const [isClipBoardCorrect, setIsClipBoardCorrect] = useState(false);
//   const [isCopied, setIsCopied] = useState(false);

//   useEffect(() => {
//     navigator.clipboard
//       .readText()
//       .then((clipboardText) => {
//         if (text === clipboardText) {
//           setIsClipBoardCorrect(true);
//           setIsCopied(true);
//         } else {
//           setIsCopied(false);
//           setIsClipBoardCorrect(false);
//         }
//       })
//       .catch((error: unknown) => {
//         console.error("Failed to read clipboard contents:", error);
//       });
//   }, [text]);
//   return (
//     <>
//       <Button
//         appearance="primary"
//         height={100}
//         iconBefore={<ClipboardIcon />}
//         intent="success"
//         onClick={(e) => {
//           navigator.clipboard.writeText(text);
//           setIsCopied(true);
//           onCopy(e);
//         }}
//         text="Copy Layout To Clip Board"
//         width={250}
//       />
//       {/* <div>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "center",
//             paddingTop: "1em",
//           }}
//         ></div>
//       </div> */}
//     </>
//   );
// };

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
