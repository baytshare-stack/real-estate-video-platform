import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, type Locale, locales } from "./config";
import { getDictionary } from "./dictionaries";

export async function getServerTranslation() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale;
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;
  const dict = await getDictionary(locale);

  const t = (namespace: keyof typeof dict, key: string): string => {
    try {
      const section = dict[namespace] as Record<string, string>;
      if (section && key in section) {
        return section[key];
      }
      return key;
    } catch {
      return key;
    }
  };

  return { locale, dict, t };
}
