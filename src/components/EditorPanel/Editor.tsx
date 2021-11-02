import React from "react";
import { Heading } from "evergreen-ui";
import "../../css/editorPanel.css";
import ContentTab from "./EditorTabs/ContentsTab/ContentsTab";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import LayoutTab from "./EditorTabs/LayoutTab/LayoutTab";
import WidgetsTab from "./EditorTabs/WidgetsTab/WidgetsTab";
// https://github.com/goodoldneon/react-drag-and-dock#api

const Editor = (): JSX.Element => {
  return (
      <Tabs>
        <TabList>
          <Tab>Content</Tab>
          <Tab>Widgets</Tab>
          <Tab>Layouts</Tab>
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
      </Tabs>
  );
};

export default Editor;
