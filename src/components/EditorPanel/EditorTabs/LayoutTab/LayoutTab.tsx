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
} from "evergreen-ui";
import Button from "../../../Shared/Button";
import classNames from "classnames";
import "../../../../css/copyField.css";
// import {Component} from "./Component";
import { useStoreState } from "../../../../hooks";
const LayoutTab: FC = () => {
  const layoutState = useStoreState((state) => state.layoutsModel.activeLayout);
  const bufferState = useStoreState((state) => state.layoutsModel.bufferLayout);
  const [layoutString, setLayoutString] = useState(JSON.stringify(layoutState));
  useEffect(() => {
    setLayoutString(JSON.stringify(bufferState));
  }, [layoutState, bufferState]);
  return (
    <>
      <Collapsible trigger={<CollapseTrigger title={"Submit New Layout"} />}>
        <CopyField text={layoutString} />
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
      </Collapsible>
      <div style={{ paddingTop: "1em" }}>
        <LayoutTable />
      </div>
    </>
  );
};

export default LayoutTab;

const CopyField = ({ text }: { text: string }): JSX.Element => {
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
          console.log("TEXT WAS NOT THE SAME");
          setIsCopied(false);
          setIsClipBoardCorrect(false);
        }
        console.log("Pasted content:", clipboardText);
      })
      .catch((error) => {
        console.error("Failed to read clipboard contents:", error);
      });
  }, [text]);
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button
          text={"Copy Layout To Clip Board"}
          onClick={(e) => {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
          }}
        />
        {!isClipBoardCorrect ? (
          <InlineAlert intent="warning">
            Current clipboard content is out of sync with current layout, copy
            the layout to clipboard again.
          </InlineAlert>
        ) : (
          <></>
        )}
      </div>
      <div className={copyFieldClass}>
        {/* <div>ClipboardIcon</div> */}
        {text}
      </div>
    </div>
  );
};

const CollapseTrigger = ({ title }: { title: string }): JSX.Element => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div
      onClick={() => {
        setCollapsed(!collapsed);
      }}
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {title}
      {collapsed ? <CaretDownIcon /> : <CaretUpIcon />}
    </div>
  );
};

// function copyToClp(txt: string){
//   var m = document;
//   txt = m.createTextNode(txt);
//   var w = window;
//   var b = m.body;
//   b.appendChild(txt);
//   if (b.createTextRange) {
//       var d = b.createTextRange();
//       d.moveToElementText(txt);
//       d.select();
//       m.execCommand('copy');
//   }
//   else {
//       var d = m.createRange();
//       var g = w.getSelection;
//       d.selectNodeContents(txt);
//       g().removeAllRanges();
//       g().addRange(d);
//       m.execCommand('copy');
//       g().removeAllRanges();
//   }
//   txt.remove();
// }
