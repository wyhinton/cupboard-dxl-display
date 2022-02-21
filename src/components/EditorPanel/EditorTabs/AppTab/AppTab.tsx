import { Heading, Switch, TextInputField } from "evergreen-ui";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  useApp,
  useElementSize,
  useSheets,
  useStoreState,
} from "../../../../hooks";
import appConfig from "../../../../static/appConfig";
import IssuesTable from "../IssuesTab/IssuesTable";
import { AutoSizer } from "react-virtualized";
import { Scrollbars } from "react-custom-scrollbars";
import FlexRow from "../../../Shared/FlexRow";
import FlexColumn from "../../../Shared/FlexColumn";

const AppTab = (): JSX.Element => {
  const { rotationSpeed, setRotationSpeed, setRotateLayouts } = useApp();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRotationSpeed(parseInt(e.target.value));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    //@ts-ignore
    console.log(e.target.value);
  // setval(e.target.value);
  const [val, setval] = useState("");
  const [checked, setChecked] = React.useState(true);

  useEffect(() => {
    console.log(checked);
    setRotateLayouts(checked);
    if (checked) {
      //   setRotationSpeed(4000);
      //   setRotationSpeed(appConfig.rotationDuration);
    } else {
      setRotationSpeed(appConfig.rotationDuration);
    }
  }, [checked]);

  useEffect(() => {
    console.log(val);
  }, [val]);

  const [squareRef, { width, height }] = useElementSize();

  return (
    <div style={{ height: "100%", pointerEvents: "all", padding: "1vmin" }}>
      <Heading size={600} style={{ color: "white" }}>
        General
      </Heading>
      <div style={{ margin: ".5em" }}>
        <FlexRow style={{ alignItems: "center" }}>
          <Label>Rotate Layouts</Label>
          <div style={{ paddingLeft: ".5em" }}>
            <Switch
              style={{ margin: "auto" }}
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          </div>
        </FlexRow>
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
    </div>
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
        {links.map((link, i) => (
          <SheetLink title={titles[i]} link={link ?? "not provided"} />
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
        style={{
          color: "white",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "80%",
        }}
        target="_blank"
        rel="noreferrer"
      >
        {link}
      </a>
    </FlexRow>
  );
};
