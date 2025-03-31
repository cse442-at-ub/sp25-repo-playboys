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
  const [csrfToken, setCsrfToken] = useState<string>('');

  return (
    <CSRFContext.Provider value={{ csrfToken, setCsrfToken }}>
      {children}
    </CSRFContext.Provider>
  );
};
