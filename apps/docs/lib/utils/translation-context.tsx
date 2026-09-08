/* @proprietary license */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n/config';
import { languages } from '@/lib/i18n/config';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@lomi./shared';
import { LocalStorageKeys } from '@lomi./shared';

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: 'fr',
  setLanguage: () => {},
});

// Main provider component
export function TranslationProvider({
  children,
  /** Server-read cookie value so the first client paint matches the server. */
  initialLanguage = 'fr',
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  // Match server-rendered locale when possible to avoid a flash
  const [currentLanguage, setCurrentLanguage] =
    useState<Language>(initialLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (!('window' in globalThis) || globalThis.window === undefined) return;

    // After mount, read the actual language preference
    // Try cookie first (set by setLanguage), then localStorage
    let preferredLang: Language = initialLanguage;

    // Check cookie
    const cookieMatch = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${LocalStorageKeys.Language}=`));
    if (cookieMatch) {
      const cookieLang = cookieMatch.split('=')[1];
      if (languages.some((lang) => lang.code === cookieLang)) {
        // SAFETY: Boundary value matches the asserted domain type at this call site.
        preferredLang = cookieLang as Language;
      }
    }

    // Check localStorage (takes precedence)
    const savedLanguage = getLocalStorageItem(LocalStorageKeys.Language);
    if (
      savedLanguage &&
      languages.some((lang) => lang.code === savedLanguage)
    ) {
      // SAFETY: Boundary value matches the asserted domain type at this call site.
      preferredLang = savedLanguage as Language;
    }

    // Update language if different from default
    if (preferredLang !== currentLanguage) {
      setCurrentLanguage(preferredLang);
    }

    // Ensure cookie is synced
    document.cookie = `${LocalStorageKeys.Language}=${preferredLang}; path=/; max-age=31536000; SameSite=Lax`;

    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove currentLanguage dependency to prevent re-runs during SSR

  useEffect(() => {
    // Sync cookie whenever language changes (after initialization)
    // Only run on client side
    if (!('window' in globalThis) || globalThis.window === undefined) return;

    document.documentElement.lang = currentLanguage === 'fr' ? 'fr' : 'en';

    if (isInitialized && currentLanguage) {
      document.cookie = `${LocalStorageKeys.Language}=${currentLanguage}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [currentLanguage, isInitialized]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    setLocalStorageItem(LocalStorageKeys.Language, lang);

    // Set cookie for server-side access (only on client side)
    if ('window' in globalThis && globalThis.window !== undefined) {
      document.cookie = `${LocalStorageKeys.Language}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook component
export function useTranslation() {
  const context = useContext(TranslationContext);

  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  return context;
}
