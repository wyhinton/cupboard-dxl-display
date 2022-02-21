import React from "react";
import "../../css/pulsar.css";
import { AddIcon } from "evergreen-ui";
interface PulsarProperties {}

const Pulsar = () => {
  return (
    <div className="pulsar">
      <AddIcon size={150}></AddIcon>
      {/* <div className={"ring"}></div> */}
      {/* <div className={"ring"}></div>
      <div className={"ring"}></div>
      <div className={"ring"}></div>
      <div className={"ring"}></div> */}
    </div>
  );
};

export default Pulsar;
