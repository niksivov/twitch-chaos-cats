import { ru, ruHowToPlay } from "./ru"
import { en, enHowToPlay } from "./en"

export type Lang = "ru" | "en"

const LANG_STORAGE_KEY = "lang"

const DICTIONARIES: Record<Lang, Record<string, string>> = { ru, en }

const HOW_TO_PLAY_SECTIONS: Record<Lang, { title: string; body: string }[]> = {
  ru: ruHowToPlay,
  en: enHowToPlay,
}

export function detectInitialLang(): Lang {
  const saved = localStorage.getItem(LANG_STORAGE_KEY)
  if (saved === "ru" || saved === "en") return saved

  const preferred =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : null

  if (!preferred) return "ru"

  for (const locale of preferred) {
    const code = (locale || "").split("-")[0].toLowerCase()
    if (code === "ru") return "ru"
    if (code === "en") return "en"
  }

  return "en"
}

export function t(
  lang: Lang,
  key: string,
  params?: Record<string, string | number>
): string {
  const template = DICTIONARIES[lang][key] ?? DICTIONARIES.ru[key] ?? key

  if (!params) return template

  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name]
    return value !== undefined ? String(value) : match
  })
}

export function pickLang(lang: Lang, ruText: string, enText: string): string {
  return lang === "en" ? enText : ruText
}

export function getHowToPlaySections(lang: Lang) {
  return HOW_TO_PLAY_SECTIONS[lang]
}