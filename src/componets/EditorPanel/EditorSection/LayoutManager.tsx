import React, { useState, useEffect } from "react";
import DropDownMenu from "../../Util/DropDownMenu";
import Button from "../../Util/Button";
import { useStoreState, useStoreActions } from "../../../hooks";
import { AppMode } from "../../../enums";
import { SelectMenuItem } from "evergreen-ui";

const LayoutManager = () => {
  const manageViewModeChange = useStoreActions(
    (actions) => actions.appModel.manageViewModeChange
  );
  const localStorageLayouts = useStoreState(
    (state) => state.appModel.localStorageLayouts
  );
  const clearLocalLayouts = useStoreActions(
    (actions) => actions.appModel.clearLocalLayouts
  );
  const saveLayoutLocal = useStoreActions(
    (actions) => actions.appModel.saveLayoutLocal
  );
  return (
    <>
      {/* <DropDownMenu
    onSelect={(item) => {
      manageViewModeChange(
        AppMode[item.label as unknown as keyof typeof AppMode]
      );
      console.log(item);
    }}
    items={Object.keys(AppMode).map(
      (k) => ({ label: k, value: k } as SelectMenuItem)
    )}
    title={"View Mode"}
  /> */}

      <DropDownMenu
        onSelect={(item) => {
          console.log(item);

          // console.log(item);
        }}
        items={localStorageLayouts.map((l) => ({
          label: l.name,
          value: l.layout,
        }))}
        title={"Load Layout"}
      />
      <Button
        onClick={() => {
          clearLocalLayouts();
        }}
        text={"Clear Local"}
      ></Button>
      <Button
        onClick={() => {
          saveLayoutLocal();
        }}
        text={"Save Layout"}
      ></Button>
    </>
  );
};

export default LayoutManager;
