import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../config';
import { getDictionary, persistLanguage, readStoredLanguage } from '../i18n';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
  t: (path: string, ...args: unknown[]) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => readStoredLanguage());

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    persistLanguage(next);
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Language = prev === 'en' ? 'zh' : 'en';
      persistLanguage(next);
      return next;
    });
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = getDictionary(lang);
    // Tiny dotted-path lookup with function interpolation. Used as
    //   t('app.home')           -> "Home"
    //   t('subject.gamesFor', x) -> `${x} Games`
    const t = (path: string, ...args: unknown[]): string => {
      const parts = path.split('.');
      let cur: unknown = dict;
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
          cur = (cur as Record<string, unknown>)[p];
        } else {
          return path;
        }
      }
      if (typeof cur === 'function') {
        return (cur as (...a: unknown[]) => string)(...args);
      }
      if (typeof cur === 'string') return cur;
      return path;
    };
    return { lang, setLang, toggle, t };
  }, [lang, setLang, toggle]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
