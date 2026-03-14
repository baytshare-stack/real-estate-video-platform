"use client";

import React, { createContext, useContext } from 'react';
import type { Dictionary, Locale } from './config';

type LanguageContextType = {
  locale: Locale;
  dict: Dictionary;
  t: (namespace: keyof Dictionary, key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode;
  locale: Locale;
  dictionary: Dictionary;
}) => {
  // A helper function to safely extract translated strings
  const translate = (namespace: keyof Dictionary, key: string): string => {
    try {
       const section = dictionary[namespace];
       if (section && key in section) {
         return section[key]; // Returns the translated string
       }
       return key; // Fallback to raw key if missing
    } catch {
       return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, dict: dictionary, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
