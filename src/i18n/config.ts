export const locales = ['en', 'ar', 'es', 'fr', 'de', 'pt', 'zh', 'hi', 'ru', 'ja'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  zh: '中文',
  hi: 'हिन्दी',
  ru: 'Русский',
  ja: '日本語',
};

// We define a nested type matching our en.json structure for strong typing of translations
export type Dictionary = {
  nav: Record<string, string>;
  home: Record<string, string>;
  search: Record<string, string>;
  watch: Record<string, string>;
  upload: Record<string, string>;
  channel: Record<string, string>;
  dashboard: Record<string, string>;
};
