import React from "react";
import { Heading } from "evergreen-ui";
import DropDownMenu from "../Shared/DropDownMenu";
import { AppMode } from "../../enums";
import "../../css/editorPanel.css";
import ContentTable from "./EditorTabs/ContentsTab/ContentsTab";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import PerformanceTests from "./EditorSection/PerformanceTests";
import LayoutTab from "./EditorTabs/LayoutTab/LayoutTab";
// https://github.com/goodoldneon/react-drag-and-dock#api

const Editor = (): JSX.Element => {
  return (
    <div className="editor-form-container">
      <Tabs>
        <TabList>
          <Tab>Content</Tab>
          <Tab>Layouts</Tab>
          <Tab>Performance Tests</Tab>
        </TabList>
        <TabPanel>
          <ContentTable />
        </TabPanel>
        <TabPanel>
          <LayoutTab />
        </TabPanel>
        <TabPanel>
          <PerformanceTests />
        </TabPanel>
      </Tabs>
    </div>
  );
};

interface FormSectionProperties {
  title: string;
  children: JSX.Element | JSX.Element[];
}
const FormSection = ({ title, children }: FormSectionProperties) => {
  return (
    <div className={"form-section-container"}>
      <div className={"form-section-header"}>
        <Heading size={500}>{title}</Heading>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{children}</div>
    </div>
  );
};

export default Editor;
