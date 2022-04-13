import { Heading, Spinner, WarningSignIcon } from "evergreen-ui";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";

import Timer from "./components/Shared/Timer";
import { useApp, useSheets } from "./hooks";
import appConfig from "./static/appConfig";

interface LoadingScreenProperties {
  setVisible: (v: boolean) => void;
  sheetsAreLoaded: boolean;
}

const LoadingScreenContext = React.createContext<LoadingScreenProperties>({
  setVisible: (v: boolean) => {},
  sheetsAreLoaded: false,
});

const LoadingScreen = (): JSX.Element => {
  const { sheetsAreLoaded } = useApp();
  const { urlQueryLink, fetchTopLevelSheet } = useSheets();

  console.log(sheetsAreLoaded);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (sheetsAreLoaded) {
      setVisible(false);
    }
  }, [sheetsAreLoaded]);

  const variants = {
    in: {
      opacity: [0, 1],
      y: ["-30%", "-50%"],
    },
    out: {
      y: "-60%",
      opacity: 0,
    },
  };

  return (
    <LoadingScreenContext.Provider
      value={{
        setVisible,
        sheetsAreLoaded,
      }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            animate="in"
            exit="out"
            // initial={"in"}
            style={{
              width: "40%",
              height: "50%",
              minHeight: "fit-content",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              position: "absolute",
              justifyContent: "center",
              zIndex: 100,
              left: "50%",
              x: "-50%",
              top: "50%",
              borderRadius: "10px",
              backdropFilter: "blur(10px)", 
              border: " 1px solid rgba(255, 255, 255, 0.294)",
              boxShadow: "0 8px 32px 0 rgba(49, 49, 49, 0.37)",
              padding: "1em",
              opacity: 0,
            }}
            variants={variants}
          >
            {!sheetsAreLoaded && urlQueryLink && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Heading size={900}>Loading Content from Google Sheets</Heading>
                <Spinner size={100} />
              </div>
            )}

            {!urlQueryLink && <NoUrlError />}
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingScreenContext.Provider>
  );
};

export default LoadingScreen;

const NoUrlError = (): JSX.Element => {
  const { setVisible } = useContext(LoadingScreenContext);
  const { fetchTopLevelSheet } = useSheets();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <WarningSignIcon size={100} />
      </div>
      <Heading size={900}>{}</Heading>
      <Heading size={900}>
        No Google Sheet Provided via URL! <br></br>
        <br></br>Switching to backup sheet in {`${appConfig.noUrlTimeout}`}s.
        <Timer
          onEnd={() => {
            setVisible(false);
            fetchTopLevelSheet(appConfig.backupParentSheetUrl);
          }}
          seconds={appConfig.noUrlTimeout}
        />
        Visit{" "}
        <a
          href="https://github.com/NCSU-Libraries/cupboard-dxl-display/wiki"
          rel="noreferrer"
          target="_blank"
        >
          Cupboard Wiki
        </a>{" "}
        for more information on setting up your Google Sheets for Cupboard.
      </Heading>
    </>
  );
};
