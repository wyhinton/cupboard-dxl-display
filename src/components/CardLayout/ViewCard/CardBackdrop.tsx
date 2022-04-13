import type { ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";

import type CardData from "../../../data_structs/CardData";
import type WidgetData from "../../../data_structs/WidgetData";
import { useCardEditor } from "../../../hooks";
import type { CardSettings } from "../../../interfaces/CardSettings";

const CardBackdrop = ({
  children,
  card,
  cardSettings,
}: {
  cardSettings?: CardSettings;
  children: ReactNode;
  card: WidgetData | CardData;
}): JSX.Element => {
  const { editingCard } = useCardEditor();
  return (
    <div
      className="card-backdrop"
      style={{
        overflow: "hidden",
        borderRadius: "0.5em",
        width: "100%",
        height: "100%",
        backgroundColor: cardSettings?.backgroundColor ?? "",
        boxShadow: "0 8px 32px 0 rgba(49, 49, 49, 0.37)",
        border:
          card.id === editingCard?.id
            ? "3px solid white"
            : "1px solid rgba(255, 255, 255, 0.294)",
      }}
    >
      {children}
    </div>
  );
};

export default CardBackdrop;
