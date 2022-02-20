import React from "react";
import { Heading } from "evergreen-ui";
import "../../css/editorPanel.css";
import ContentTab from "./EditorTabs/ContentsTab/ContentsTab";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import LayoutTab from "./EditorTabs/LayoutTab/LayoutTab";
import WidgetsTab from "./EditorTabs/WidgetsTab/WidgetsTab";
import AppTab from "./EditorTabs/AppTab/AppTab";
import IssuesTab from "./EditorTabs/IssuesTab/IssuesTab";
import { useErrors } from "../../hooks";
// https://github.com/goodoldneon/react-drag-and-dock#api

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
      {allErrors.length > 50 ? "50+" : allErrors.length}
    </div>
  );
};
// fill: #52BD95;
// #D14343;
