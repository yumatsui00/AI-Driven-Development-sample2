export type Locale = "en";

export type TranslationMap = Record<string, string>;

export interface Translations {
  locale: Locale;
  entries: TranslationMap;
}
