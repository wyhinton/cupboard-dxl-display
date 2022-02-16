import { Switch, TextInputField } from "evergreen-ui";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useApp, useElementSize, useStoreState } from "../../../../hooks";
import appConfig from "../../../../static/appConfig";
import AppErrorTable from "./AppErrorTable";
import { AutoSizer } from "react-virtualized";
import { Scrollbars } from "react-custom-scrollbars";
import FlexRow from "../../../Shared/FlexRow";

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
      setRotationSpeed(10000);
    }
  }, [checked]);

  useEffect(() => {
    console.log(val);
  }, [val]);

  const [squareRef, { width, height }] = useElementSize();

  return (
    <div style={{ height: "100%", pointerEvents: "all" }}>
      <div style={{ margin: ".5em" }}>
        <FlexRow>
          <Label>Rotate Layouts</Label>
          <div style={{ paddingLeft: ".5em" }}>
            <Switch
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          </div>
        </FlexRow>
      </div>

      <AppErrorTable />
      {/* </div> */}

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