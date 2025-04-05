// CSRFContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CSRFContextProps {
  csrfToken: string;
  setCsrfToken: (token: string) => void;
}

const CSRFContext = createContext<CSRFContextProps | undefined>(undefined);

export const useCSRFToken = () => {
  const context = useContext(CSRFContext);
  if (!context) {
    throw new Error("useCSRFToken must be used within a CSRFProvider");
  }
  return context;
};

export const CSRFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [csrfToken, setCsrfTokenState] = useState<string>(() => {
    return localStorage.getItem("csrfToken") || "";
  });

  const setCsrfToken = (token: string) => {
    setCsrfTokenState(token);
    localStorage.setItem("csrfToken", token); // Store token persistently
  };

  return (
    <CSRFContext.Provider value={{ csrfToken, setCsrfToken }}>
      {children}
    </CSRFContext.Provider>
  );
};

