import { createContext } from "react"
import type { Language, Translations } from "./translations"

export type LanguageContextValue = {
    lang: Language
    setLang: (lang: Language) => void
    t: Translations
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
