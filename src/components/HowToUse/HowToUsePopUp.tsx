import "../../css/howToUse.css";

import { Heading, Text } from "evergreen-ui";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import Modal from "../Shared/Modal";
import Panel from "../Shared/Panel";

const HowToUsePopUp = ({
  active,
  onClose,
}: {
  active: boolean;
  onClose: () => void;
}): JSX.Element => {
  const variants = {
    hidden: {
      y: 100,
      opacity: 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    console.log(active);
  }, [active]);
  return ReactDOM.createPortal(
    <Modal
      active={active}
      // containerClassName="how-to-use-popup"
      onClose={onClose}
      backdropOpacity={0}
    >
      <motion.div
        variants={variants}
        style={{
          width: "30vw",
          height: "80vh",
          backgroundColor: "white",
          borderRadius: 10,
          padding: "1em",
        }}
        animate={active ? "visible" : "hidden"}
      >
        <Panel>
          <Heading>Connect Labtop</Heading>
          <hr></hr>
          <Text>Connect your labtop to use this screen as a display.</Text>
          <img
            className="how-to-image"
            src={process.env.PUBLIC_URL + "/labtopdiagram.png"}
          />
          <Heading>Explore Content</Heading>
          <hr></hr>
          <Text>Click on a card to explore data related content.</Text>
          <img
            className="how-to-image"
            src={process.env.PUBLIC_URL + "/masonary.png"}
          />
        </Panel>
      </motion.div>
    </Modal>,
    document.getElementById("popup-container") as HTMLDivElement
  );
};

export default HowToUsePopUp;
