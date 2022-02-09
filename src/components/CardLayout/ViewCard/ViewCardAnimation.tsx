// import "../../../css/viewCard.css";

// import classNames from "classnames";
// import type { Action, Computed, Thunk } from "easy-peasy";
// import { action, computed, thunk, useLocalStore } from "easy-peasy";
// import { InlineAlert } from "evergreen-ui";
// import React, {
//   FC,
//   MouseEventHandler,
//   PropsWithChildren,
//   ReactNode,
//   RefObject,
//   SyntheticEvent,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { Layouts } from "react-grid-layout";
// import QRCode from "react-qr-code";

// import CardData from "../../../data_structs/CardData";
// import WidgetData from "../../../data_structs/WidgetData";
// import { AppMode, CardView, DndTypes } from "../../../enums";
// import {
//   useApp,
//   useKeyboardShortcut,
//   useLayout,
//   useOnClickOutside,
//   useStoreActions,
// } from "../../../hooks";
// import appConfig from "../../../static/appConfig";
// import Button from "../../Shared/Button";
// import CardInfo from "./CardInfo";
// import DeleteButton from "./DeleteButton";
// import SettingsButton from "./SettingsButton";
// import SettingsMenu from "./SettingsMenu";
// import { AnimatePresence, motion } from "framer-motion";
// import { randomNumber } from "../../../utils";

// const ViewCardAnimation = ({
//   children,
// }: {
//   children: JSX.Element | JSX.Element[];
// }): JSX.Element => {

//     useEffect(() => {
//         console.log(children);
//         if (children) {
//           if (useAnimation) {
//             setAnimationVariant("out");
//             setTimeout(() => {
//               setAnimationVariant("in");
//               setActiveChildren(
//                 children(state.scale, state.cardView, onError, onLoad)
//               );
//             }, 1000);
//           } else {
//             setAnimationVariant("none");
//             setActiveChildren(
//               children(state.scale, state.cardView, onError, onLoad)
//             );
//           }
//         }
//       }, [children]);

//   const [animationVariant, setAnimationVariant] = useState("none");

//   const cardContainerReference = useRef<HTMLDivElement>(null);

//   const jj = useMemo(() => {
//     if (cardContainerReference.current) {
//       const rect = cardContainerReference.current.getBoundingClientRect();
//       console.log(calculateTransform2(rect));
//       return calculateTransform2(rect);
//     }
//     // setVx(calculateTransform2(rect));
//   }, [state.cardView]);

//   const variants = {
//     active: {
//       opacity: 1,
//       transition: {
//         delay: randomNumber(0.4, 0.5),
//         duration: 0.5,
//       },
//     },
//     preview: {
//       opacity: 1,
//       x: jj ? jj[0] : 0,
//       y: jj ? jj[1] : 0,
//       // zIndex: 1000,
//     },
//     normal: {
//       opacity: 1,
//     },
//     none: {
//       opacity: 1,
//       x: 9,
//       y: 0,
//     },
//     error: {
//       // border: "1px solid red",
//       opacity: [1, 0],
//       backgroundColor: "red",
//       // transition:
//     },
//     loaded: {
//       // border: "1px solid red",
//       outline: [`0px solid green`, `4px solid green`, `0px solid green`],
//       opacity: [0, 1, 1],
//       transition: {
//         delay: randomNumber(0.4, 0.5),
//         duration: 0.5,
//       },
//       // backgroundColor: "green",
//       // transition:
//     },
//     in: {
//       opacity: 1,
//       transition: {
//         // delay: randomNumber(0.4, 0.5),
//         duration: 0.5,
//       },
//       // backgroundColor: "green",
//       // transition:
//     },
//     out: {
//       y: randomNumber(-50, 50),
//       opacity: 0,
//       transition: {
//         // delay: randomNumber(0.4, 0.5),
//         duration: 0.5,
//       },
//       // backgroundColor: "green",
//       // transition:
//     },
//   };

//   return (
//     <motion.div
//       exit={{ opacity: 0, x: -300 }}
//       ref={cardContainerReference}
//       layoutId="viewcard"
//       // className={state.cardClass}
//       style={{
//         transformOrigin: "center",
//         willChange: "transform",
//         height: "100%",
//         // transform: state.transform,
//         //   backgroundColor: state.cardBackgroundColor,
//         // opacity: 1,
//         opacity: 1,
//         // opacity: 1,
//       }}
//       // initial={a}
//       variants={variants}
//       // initial={true}
//       // intial={"loaded"}
//       animate={animationVariant}
//       // animate={
//       //   isError && state.cardView === CardView.GRID
//       //     ? "error"
//       //     : isLoaded && state.cardView === CardView.GRID
//       //     ? "loaded"
//       //     : state.cardView === CardView.PREVIEW
//       //     ? "preview"
//       //     : appMode == AppMode.DISPLAY
//       //     ? "active"
//       //     : "normal"
//       // }
//     ></motion.div>
//   );
// };

// const calculateTransform2 = (boundingBox: DOMRect): [number, number] => {
//   const windowWidth = window.innerWidth;
//   const windowHeight = window.innerHeight;
//   const vw = window.innerWidth / 100;
//   const vh = window.innerWidth / 100;
//   const futureWidth = vw * 60;
//   const futureHeight = vh * 40;

//   const centeredX = windowWidth / 2 - futureWidth / 2;
//   const centeredY = windowHeight / 2 - futureHeight / 2;

//   const currentX = boundingBox.x;
//   const currentY = boundingBox.y;
//   let differenceX = centeredX - currentX;
//   let differenceY = centeredY - currentY;

//   if (centeredX < currentX) {
//     differenceX = currentX - centeredX;
//     differenceX *= -1;
//   }
//   if (centeredY < currentY) {
//     differenceY = currentY - centeredY;
//     differenceY *= -1;
//   }
//   return [differenceX, differenceY];
//   // return `translate(${differenceX}px, ${differenceY}px)`;
// };

// export default ViewCardAnimation;
export default null;
