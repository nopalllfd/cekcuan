import React, { createContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children, fetchData }) => {
  return <AppContext.Provider value={{ fetchData }}>{children}</AppContext.Provider>;
};
