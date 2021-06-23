import React, { useState } from "react";
import Button from "../Button";
import Toolbar from "../Toolbar";
import { Heading } from "evergreen-ui";
import DropDownMenu from "../DropDownMenu";
import { AppMode } from "../../enums";
import "../../css/editorPanel.css";
import { useStoreState, useStoreActions } from "../../hooks";
import { SelectMenuItem } from "evergreen-ui";
import ContentTable from "./ContentTable";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import PerformanceTests from "./EditorSection/PerformanceTests";
import LayoutManager from "./EditorSection/LayoutManger";
import LayoutsTabel from "./LayoutsTable";
// https://github.com/goodoldneon/react-drag-and-dock#api

const EditorForm = (): JSX.Element => {
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
          <LayoutsTabel />
          <LayoutManager />
        </TabPanel>
        <TabPanel>
          <PerformanceTests />
        </TabPanel>
      </Tabs>
    </div>
  );
};

interface FormSectionProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}
const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div className={"form-section-container"}>
      <div className={"form-section-header"}>
        <Heading size={500}>{title}</Heading>
      </div>
      {/* <div
        className={"handle"}
        style={{ width: 100, height: 100, backgroundColor: "red" }}
      ></div> */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>{children}</div>
    </div>
  );
};

interface FormRowProps {
  children: JSX.Element | JSX.Element[];
}

const FormRow = ({ children }: FormRowProps) => {
  return <div className={"form-row"}>{children}</div>;
};

interface FormFooterProps {
  children: JSX.Element | JSX.Element[];
}
const FormFooter = ({ children }: FormRowProps) => {
  return <div className={"form-footer"}>{children}</div>;
};

export default EditorForm;
