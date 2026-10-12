import en from './en';
import zh from './zh';
import type { Language } from '../config';
import { STORAGE_KEYS } from '../config';

const DICTS = { en, zh } as const;

export function getDictionary(lang: Language) {
  return DICTS[lang];
}

/** Read the persisted language. Defaults to 'en'. */
export function readStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const v = window.localStorage.getItem(STORAGE_KEYS.lang);
  return v === 'zh' ? 'zh' : 'en';
}

export function persistLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.lang, lang);
  } catch {
    // ignore
  }
}
