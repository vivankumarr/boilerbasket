// src/app/admin/appointments/PopupContext.js
"use client";

import { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);

  console.log("showPopup: ", showPopup);

  return (
    <PopupContext.Provider value={{ showPopup, setShowPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);