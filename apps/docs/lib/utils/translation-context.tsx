/* @proprietary license */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n/config';
import { languages } from '@/lib/i18n/config';
import { getLocalStorageItem, setLocalStorageItem } from '@lomi./shared';
import { LocalStorageKeys } from '@lomi./shared';

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: 'fr',
  setLanguage: () => {},
});

function isLanguage(value: string | null | undefined): value is Language {
  return languages.some((lang) => lang.code === value);
}

function readLanguageCookie(): Language | null {
  if (!('document' in globalThis)) return null;
  const cookieMatch = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LocalStorageKeys.Language}=`));
  if (!cookieMatch) return null;
  const cookieLang = cookieMatch.slice(`${LocalStorageKeys.Language}=`.length);
  return isLanguage(cookieLang) ? cookieLang : null;
}

function writeLanguageCookie(lang: Language): void {
  if (!('document' in globalThis)) return;
  if (readLanguageCookie() === lang) return;
  document.cookie = `${LocalStorageKeys.Language}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}

export function TranslationProvider({
  children,
  /** Server-read cookie value so the first client paint matches the server. */
  initialLanguage = 'fr',
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [currentLanguage, setCurrentLanguage] =
    useState<Language>(initialLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!('window' in globalThis) || globalThis.window === undefined) return;

    let preferredLang: Language = initialLanguage;
    const cookieLang = readLanguageCookie();
    if (cookieLang) preferredLang = cookieLang;

    const savedLanguage = getLocalStorageItem(LocalStorageKeys.Language);
    if (isLanguage(savedLanguage)) {
      preferredLang = savedLanguage;
    }

    if (preferredLang !== currentLanguage) {
      setCurrentLanguage(preferredLang);
    }

    writeLanguageCookie(preferredLang);
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!('window' in globalThis) || globalThis.window === undefined) return;

    document.documentElement.lang = currentLanguage === 'fr' ? 'fr' : 'en';

    if (isInitialized && currentLanguage) {
      writeLanguageCookie(currentLanguage);
    }
  }, [currentLanguage, isInitialized]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    setLocalStorageItem(LocalStorageKeys.Language, lang);
    writeLanguageCookie(lang);
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  return context;
}
