import React, { createContext, useEffect, useState } from "react";

export const ValidationContext = createContext("");

const LETTERS_NUMBERS = "abcdefghijklmnopqrstuvwxyzčćžšđABCDEFGHIJKLMNOPQRSTUVWXYZČĆŽŠĐ0123456789";

export const ValidationProvider = ({ children }) => {
  const [allowedSigns, setAllowedSigns] = useState("");

  useEffect(() => {
    const storedSpecials = sessionStorage.getItem("allowedSigns") || "";
    const fullSet = LETTERS_NUMBERS + storedSpecials;
    setAllowedSigns(fullSet);
  }, []);

  useEffect(() => {
    const updateOnChange = () => {
      const storedSpecials = sessionStorage.getItem("allowedSigns") || "";
      const fullSet = LETTERS_NUMBERS + storedSpecials;
      setAllowedSigns(fullSet);
    };

    window.addEventListener("allowedSignsUpdated", updateOnChange);
    return () => window.removeEventListener("allowedSignsUpdated", updateOnChange);
  }, []);

  return (
    <ValidationContext.Provider value={allowedSigns}>
      {children}
    </ValidationContext.Provider>
  );
};

