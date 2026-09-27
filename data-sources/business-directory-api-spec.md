# Business Directory API — build spec for the Laravel backend

Hand this whole file to whoever (or whichever AI) builds the backend. It describes the API the
existing frontend already expects — the pages are built and live at `/community/businesses`,
`/community/businesses/{id}`, and `/community/businesses/add` in the `better-pagbilao` React app,
currently running on hardcoded sample data. This spec turns that into a real, submittable,
searchable directory.

Match the conventions below exactly — they mirror the existing **Community Issue Reporting**
feature on this same backend (`/api/issue-reporting`, `/api/issues`, `/api/issue-categories`,
`/api/barangays`), so a developer already familiar with that code will recognize this immediately.

---

## 1. Conventions to match exactly

**Base URL:** `https://api-v2.betterpagbilao.org/api` (same base as everything else).

**Response envelope.** Every successful response is JSON shaped like:

```json
{ "ok": true, "data": { ... } }
```

`ok` can be omitted on success (the frontend only checks `ok !== false`), but always include `data`.

**Errors.** Use Laravel's native validation behavior — a `422` with the default
`{"message": "...", "errors": {"field": ["message"]}}` shape works as-is; the frontend already
reads `errors` directly. For everything else:

| Status | Meaning | When |
|---|---|---|
| 403 | Feature disabled | The directory has been turned off by an admin (see §2, kill switch) |
| 404 | Not found | Unknown business id/slug |
| 422 | Validation failed | Laravel's default `ValidationException` response |
| 429 | Rate limited | Too many submissions from one IP/session — use Laravel's `throttle` middleware |
| 5xx | Server error | Anything else |

**Honeypot.** The submission form always sends a `website` field that must always arrive empty.
If it isn't empty, silently accept the request (return a normal success response) but discard it —
don't tell the bot it was rejected.

**Rate limiting.** Throttle `POST /businesses` per IP (e.g. 5 requests/hour) — this is a public,
unauthenticated, spam-prone endpoint.

---

## 2. Endpoints needed

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/business-directory-status` | Kill switch, `{ "enabled": true }` | Public |
| GET | `/business-categories` | Category list for the dropdown/filter chips | Public |
| GET | `/barangays` | **Already exists** — reuse it, don't rebuild it | Public |
| GET | `/businesses` | Public, paginated, filterable list — **approved only** | Public |
| GET | `/businesses/{slug}` | Single business detail — **approved only** | Public |
| POST | `/businesses` | Submit a new listing (goes to `pending`, not public yet) | Public |

The admin moderation endpoints (approve/reject a pending submission, edit a listing, view pending
queue) aren't specified here since they're not consumed by this frontend yet — build them however
fits your existing admin panel/auth, just make sure approving a submission is what flips it into
the public `/businesses` results.

### 2.1 `GET /business-directory-status`

Mirrors `/issue-reporting` exactly:

```json
{ "data": { "enabled": true } }
```

Optional but recommended — lets an admin pause new submissions without a deploy, same as the
existing reporting feature.

### 2.2 `GET /business-categories`

```json
{ "data": { "categories": [
    { "slug": "food", "name": "Food & Restaurants" },
    { "slug": "retail", "name": "Retail & Sari-sari" },
    { "slug": "agri", "name": "Farming & Fishery" },
    { "slug": "services", "name": "Repair & Services" },
    { "slug": "health", "name": "Health & Wellness" },
    { "slug": "transport", "name": "Transport & Delivery" },
    { "slug": "construction", "name": "Hardware & Construction" },
    { "slug": "beauty", "name": "Beauty & Personal Care" },
    { "slug": "education", "name": "Education & Tutorial" },
    { "slug": "stay", "name": "Resorts & Lodging" },
    { "slug": "online", "name": "Online Sellers" },
    { "slug": "other", "name": "Other" }
] } }
```

These 12 slugs are already hardcoded in the frontend (`BusinessCategoryId` type) — **keep the
slugs exactly as spelled above**, they're relied on by name. The `name` label can be edited later
without a frontend deploy since it's fetched from here (this is *why* it's an endpoint and not just
hardcoded — same reasoning as `/issue-categories`).

### 2.3 `GET /businesses` (public list)

Query params (all optional):

| Param | Type | Notes |
|---|---|---|
| `q` | string | Free-text search — match against name, description, products/services |
| `category` | string | One of the category slugs above |
| `barangay` | string | Exact barangay name (see the 27-name list the `/barangays` endpoint already returns) |
| `page` | int | Default 1 |
| `perPage` | int | Default ~12 |

Only ever return businesses with `status = approved`. Response:

```json
{ "data": {
    "businesses": [ /* array of Business objects, §3 */ ],
    "pagination": { "page": 1, "perPage": 12, "total": 47, "lastPage": 4 }
} }
```

### 2.4 `GET /businesses/{slug}`

Single `Business` object (§3), only if `status = approved`. 404 otherwise — **do not** leak
`pending`/`rejected` listings through this endpoint, even by guessable id.

```json
{ "data": { "business": { /* Business object */ } } }
```

**Use a slug, not a raw numeric id, as the identifier in the URL.** e.g.
`kusina-ni-aling-nena-42`, generated from the business name plus a disambiguator. This directly
matters for SEO — the frontend's page title/meta/JSON-LD are built around this URL, and
`/businesses/42` ranks worse than `/businesses/kusina-ni-aling-nena-42` for a search like "kusina
Daungan Pagbilao". Keep slugs stable once assigned (don't regenerate them if the name is edited
later) since they're the canonical URL other sites/search engines will link to.

### 2.5 `POST /businesses` (submit a new listing)

Multipart/form-data when any file is attached (logo and/or gallery photos), otherwise plain JSON —
same rule the existing `submitIssue()` follows. Full field table is in §4.

On success, respond `201` with:

```json
{ "data": {
    "id": "kusina-ni-aling-nena-42",
    "status": "pending",
    "message": "Thanks! A volunteer will review your listing, usually within a few days."
} }
```

Do **not** return the full business record with a public slug/URL the owner could immediately
share — it isn't public yet.

---

## 3. The `Business` object (what `/businesses` and `/businesses/{slug}` return)

```ts
{
  id: string              // the slug, e.g. "kusina-ni-aling-nena-42"
  name: string
  category: string        // one of the 12 category slugs
  description: string
  productsServices: string | null
  barangay: string
  address: string
  hours: string | null
  phone: string
  online: string | null   // "facebook.com/..." or a full URL, frontend handles both
  latitude: number | null
  longitude: number | null
  pinPrecision: "exact" | "approximate" | "hidden"
  logoUrl: string | null
  gallery: { url: string }[]   // full image URLs, already uploaded/stored
}
```

This matches the frontend's `SampleBusiness` type in `src/data/businessDirectory.ts` almost
exactly — that file (and its `galleryPhotoCount`-only placeholder) gets deleted once this API is
wired up; the real `gallery` array replaces it.

**Fields that must exist in your database but must never appear in these public responses:**
`ownerName` (unless the submitter opted to show it — see §4), `ownerEmail` (never shown, ever),
the *raw* exact latitude/longitude when `pinPrecision` isn't `"exact"` (see §5 — this one is
important), `employees`, `yearStarted`, `homeBased`/`deliversToOtherBarangays`, and the moderation
fields (`status`, `submittedAt`, `reviewedAt`, `rejectionReason`). Those last few are useful for an
admin panel, just don't leak them through the public endpoints.

---

## 4. Submission fields (`POST /businesses`)

| Field | Type | Required | Validation |
|---|---|---|---|
| `businessName` | string | ✅ | max 150 |
| `category` | string | ✅ | must be one of the 12 category slugs |
| `productsServices` | string | – | max 300 |
| `description` | string | ✅ | max 1000 |
| `barangay` | string | ✅ | must be one of the official barangay names |
| `address` | string | ✅ | max 200 (street/purok/landmark, free text) |
| `homeBased` | boolean | – | |
| `deliversToOtherBarangays` | boolean | – | |
| `ownerName` | string | ✅ | max 150 |
| `showOwnerName` | boolean | – | controls whether `ownerName` is ever public — it currently isn't part of the public `Business` object at all (§3), so this flag matters if/when you decide to surface it later |
| `phone` | string | ✅ | PH mobile/landline, keep loose (owners will type it inconsistently) |
| `email` | string | – | valid email, **never public** |
| `online` | string | – | Facebook page or website, max 200 |
| `hours` | string | – | free text, max 100 — don't try to force a structured schedule, owners write things like "By appointment, daily" or "Orders open Thu–Sat" that won't fit a rigid format |
| `employees` | string | – | one of: `"Just me"`, `"2–5"`, `"6–10"`, `"11–50"`, `"More than 50"` (exact strings, currently just descriptive — fine to store as-is for now) |
| `yearStarted` | integer | – | 4 digits, reasonable range (e.g. 1900–current year) |
| `latitude` | float | – | required together with `longitude` if either is present |
| `longitude` | float | – | must fall within Pagbilao's bounding box: **south 13.85, north 14.08, west 121.58, east 121.82** — reject (422) a pin outside this box, same rule the frontend's map already enforces client-side; don't trust the client-side check alone |
| `pinPrecision` | string | – | one of `"exact"`, `"approximate"`, `"hidden"`; defaults to `"exact"` if a pin was placed |
| `logo` | file | – | image, jpeg/png/webp, max 5 MB |
| `gallery[]` | file[] | – | image, jpeg/png/webp, max 5 MB each, **cap at 8 files** (the form lets an owner add as many tiles as they like — enforce the cap server-side regardless of what the client sends) |
| `consentPublish` | boolean | ✅ (must be `true`) | "may be shown on the public directory" |
| `consentPrivacy` | boolean | ✅ (must be `true`) | Data Privacy Act acknowledgment |
| `consentAccurate` | boolean | ✅ (must be `true`) | "I am the owner / authorized rep" |
| `website` | string | must be empty | honeypot, see §1 |

Every submission gets `status = "pending"` and waits for a volunteer/admin to approve it before it
appears in `/businesses`.

---

## 5. Pin precision — handle this server-side, not just client-side

This is the one part worth reading twice. The "how should the map show your location?" choice in
the form exists because home-based sellers don't want their house address published exactly. The
frontend already builds its UI around three states, and **the backend must actually enforce the
privacy promise**, not just store a flag:

- **`exact`** — return `latitude`/`longitude` in `/businesses` and `/businesses/{slug}` exactly as
  submitted.
- **`approximate`** — **do not return the real coordinates at all.** Instead, either (a) jitter them
  server-side by a small random offset (~300 m) once at submission time and store *only* the
  jittered pair, discarding the real one, or (b) store both but have the public serializer return
  only a rounded/offset version. Option (a) is safer — if the real coordinates are never stored,
  they can't leak through a bug, a debug endpoint, or a database dump later.
- **`hidden`** — `latitude`/`longitude` are `null` in every public response, always. The business
  still appears in the list/detail with its barangay name, just no map pin.

The frontend's structured data (JSON-LD on the business detail page) already omits coordinates
entirely for anything other than `exact` — the backend needs to hold up its end so that promise is
actually true, not just true in the frontend's rendering.

---

## 6. Photo storage

- Store uploads via Laravel's filesystem (S3 in production, `storage/app/public` locally with the
  usual `storage:link`) and return full public URLs, not relative paths — the frontend just uses
  `<img src>` directly.
- No thumbnailing/resizing required for a first version; nice-to-have later if page weight becomes
  an issue.
- Reject non-image MIME types and anything over 5 MB with a normal 422, field-scoped to `logo` or
  `gallery.N`.

---

## 7. Nice-to-haves, not required for v1

- **A "track my submission" flow**, mirroring the existing `/issues/{trackingCode}` pattern —
  return a short reference code on submit and a `GET /businesses/track/{code}` (or similar) so an
  owner can check "pending / approved / rejected" without an account. The current frontend doesn't
  have a UI for this yet, but it'd be a natural, low-effort follow-up given the pattern already
  exists for issue reports.
- **A sitemap feed** (e.g. `GET /businesses/sitemap` returning just `{slug, updatedAt}` pairs) so
  the site's `public/sitemap.xml` — currently hand-maintained and missing every `/community/*`
  route — can eventually be generated instead of edited by hand once real listings exist.

---

## 8. Example: end-to-end submission

**Request** (`multipart/form-data`, since a logo was attached):

```
POST /api/businesses
businessName: Kusina ni Aling Nena
category: food
description: Home-cooked carinderia meals and catering trays for small gatherings.
productsServices: Sinigang, fried chicken, biko
barangay: Daungan
address: Near the barangay hall
homeBased: 0
deliversToOtherBarangays: 1
ownerName: Nena Reyes
showOwnerName: 0
phone: 09171234567
email: nena@example.com
hours: 6:00 AM – 7:00 PM, Mon–Sat
employees: 2–5
yearStarted: 2019
latitude: 13.96739
longitude: 121.68901
pinPrecision: exact
consentPublish: 1
consentPrivacy: 1
consentAccurate: 1
website: (empty)
logo: <file>
gallery[]: <file>
gallery[]: <file>
```

**Response** (`201`):

```json
{ "data": {
    "id": "kusina-ni-aling-nena-42",
    "status": "pending",
    "message": "Thanks! A volunteer will review your listing, usually within a few days."
} }
```

**Later, once approved**, `GET /businesses/kusina-ni-aling-nena-42` returns:

```json
{ "data": { "business": {
    "id": "kusina-ni-aling-nena-42",
    "name": "Kusina ni Aling Nena",
    "category": "food",
    "description": "Home-cooked carinderia meals and catering trays for small gatherings.",
    "productsServices": "Sinigang, fried chicken, biko",
    "barangay": "Daungan",
    "address": "Near the barangay hall",
    "hours": "6:00 AM – 7:00 PM, Mon–Sat",
    "phone": "09171234567",
    "online": null,
    "latitude": 13.96739,
    "longitude": 121.68901,
    "pinPrecision": "exact",
    "logoUrl": "https://.../storage/businesses/42/logo.jpg",
    "gallery": [
      { "url": "https://.../storage/businesses/42/gallery-1.jpg" },
      { "url": "https://.../storage/businesses/42/gallery-2.jpg" }
    ]
} } }
```

Note `ownerName`, `email`, `employees`, `yearStarted`, `homeBased`, `deliversToOtherBarangays` are
all absent — they were collected on submission but are not part of the public response (§3).
