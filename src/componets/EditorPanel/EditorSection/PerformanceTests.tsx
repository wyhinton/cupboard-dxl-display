import React, { useState, useEffect } from "react";
import Button from "../../Button";
import { useStoreState, useStoreActions } from "../../../hooks";
import {
  perfTest1Cards,
  perfTest2Cards,
  perfTest3Cards,
  perfTest4Cards,
} from "../../../static/performance_test_layouts";

const PerformanceTests = () => {
  const setAvailableCards = useStoreActions(
    (actions) => actions.appData.setActiveCards
  );

  return (
    <>
      <div>TEMP</div>
    </>
  );
};
export default PerformanceTests;

{
  /* <Button
onClick={() => {
  setAvailableCards(perfTest1Cards);
}}
text={"Performance Test 1 - 3D"}
></Button>
<Button
onClick={() => {
  setAvailableCards(perfTest2Cards);
}}
text={"Performance Test 2 - code"}
></Button>
<Button
onClick={() => {
  setAvailableCards(perfTest3Cards);
}}
text={"Performance Test 3 - map"}
></Button>
<Button
onClick={() => {
  setAvailableCards(perfTest4Cards);
}}
text={"Performance Test 4 - d3"}
></Button> */
}
