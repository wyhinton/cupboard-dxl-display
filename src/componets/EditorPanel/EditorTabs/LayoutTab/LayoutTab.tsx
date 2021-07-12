import React, { useState, useEffect, FC } from "react";
import LayoutTable from "./LayoutTable";
import formEmbedUrl from "../../../../static/formEmbedUrl";
import Collapsible from "react-collapsible";

const LayoutTab: FC = () => {
  return (
    <>
      <Collapsible trigger="Save Layout">
        <iframe
          src={formEmbedUrl}
          width={"100%"}
          frameBorder={0}
          marginHeight={0}
          marginWidth={0}
          style={{ height: "60em" }}
        >
          Loading…
        </iframe>
      </Collapsible>

      <LayoutTable />
    </>
  );
};

export default LayoutTab;
