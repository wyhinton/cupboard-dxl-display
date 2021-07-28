import React, { useState, useEffect } from "react";
import DropDownMenu from "../../Shared/DropDownMenu";
import Button from "../../Shared/Button";
import { useStoreState, useStoreActions } from "../../../hooks";
import { AppMode } from "../../../enums";
import { SelectMenuItem } from "evergreen-ui";

const LayoutManager = () => {
  // const manageViewModeChange = useStoreActions(
  //   (actions) => actions.appModel.manageViewModeChange
  // );
  // const localStorageLayouts = useStoreState(
  //   (state) => state.appModel.localStorageLayouts
  // );
  // const clearLocalLayouts = useStoreActions(
  //   (actions) => actions.appModel.clearLocalLayouts
  // );
  // const saveLayoutLocal = useStoreActions(
  //   (actions) => actions.appModel.saveLayoutLocal
  // );
  return (
    <>
      <DropDownMenu
        onSelect={(item) => {
          console.log(item);
          // console.log(item);
        }}
        items={[{ label: "hello", value: "hello" }]}
        title={"Load Layout"}
      />
      <Button
        onClick={() => {
          // clearLocalLayouts();
        }}
        text={"Clear Local"}
      ></Button>
      <Button
        onClick={() => {
          // saveLayoutLocal();
        }}
        text={"Save Layout"}
      ></Button>
    </>
  );
};

export default LayoutManager;
