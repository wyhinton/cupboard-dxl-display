import { Component } from "evergreen-ui/node_modules/@types/react";
import React, { useState, useEffect } from "react";
import ViewCard from "./Card";
import IFrameView from "./IFrameView";
import "../css/test_reverse.css";
import type { HtmlPortalNode } from "react-reverse-portal";
import {
  createHtmlPortalNode,
  createSvgPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
// const Container = () => {
//   //   const defaultNode = React.useMemo(() => createHtmlPortalNode(), []);
//   const [parent, setParent] = useState("none");
//   const [input, setInput] =
//     // useState<HtmlPortalNode<Component<any>>>(defaultNode);
//     useState<undefined | HtmlPortalNode<Component<any>>>(undefined);
//   //   const []

//   const containerStyle = {
//     position: "absolute",
//     // width: 500,
//     width: "100vw",
//     height: "100vh",
//     backgroundColor: "yellow",
//     left: 0,
//     top: 0,
//   } as React.CSSProperties;

//   const portalContainer = {
//     position: "absolute",
//     width: 500,
//     height: "80vh",
//     right: 0,
//     top: 0,
//     backgroundColor: "red",
//     display: parent === "none" ? "none" : "block",
//     zIndex: 1000,
//   } as React.CSSProperties;
//   const providedOutput = React.useMemo(() => createHtmlPortalNode(), []);
//   return (
//     <div style={containerStyle}>
//       <Button
//         onClick={() => {
//           if (parent === "component-a") {
//             setParent("component-b");
//           } else if (parent === "none") {
//             setParent("component-a");
//           } else {
//             setParent("component-a");
//           }
//         }}
//         text={"switch"}
//       />
//       <div> hello</div>
//       {Array.from(Array(5).keys()).map((item, i) => {
//         return (
//           <MyInput
//             name={`item ${i}`}
//             key={i}
//             onSelect={(port) => setInput(port)}
//             outputNode={undefined}
//           />
//         );
//       })}
//       <div style={portalContainer}>
//         {/* <TestReverse name={"test"} componentToShow={parent} input={input} /> */}
//       </div>
//     </div>
//   );
// };

const MyComponent = ({ componentToShow }: { componentToShow: string }) => {
  // Create a portal node: this holds your rendered content
  const portalNode = React.useMemo(() => createHtmlPortalNode(), []);

  return (
    <div>
      {/*
            Render the content that you want to move around later.
            InPortals render as normal, but send the output to detached DOM.
            MyExpensiveComponent will be rendered immediately, but until
            portalNode is used in an OutPortal, MyExpensiveComponent, it
            will not appear anywhere on the page.
        */}
      <InPortal node={portalNode}>
        <ViewCard
          data={{
            src: "https://observablehq.com/embed/@d3/zoomable-circle-packing?cells=chart",
            title: "test",
          }}
          key={"test key"}
        >
          <IFrameView
            src={
              "https://observablehq.com/embed/@d3/zoomable-circle-packing?cells=chart"
            }
          />
        </ViewCard>
      </InPortal>

      {/* ... The rest of your UI ... */}

      {/* Later, pass the portal node around to whoever might want to use it: */}
      {componentToShow === "component-a" ? (
        <ComponentA portal={portalNode} />
      ) : (
        <ComponentB portal={portalNode} />
      )}
    </div>
  );
};

// Later still, pull content from the portal node and show it somewhere:

const ComponentA = ({ portal }: { portal: HtmlPortalNode<Component<any>> }) => {
  return (
    <div>
      {/* ... Some more UI ... */}

      {/* Show the content of the portal node here: */}
      <OutPortal node={portal} />
    </div>
  );
};

const ComponentB = ({ portal }: { portal: HtmlPortalNode<Component<any>> }) => {
  return (
    <div>
      {/* ... Some more UI ... */}

      <OutPortal
        node={portal}
        myProp={"newValue"} // Optionally, override default values
        myOtherProp={123} // Or add new props

        // These props go back to the content of the InPortal, and trigger a
        // component render (but on the same component instance) as if they
        // had been passed to MyExpensiveComponent directly.
      />
    </div>
  );
};

export default MyComponent;

// const TestReverse = ({
//   name,
//   componentToShow,
//   input,
// }: {
//   name: string;
//   componentToShow: string;
//   //   input: HtmlPortalNode<Component<any>>;
//   input?: HtmlPortalNode<Component<any>>;
// }) => {
//   // Create a portal node: this holds your rendered content
//   const testStyle = {
//     position: "absolute",
//     width: 100,
//     height: 100,
//     backgroundColor: "red",
//     top: 0,
//     left: 0,
//   } as React.CSSProperties;

//   useEffect(() => {
//     console.log("got new input portal");
//     console.log(input);
//   }, [input]);

//   //   const portalNode = React.useMemo(() => createHtmlPortalNode(), []);
//   return (
//     <div style={testStyle}>
//       hello
//       {input ? <OutPortal node={input}></OutPortal> : <div>got nothing</div>}
//     </div>
//   );
// };

// // Later still, pull content from the portal node and show it somewhere:

// const MyInput = ({
//   onSelect,
//   name,
//   outputNode,
// }: {
//   onSelect: (item: HtmlPortalNode<Component<any>>) => void;
//   name: string;
//   outputNode?: HtmlPortalNode<Component<any>>;
// }) => {
//   const portalNode = createHtmlPortalNode();
//   const [output, setOutput] = useState(portalNode);
//   useEffect(() => {
//     if (outputNode) {
//       setOutput(outputNode);
//     }
//   }, [outputNode]);
//   const fillInDiv = {
//     width: "100%",
//     height: 100,
//     backgroundColor: "yellow",
//     border: "1px solid black",
//   };
//   return (
//     <div style={fillInDiv}>
//       <InPortal node={portalNode}>
//         <div
//           style={fillInDiv}
//           onMouseUp={() => {
//             // onSelect(portalNode);
//             console.log(`clicked div ${name}`);
//             console.log(portalNode);
//           }}
//         >
//           {name}
//         </div>
//       </InPortal>
//       <div>
//         <OutPortal node={output}></OutPortal>
//       </div>
//     </div>
//   );
// };

// const ComponentA = ({
//   portalNode,
// }: {
//   portalNode: HtmlPortalNode<Component<any>>;
// }) => {
//   const aStyle = {
//     position: "absolute",
//     width: 500,
//     height: 500,
//     backgroundColor: "black",
//     left: 0,
//     bottom: 0,
//   } as React.CSSProperties;
//   return (
//     <div style={aStyle}>
//       <OutPortal node={portalNode} />
//     </div>
//   );
// };

// const ComponentB = ({
//   portalNode,
//   mode,
// }: {
//   portalNode: HtmlPortalNode<Component<any>>;
//   mode: CardView;
// }) => {
//   const previewHolderClass = classNames("preview", {
//     "preview-visible": mode === CardView.PREVIEW,
//     "preview-hidden": mode === CardView.NORMAL,
//   });
//   const [activeClass, setActiveClass] = useState("preview preview-hidden");
//   useEffect(() => {
//     setTimeout(() => {
//       console.log("setting class");
//       setActiveClass(previewHolderClass);
//     });
//   });
//   return (
//     <div className={activeClass}>
//       <OutPortal
//         node={portalNode}
//         myProp={"newValue"} // Optionally, override default values
//         myOtherProp={123} // Or add new props

//         // These props go back to the content of the InPortal, and trigger a
//         // component render (but on the same component instance) as if they
//         // had been passed to MyExpensiveComponent directly.
//       />
//     </div>
//   );
// };

// export default Container;
// // export default TestReverse;

// //   <div
// //     style={fillInDiv}
// //     key={i}
// //     onMouseUp={() => {
// //       console.log(`clicked div with key ${i}`);
// //     }}
// //   >
// //     <ViewCard
// //       data={{
// //         src: "https://observablehq.com/embed/@d3/zoomable-circle-packing?cells=chart",
// //         title: "test",
// //       }}
// //       key={"test key"}
// //     >
// //       <IFrameView
// //         src={
// //           "https://observablehq.com/embed/@d3/zoomable-circle-packing?cells=chart"
// //         }
// //       />
// //     </ViewCard>
// //   </div>
