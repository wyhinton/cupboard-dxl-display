// import { BrowserWindow } from 'electron/main';
import React, { useState } from "react";
// import {BrowserView, BrowserWindow} from 'electron/main';

const ViewCard = ({ src, key }: { src: string; key: string }) => {
  //   const win = new BrowserWindow({ width: 800, height: 600 });

  //   const view = new BrowserView();
  //   win.setBrowserView(view);
  //   view.setBounds({ x: 0, y: 0, width: 300, height: 300 });
  //   view.webContents.loadURL('https://electronjs.org');

  return (
    <div>
      {/* <iframe src={"http://www.youtube.com/embed/xDMP3i36naA"}></iframe> */}
    </div>
  );
};

export default ViewCard;
