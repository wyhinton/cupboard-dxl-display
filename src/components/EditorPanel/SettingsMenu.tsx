import "../../css/card/settingsMenu.css";

import type { ActionCreator } from "easy-peasy";
import {
  Button as EvergreenButton,
  ChevronLeftIcon,
  ChevronRightIcon,
  Heading,
  IconButton,
  SelectMenu,
} from "evergreen-ui";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Select from "react-select";

import type CardData from "../../data_structs/CardData";
import { useCardEditor, useLayout } from "../../hooks";
import Button from "../Shared/Button";
import FlexColumn from "../Shared/FlexColumn";
import FlexRow from "../Shared/FlexRow";
import TabPane from "./EditorTabs/TabPane";

const SettingsMenu = ({ card }: { card: CardData }): JSX.Element => {
  const {
    setCardScale,
    setCardBackgroundColor,
    cardBackgroundColor,
    clearEditingCard,
    setCardContentFit,
    cardContentFit,
  } = useCardEditor();
  const { activeLayout } = useLayout();

  const [currentCardSettings, setCurrentCardSettings] = useState(
    activeLayout?.getCardSettings(card.id)
  );
  const [cardSettingsToGet, setcardSettingsToGet] = useState(
    activeLayout?.getCardSettings(card.id)
  );

  useEffect(() => {
    setcardSettingsToGet(activeLayout?.getCardSettings(card.id));
    console.log(cardSettingsToGet);
  }, [card.id]);

  return (
    <motion.div
      style={{
        // height: "100%",
        top: "6%",
        height: "95%",
        width: "inherit",
        // height: "inherit",
        pointerEvents: "all",
        position: "absolute",
        zIndex: 1000,
        // top: 0,
        backgroundColor: "#2d2d2d",
        boxSizing: "border-box",
      }}
    >
      <TabPane style={{ width: "auto" }}>
        <FlexColumn>
          <InputRow title="Background Color:">
            <input
              className="nodrag"
              defaultValue="rbga(0,0,0,0)"
              onChange={(e) => {
                setCardBackgroundColor({
                  cardId: card.id,
                  color: e.target.value,
                });
              }}
              type="color"
              value={cardBackgroundColor}
            />
          </InputRow>
          <InputRow title="Scale: ">
            <ScaleControls
              scale={currentCardSettings?.scale ?? 0}
              setScale={(scale) => {
                setCardScale({ cardId: card.id, scale });
              }}
            />
          </InputRow>
          <InputRow title="Object Fit: ">
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={cardContentFit}
              onChange={(selected: any) => {
                console.log(selected);
                setCardContentFit({
                  cardId: card.id,
                  contentFit: selected.value,
                });
              }}
              style={{ option: { color: "black" } }}
              //@ts-ignore
              options={["contain", "fill", "cover", "scale-down", "none"].map(
                (l) => {
                  return { value: l, label: l };
                }
              )}
            />
          </InputRow>
          <FlexRow style={{ padding: "2vmin" }}></FlexRow>
          <Button
            width={"100%"}
            height={60}
            text="Exit Card Editor"
            onClick={(e) => {
              clearEditingCard();
            }}
          />
        </FlexColumn>
      </TabPane>
    </motion.div>
  );
};

const InputRow = ({
  title,
  children,
}: {
  title: string;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  return (
    <Heading
      className="menu-input-row"
      size={800}
      style={{
        display: "flex",
        color: "white",
        padding: ".25em",
        alignItems: "center",
      }}
    >
      {title}
      {children}
    </Heading>
  );
};

const ScaleControls = ({
  setScale,
  scale,
}: {
  setScale: (scale: number) => void;
  scale: number;
}): JSX.Element => {
  const [localScale, setLocalScale] = useState(scale);

  useEffect(() => {
    setScale(localScale);
  }, [localScale]);

  return (
    <FlexRow>
      <IconButton
        icon={<ChevronLeftIcon size={30} />}
        onClick={() => {
          setLocalScale(localScale - 0.1);
        }}
        style={{ width: "30%", height: "100%" }}
      />
      <input
        defaultValue={0.5}
        onChange={(e) => {
          // setLocalScale(localScale);
          // setScale(local);
        }}
        style={{ width: 30 }}
        type="text"
        value={scale.toString().slice(0, 3)}
      />
      <IconButton
        icon={<ChevronRightIcon size={30} />}
        onClick={() => {
          setLocalScale(localScale + 0.1);
        }}
        style={{ width: "30%", height: "100%" }}
      />
    </FlexRow>
  );
};

export default SettingsMenu;
