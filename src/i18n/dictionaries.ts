import 'server-only';
import type { Locale, Dictionary } from './config';

const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default),
  ar: () => import('./locales/ar.json').then((module) => module.default),
  es: () => import('./locales/es.json').then((module) => module.default),
  fr: () => import('./locales/fr.json').then((module) => module.default),
  de: () => import('./locales/de.json').then((module) => module.default),
  pt: () => import('./locales/pt.json').then((module) => module.default),
  zh: () => import('./locales/zh.json').then((module) => module.default),
  hi: () => import('./locales/hi.json').then((module) => module.default),
  ru: () => import('./locales/ru.json').then((module) => module.default),
  ja: () => import('./locales/ja.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Check if dictionary exists for locale, otherwise fallback to english safely
  if (dictionaries[locale]) {
    return (await dictionaries[locale]()) as Dictionary;
  }
  return (await dictionaries['en']()) as Dictionary;
};
