import { translationsEn } from "@assets/translations/en";
import { type Locale, type TranslationMap, type Translations } from "@/types/translation";

export const DEFAULT_LOCALE: Locale = "en";

const translationRegistry: Record<Locale, TranslationMap> = {
  en: translationsEn.entries
};

/**
 * Retrieves translation entries for the requested locale, falling back to the default locale.
 * @param locale Desired locale code.
 * @returns Translation map for the active locale.
 */
export const getTranslations = (locale: Locale = DEFAULT_LOCALE): Translations => {
  const entries = translationRegistry[locale] ?? translationRegistry[DEFAULT_LOCALE];
  return { locale, entries };
};

/**
 * Creates a translator function to resolve keys with a safe fallback to the key when missing.
 * @param locale Desired locale code.
 * @returns Translator function that maps translation keys to strings.
 */
export const createTranslator = (locale: Locale = DEFAULT_LOCALE): ((key: string) => string) => {
  const { entries } = getTranslations(locale);
  return (key: string): string => entries[key] ?? key;
};
