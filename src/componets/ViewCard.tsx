// import { BrowserWindow } from 'electron/main';
import React, { useState } from "react";
// import {BrowserView, BrowserWindow} from 'electron/main';

const ViewCard = ({ src, key }: { src: string; key: string }) => {
  return (
    <div>
      <iframe
        src={
          "https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik"
        }
      ></iframe>
    </div>
  );
};

export default ViewCard;
