import { useEffect } from "react"

const SITE_URL = "https://betterpagbilao.org"

type SeoOptions = {
  title: string
  description: string
  path: string
  jsonLd?: Record<string, unknown>
}

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

export function useSeo({ title, description, path, jsonLd }: SeoOptions) {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : undefined

  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    setMetaTag("name", "description", description)
    setMetaTag("property", "og:title", title)
    setMetaTag("property", "og:description", description)
    setMetaTag("property", "og:url", `${SITE_URL}${path}`)
    setMetaTag("name", "twitter:title", title)
    setMetaTag("name", "twitter:description", description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.setAttribute("rel", "canonical")
      document.head.appendChild(canonical)
    }
    const previousCanonical = canonical.getAttribute("href")
    canonical.setAttribute("href", `${SITE_URL}${path}`)

    let script: HTMLScriptElement | null = null
    if (jsonLdString) {
      script = document.createElement("script")
      script.type = "application/ld+json"
      script.text = jsonLdString
      document.head.appendChild(script)
    }

    return () => {
      document.title = previousTitle
      if (previousCanonical) canonical.setAttribute("href", previousCanonical)
      if (script) document.head.removeChild(script)
    }
  }, [title, description, path, jsonLdString])
}
