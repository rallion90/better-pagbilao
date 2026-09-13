import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { translations, type Language } from "./translations"
import { LanguageContext, type LanguageContextValue } from "./context"

const STORAGE_KEY = "bp_language"

function readStoredLanguage(): Language {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        return stored === "tl" ? "tl" : "en"
    } catch {
        return "en"
    }
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLangState] = useState<Language>(readStoredLanguage)

    useEffect(() => {
        document.documentElement.lang = lang
        try {
            window.localStorage.setItem(STORAGE_KEY, lang)
        } catch {
            // ignore storage errors, language still applies for this session
        }
    }, [lang])

    const setLang = (nextLang: Language) => setLangState(nextLang)

    const value = useMemo<LanguageContextValue>(
        () => ({ lang, setLang, t: translations[lang] }),
        [lang]
    )

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
