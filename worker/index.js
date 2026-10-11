// Cloudflare Worker in front of the static site.
//
// The site is a single-page app: every URL is served the same index.html, and each page sets its own title,
// description and share image with JavaScript after it loads. Facebook, Messenger, Viber and most other
// link-preview crawlers do not run JavaScript, so without this every shared link previews as the homepage.
//
// For page requests this fills in the right title, description, image and canonical URL before the HTML
// leaves the server. Everything else (scripts, images, the app itself) is untouched. If anything here
// fails, the unmodified page is served.
//
// Every URL also answers 200 by default, even one that leads nowhere, which search engines report as a
// "soft 404". A URL that matches no page, or a listing the API says does not exist, is answered 404 here.
// The app still loads and shows its own "not found" screen.

import { STATIC_PAGES } from "./pages.js"

const SITE_URL = "https://betterpagbilao.org"
const API = "https://api-v2.betterpagbilao.org/api"
const SITE_NAME = "Better Pagbilao"
const API_TIMEOUT_MS = 2500
const API_CACHE_SECONDS = 300

/** A URL that leads nowhere: no such page, or the API says the listing does not exist. */
const NOT_FOUND = Symbol("not found")

/** GET a public API endpoint. NOT_FOUND on a 404, null on any other failure. */
async function api(path) {
    try {
        const response = await fetch(`${API}${path}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
            cf: { cacheTtl: API_CACHE_SECONDS, cacheEverything: true },
        })
        if (response.status === 404) return NOT_FOUND
        if (!response.ok) return null
        const body = await response.json()
        return body && body.ok !== false ? (body.data ?? null) : null
    } catch {
        return null
    }
}

async function businessMeta(slug) {
    const [data, categories] = await Promise.all([api(`/businesses/${encodeURIComponent(slug)}`), api("/business-categories")])
    if (data === NOT_FOUND) return NOT_FOUND
    const business = data?.business
    if (!business) return null
    const category = categories?.categories?.find((item) => item.slug === business.category)?.name
    return {
        title: `${business.name} — ${category ? `${category} in ` : ""}Barangay ${business.barangay}, Pagbilao | ${SITE_NAME}`,
        description: `${business.description} Find ${business.name} in Barangay ${business.barangay}, Pagbilao, Quezon — hours, contact number, and location on the map.`,
        // The branded card the API draws for each listing. Without one the page keeps the site's default image.
        image: business.shareImageUrl || null,
        imageAlt: business.name,
    }
}

async function destinationMeta(slug) {
    const data = await api("/tourist-destinations")
    if (!Array.isArray(data?.destinations)) return null
    // Out-of-town places carry a "-nearby" id suffix that the page URL leaves off.
    const destination = data.destinations.find((item) => item.id.replace(/-nearby$/, "") === slug)
    if (!destination) return NOT_FOUND
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
    if (data === NOT_FOUND) return NOT_FOUND
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

// A report's tracking page. It is private to whoever holds the code, so it is served as it is.
const TRACK_REPORT_PAGE = /^\/community\/track\/[^/]+$/

/** What to put in the page's head, null to leave the page as it is (the API is down), or NOT_FOUND. */
async function pageMeta(pathname) {
    // The homepage already carries its own title and description; it only needs its canonical URL.
    if (pathname === "/") return {}
    if (STATIC_PAGES[pathname]) return STATIC_PAGES[pathname]
    if (TRACK_REPORT_PAGE.test(pathname)) return null
    for (const { pattern, load } of DYNAMIC_PAGES) {
        const match = pathname.match(pattern)
        // "add" is a fixed page under /community/businesses and is matched above.
        if (match) return load(decodeURIComponent(match[1]))
    }
    return NOT_FOUND
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
        // The size in the page is the default share image's, not this one's.
        .on('meta[property="og:image:width"], meta[property="og:image:height"]', {
            element(element) {
                if (meta.image) element.remove()
            },
        })
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

/** The same page, answered 404 and kept out of search results. */
function notFound(response) {
    const headers = new Headers(response.headers)
    // Without these a repeat visit could be answered "not modified", which hides the 404.
    headers.delete("etag")
    headers.delete("last-modified")
    const page = new HTMLRewriter()
        .on("title", {
            element(element) {
                element.setInnerContent(`Page Not Found | ${SITE_NAME}`)
            },
        })
        .on('meta[name="robots"]', setContent("noindex, follow"))
        .transform(response)
    return new Response(page.body, { status: 404, headers })
}

export default {
    async fetch(request, env) {
        const response = await env.ASSETS.fetch(request)
        if (request.method !== "GET" && request.method !== "HEAD") return response

        // "/hotlines/" is the same page as "/hotlines".
        const pathname = new URL(request.url).pathname.replace(/(.)\/+$/, "$1")
        const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1)
        const isHtml = (response.headers.get("content-type") ?? "").includes("text/html")
        // Real files, redirects and errors pass straight through.
        if (!isHtml || response.status !== 200) return response

        try {
            // A file (anything with an extension) that got the app's page instead does not exist.
            if (lastSegment.includes(".")) return notFound(response)
            const meta = await pageMeta(pathname)
            if (meta === NOT_FOUND) return notFound(response)
            return meta ? rewrite(response, meta, pathname) : response
        } catch {
            return response
        }
    },
}
