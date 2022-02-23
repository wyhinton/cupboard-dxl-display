import { Heading, Switch } from "evergreen-ui";
import React, { useState } from "react";

import { useAppSettings, useSheets } from "../../../../hooks";
import FlexColumn from "../../../Shared/FlexColumn";
import FlexRow from "../../../Shared/FlexRow";
import TabPane from "../TabPane";

const AppTab = (): JSX.Element => {
  const {
    setRotationSpeed,
    setBlockIframeInteractions,
    setShowQrCodes,
    enableIframeInteractions,
    setRotateLayouts,
    setMuteIframeAudio,
    enableIframeAudio,
    rotateLayouts,
  } = useAppSettings();

  return (
    <TabPane>
      <Heading size={600} style={{ color: "white" }}>
        General
      </Heading>
      <div style={{ margin: ".5em" }}>
        <FlexColumn>
          <SwitchContainer
            onChange={(value) => setRotateLayouts(value)}
            value={rotateLayouts}
          >
            RotateLayouts
          </SwitchContainer>
          <SwitchContainer
            onChange={(value) => setBlockIframeInteractions(value)}
            value={enableIframeInteractions}
          >
            Enable IFrame Interactions
          </SwitchContainer>
          <SwitchContainer
            onChange={(value) => setMuteIframeAudio(value)}
            value={enableIframeAudio}
          >
            Enable IFrame Audio
          </SwitchContainer>
        </FlexColumn>
      </div>
      {/* </div> */}
      <SheetLinks />
      {/* <input
        // label={<Label>Layout Duration</Label>}
        // description="Duration that layout is displayed"
        // placeholder={rotationSpeed.toString()}
        // type="text"
        required
        // value={rotationSpeed.toString()}
        // validationMessage="This field is required"
        // pattern="[0-9]*"
        // disabled={false}
        // onChange={onChange}
        // defaul
        value={val}
        type="text"
        defaultValue={"hello"}
        //@ts-ignore
        // onChange={(e) => setRotationSpeed(parseInt(e.target.value))}
        onChange={(e) => setval(e.target.value)}
        //   // e()
        // }}
      /> */}
    </TabPane>
  );
};

const SwitchContainer = ({
  children,
  onChange,
  value,
}: {
  children: string;
  onChange: (value_: boolean) => void;
  value: boolean;
}): JSX.Element => {
  const [checked, setChecked] = useState(value);
  return (
    <FlexRow
      style={{ margin: ".5em", justifyContent: "space-between", width: "50%" }}
    >
      <Label>{children}</Label>
      <div style={{ paddingLeft: ".5em" }}>
        <Switch
          checked={checked}
          defaultChecked={false}
          onChange={(e) => {
            console.log(e.target.value);
            onChange(e.target.checked);
            setChecked(e.target.checked);
          }}
          style={{ margin: "auto" }}
        />
      </div>
    </FlexRow>
  );
};

const Label = ({ children }: { children: string }) => {
  return <div style={{ color: "white" }}>{children}</div>;
};

export default AppTab;

const SheetLinks = (): JSX.Element => {
  const { cardSheetUrl, layoutSheetUrl, formUrl, parentSheetUrl } = useSheets();
  const links = [parentSheetUrl, cardSheetUrl, layoutSheetUrl, formUrl];
  const titles = ["Parent Sheet", "Content", "Layouts", "Google Form"];

  return (
    <FlexColumn>
      <Heading size={600} style={{ color: "white" }}>
        Google Sheets
      </Heading>
      <FlexColumn
        style={{
          padding: ".5em",
          backgroundColor: "#1f1f1f",
          overflow: "hidden",
        }}
      >
        {links.map((link, index) => (
          <SheetLink link={link ?? "not provided"} title={titles[index]} />
        ))}
      </FlexColumn>
    </FlexColumn>
  );
};

const SheetLink = ({
  title,
  link,
}: {
  title: string;
  link: string;
}): JSX.Element => {
  return (
    <FlexRow
      style={{
        padding: ".5em",
        backgroundColor: "#1f1f1f",
        overflow: "hidden",
        justifyContent: "space-between",
      }}
    >
      <Heading style={{ color: "white" }}>{title + ":  "}</Heading>
      <a
        href={link}
        rel="noreferrer"
        style={{
          color: "white",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "80%",
        }}
        target="_blank"
      >
        {link}
      </a>
    </FlexRow>
  );
};
