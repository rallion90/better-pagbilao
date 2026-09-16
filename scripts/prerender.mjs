// Post-build step: visits every route in a real (headless) browser against the
// built `dist/` output, lets the page's client-side data fetches resolve, then
// writes the fully-rendered HTML back to disk as a static file per route.
//
// This exists because the app fetches its content from api.betterpagbilao.org
// client-side after mount (see src/lib/pgApi.ts) — without this step, `dist/`
// only ever contains an empty <div id="root"> shell for every URL, which is
// invisible to crawlers that don't execute JS (and slower to index for ones
// that do). Each generated page also embeds the API responses it captured as
// `window.__PRELOAD__`, which src/lib/pgApi.ts reads instead of re-fetching,
// so real visitors don't pay for the request twice.
import { chromium } from "playwright"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import { spawn, spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const DIST_DIR = path.join(ROOT, "dist")
const PORT = 4319
const BASE_URL = `http://localhost:${PORT}`
const API_HOST = "api.betterpagbilao.org"

async function getRoutesFromSitemap() {
  const xml = await readFile(path.join(DIST_DIR, "sitemap.xml"), "utf8")
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
  return matches.map((loc) => new URL(loc).pathname)
}

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const attempt = async () => {
      try {
        const res = await fetch(url)
        if (res.ok || res.status === 404) return resolve()
      } catch {
        // server not up yet
      }
      if (Date.now() - start > timeoutMs) return reject(new Error(`Timed out waiting for ${url}`))
      setTimeout(attempt, 250)
    }
    attempt()
  })
}

// child_process .kill() only signals the immediate process. Since the preview
// server is spawned via a shell (npx -> vite), that leaves the actual vite
// process orphaned on Windows, still holding the port for the next run.
// taskkill /t walks the whole tree instead.
function killProcessTree(pid) {
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(pid), "/t", "/f"], { stdio: "ignore" })
  } else {
    try {
      process.kill(-pid, "SIGKILL")
    } catch {
      // process (group) already gone
    }
  }
}

function outputPathForRoute(routePath) {
  if (routePath === "/") return path.join(DIST_DIR, "index.html")
  const clean = routePath.replace(/^\/|\/$/g, "")
  return path.join(DIST_DIR, clean, "index.html")
}

function injectPreload(html, preloadData) {
  const script = `<script>window.__PRELOAD__=${JSON.stringify(preloadData)};</script>`
  if (html.includes("</head>")) return html.replace("</head>", `${script}</head>`)
  return html.replace("<head>", `<head>${script}`)
}

async function prerenderRoute(browser, routePath) {
  const page = await browser.newPage()
  const preloadData = {}

  // Skip the first-visit intro/disclosure modals in the snapshot — they're
  // timed popups (see DataDisclosureModal.tsx / MascotIntroModal.tsx), not
  // page content, and would otherwise bake a scroll-locked overlay into every
  // static page and every real visitor's first paint.
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("bp_data_disclosure_seen_v1", "true")
      window.localStorage.setItem("bp_mascot_intro_seen_v1", "true")
    } catch {
      // ignore storage errors in the prerender browser context
    }
  })

  page.on("response", async (response) => {
    try {
      const url = response.url()
      if (!url.includes(API_HOST)) return
      if (response.request().method() !== "GET") return
      const contentType = response.headers()["content-type"] ?? ""
      if (!contentType.includes("application/json")) return
      preloadData[url] = await response.json()
    } catch {
      // best-effort capture; a failed/aborted request just won't be preloaded
    }
  })

  await page.goto(`${BASE_URL}${routePath}`, { waitUntil: "domcontentloaded", timeout: 30000 })
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {})
  // small settle buffer for any state update queued right after the last fetch resolves
  await page.waitForTimeout(200)

  const html = await page.content()
  await page.close()

  // Vite's modulepreload polyfill injects <link> hints with absolute URLs
  // resolved against the page's own origin (the local preview server) —
  // rewrite them back to root-relative so they resolve correctly once served
  // from the real domain.
  const sanitized = html.split(BASE_URL).join("")

  return injectPreload(sanitized, preloadData)
}

async function main() {
  const routes = await getRoutesFromSitemap()
  console.log(`Prerendering ${routes.length} route(s) from sitemap.xml...`)

  const previewProcess = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: ROOT,
    stdio: "pipe",
    shell: true,
    detached: process.platform !== "win32",
  })
  let previewStderr = ""
  previewProcess.stderr.on("data", (chunk) => {
    previewStderr += chunk.toString()
    process.stderr.write(chunk)
  })

  try {
    await waitForServer(BASE_URL)
    if (previewStderr.includes("already in use")) {
      throw new Error(
        `Port ${PORT} was already occupied by another process (likely a leftover from a previous run) — ` +
          "aborting instead of prerendering against a stale server. Free the port and retry.",
      )
    }

    const browser = await chromium.launch()
    const results = []
    try {
      for (const routePath of routes) {
        process.stdout.write(`  ${routePath} ... `)
        const html = await prerenderRoute(browser, routePath)
        results.push({ routePath, html })
        console.log("done")
      }
    } finally {
      await browser.close()
    }

    for (const { routePath, html } of results) {
      const outPath = outputPathForRoute(routePath)
      await mkdir(path.dirname(outPath), { recursive: true })
      await writeFile(outPath, html, "utf8")
    }

    console.log(`Wrote ${results.length} prerendered page(s) to dist/.`)
  } finally {
    killProcessTree(previewProcess.pid)
  }
}

if (!existsSync(DIST_DIR)) {
  console.error("dist/ not found — run `vite build` before prerendering.")
  process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
