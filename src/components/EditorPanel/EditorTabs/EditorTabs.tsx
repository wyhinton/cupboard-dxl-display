import "../../../css/editorPanel.css";
import "react-tabs/style/react-tabs.css";

import { Heading } from "evergreen-ui";
import React from "react";
import { Tab, TabList, TabPanel,Tabs } from "react-tabs";

import { useErrors } from "../../../hooks";
import AppTab from "./AppTab/AppTab";
import ContentTab from "./ContentsTab/ContentsTab";
import IssuesTab from "./IssuesTab/IssuesTab";
import LayoutTab from "./LayoutTab/LayoutTab";
import WidgetsTab from "./WidgetsTab/WidgetsTab";
// https://github.com/goodoldneon/react-drag-and-dock#api

/**Contains all the tab components for the editor panel */
const Editor = (): JSX.Element => {
  return (
    <Tabs>
      <TabList>
        <Tab>Content</Tab>
        <Tab>Widgets</Tab>
        <Tab>Layouts</Tab>
        <Tab>App Settings</Tab>
        <Tab>
          Issues <ErrorsNofictions />
        </Tab>
      </TabList>
      <TabPanel>
        <ContentTab />
      </TabPanel>
      <TabPanel>
        <WidgetsTab />
      </TabPanel>
      <TabPanel>
        <LayoutTab />
      </TabPanel>
      <TabPanel>
        <AppTab />
      </TabPanel>
      <TabPanel>
        <IssuesTab />
      </TabPanel>
    </Tabs>
  );
};

export default Editor;

const ErrorsNofictions = (): JSX.Element => {
  const { allErrors } = useErrors();
  return (
    <div
      style={{
        backgroundColor: allErrors.length > 0 ? "#D14343" : "#52BD95",
        opacity: 0.5,
        borderRadius: "50%",
        width: 20,
        height: 20,
        aspectRatio: "1/1",
        fontSize: "70%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "1em",
      }}
    >
      {50 < allErrors.length ? "50+" : allErrors.length}
    </div>
  );
};
