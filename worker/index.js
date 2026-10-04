// Cloudflare Worker in front of the static site.
//
// The site is a single-page app: every URL is served the same index.html, and each page sets its own title,
// description and share image with JavaScript after it loads. Facebook, Messenger, Viber and most other
// link-preview crawlers do not run JavaScript, so without this every shared link previews as the homepage.
//
// For page requests this fills in the right title, description, image and canonical URL before the HTML
// leaves the server. Everything else (scripts, images, the app itself) is untouched. If anything here
// fails, the unmodified page is served.

import { STATIC_PAGES } from "./pages.js"

const SITE_URL = "https://betterpagbilao.org"
const API = "https://api-v2.betterpagbilao.org/api"
const SITE_NAME = "Better Pagbilao"
const API_TIMEOUT_MS = 2500
const API_CACHE_SECONDS = 300

/** GET a public API endpoint. Null on any failure, including 404. */
async function api(path) {
    try {
        const response = await fetch(`${API}${path}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
            cf: { cacheTtl: API_CACHE_SECONDS, cacheEverything: true },
        })
        if (!response.ok) return null
        const body = await response.json()
        return body && body.ok !== false ? (body.data ?? null) : null
    } catch {
        return null
    }
}

async function businessMeta(slug) {
    const [data, categories] = await Promise.all([api(`/businesses/${encodeURIComponent(slug)}`), api("/business-categories")])
    const business = data?.business
    if (!business) return null
    const category = categories?.categories?.find((item) => item.slug === business.category)?.name
    return {
        title: `${business.name} — ${category ? `${category} in ` : ""}Barangay ${business.barangay}, Pagbilao | ${SITE_NAME}`,
        description: `${business.description} Find ${business.name} in Barangay ${business.barangay}, Pagbilao, Quezon — hours, contact number, and location on the map.`,
        image: business.logoUrl || business.gallery?.[0]?.url || null,
        imageAlt: business.name,
    }
}

async function destinationMeta(slug) {
    const data = await api("/tourist-destinations")
    // Out-of-town places carry a "-nearby" id suffix that the page URL leaves off.
    const destination = data?.destinations?.find((item) => item.id.replace(/-nearby$/, "") === slug)
    if (!destination) return null
    const nearby = destination.id.endsWith("-nearby") || (destination.verificationStatus ?? "").startsWith("nearby")
    const activities = (destination.activities ?? []).join(", ").toLowerCase()
    return {
        title: `${destination.name} ${nearby ? "near" : "in"} Pagbilao, Quezon | ${SITE_NAME}`,
        description: `${destination.description}${activities ? ` Things to do: ${activities}.` : ""} Visitor tips and what to confirm before you go.`,
        image: destination.image || null,
        imageAlt: `${destination.name}, Pagbilao, Quezon`,
    }
}

async function announcementMeta(slug) {
    const data = await api(`/announcements/${encodeURIComponent(slug)}`)
    const announcement = data?.announcement
    if (!announcement) return null
    return {
        title: `${announcement.title} | ${SITE_NAME}`,
        description: announcement.summary || "An announcement from the municipal government of Pagbilao, Quezon.",
        image: announcement.imageUrl || null,
        imageAlt: announcement.title,
    }
}

const DYNAMIC_PAGES = [
    { pattern: /^\/community\/businesses\/([^/]+)$/, load: businessMeta },
    { pattern: /^\/explore\/tourist-destinations\/([^/]+)$/, load: destinationMeta },
    { pattern: /^\/announcements\/([^/]+)$/, load: announcementMeta },
]

/** What to put in the page's head, or null to leave the page as it is (unknown URL, or the API is down). */
async function pageMeta(pathname) {
    // The homepage already carries its own title and description; it only needs its canonical URL.
    if (pathname === "/") return {}
    if (STATIC_PAGES[pathname]) return STATIC_PAGES[pathname]
    for (const { pattern, load } of DYNAMIC_PAGES) {
        const match = pathname.match(pattern)
        // "add" is a fixed page under /community/businesses and is matched above.
        if (match) return load(decodeURIComponent(match[1]))
    }
    return null
}

const escapeAttribute = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

const setContent = (value) => ({
    element(element) {
        if (value) element.setAttribute("content", value)
    },
})

function rewrite(response, meta, pathname) {
    const url = `${SITE_URL}${pathname === "/" ? "/" : pathname}`
    return new HTMLRewriter()
        .on("title", {
            element(element) {
                if (meta.title) element.setInnerContent(meta.title)
            },
        })
        .on('meta[name="description"]', setContent(meta.description))
        .on('meta[property="og:title"]', setContent(meta.title))
        .on('meta[property="og:description"]', setContent(meta.description))
        .on('meta[property="og:image"]', setContent(meta.image))
        .on('meta[property="og:image:alt"]', setContent(meta.image ? meta.imageAlt : null))
        .on('meta[name="twitter:title"]', setContent(meta.title))
        .on('meta[name="twitter:description"]', setContent(meta.description))
        .on('meta[name="twitter:image"]', setContent(meta.image))
        .on("head", {
            element(element) {
                const href = escapeAttribute(url)
                element.append(`<link rel="canonical" href="${href}" /><meta property="og:url" content="${href}" />`, { html: true })
            },
        })
        .transform(response)
}

export default {
    async fetch(request, env) {
        const response = await env.ASSETS.fetch(request)
        if (request.method !== "GET") return response

        // "/hotlines/" is the same page as "/hotlines".
        const pathname = new URL(request.url).pathname.replace(/(.)\/+$/, "$1")
        const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1)
        const isHtml = (response.headers.get("content-type") ?? "").includes("text/html")
        // Files (anything with an extension), redirects and errors pass straight through.
        if (lastSegment.includes(".") || !isHtml || response.status !== 200) return response

        try {
            const meta = await pageMeta(pathname)
            return meta ? rewrite(response, meta, pathname) : response
        } catch {
            return response
        }
    },
}
