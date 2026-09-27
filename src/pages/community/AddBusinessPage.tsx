import {
    ArrowLeft,
    ArrowRight,
    CheckCheck,
    CheckCircle2,
    Crosshair,
    EyeOff,
    ImagePlus,
    ListChecks,
    LoaderCircle,
    Lock,
    MapPin,
    TriangleAlert,
    Upload,
    X,
} from "lucide-react"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { Link } from "react-router"
import PageBreadcrumb from "../../components/common/PageBreadcrumb"
import type { BusinessMapFocus } from "../../components/community/BusinessMap"
import { useBusinessDirectory, useDirectoryDisabledHandler } from "../../hooks/useBusinessDirectory"
import { useSeo } from "../../hooks/useSeo"
import { businessDirectoryCopy } from "../../i18n/businessDirectory"
import type { BusinessDirectoryCopy } from "../../i18n/businessDirectory"
import { useLanguage } from "../../i18n/useLanguage"
import { submitBusiness } from "../../lib/businessApi"
import { MAX_PHOTO_BYTES, PHOTO_TYPES, isWithinPagbilao } from "../../lib/communityReports"
import type { LatLng } from "../../lib/communityReports"
import { IssueApiError } from "../../lib/issuesApi"
import { EMPLOYEE_OPTIONS } from "../../types/businesses"
import type { BusinessCategoryId, BusinessSubmission, BusinessSubmitted, EmployeeCount, PinPrecision } from "../../types/businesses"

const BusinessMap = lazy(() => import("../../components/community/BusinessMap"))

const PAGE_PATH = "/community/businesses/add"
const DIRECTORY_PATH = "/community/businesses"
const PRECISION_OPTIONS: PinPrecision[] = ["exact", "approximate", "hidden"]
const MAX_GALLERY = 8
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Same limits the API enforces.
const MAX = { businessName: 150, productsServices: 300, description: 1000, address: 200, ownerName: 150, phone: 50, online: 200, hours: 100 } as const

type TextKey = "businessName" | "category" | "productsServices" | "description" | "barangay" | "address" | "ownerName" | "phone" | "email" | "online" | "hours" | "employees" | "yearStarted"
type FlagKey = "homeBased" | "deliversToOtherBarangays" | "showOwnerName" | "consentPublish" | "consentPrivacy" | "consentAccurate"
type FormValues = Record<TextKey, string> & Record<FlagKey, boolean>

// Keys are the API's field names, plus "location" for the pin and "gallery" for the gallery as a whole.
type ErrorKey = TextKey | FlagKey | "location" | "logo" | "gallery"
type FieldErrors = Partial<Record<ErrorKey, string>>

type PhotoItem = { id: number; file: File; url: string; error?: string }

const EMPTY_VALUES: FormValues = {
    businessName: "",
    category: "",
    productsServices: "",
    description: "",
    barangay: "",
    address: "",
    ownerName: "",
    phone: "",
    email: "",
    online: "",
    hours: "",
    employees: "",
    yearStarted: "",
    homeBased: false,
    deliversToOtherBarangays: false,
    showOwnerName: false,
    consentPublish: false,
    consentPrivacy: false,
    consentAccurate: false,
}

const ERROR_KEYS: ErrorKey[] = [...(Object.keys(EMPTY_VALUES) as (TextKey | FlagKey)[]), "location", "logo", "gallery"]

// Server field names folded onto the field that renders their message. "gallery.N" is handled separately.
function toErrorKey(serverField: string): ErrorKey | null {
    if (serverField === "latitude" || serverField === "longitude" || serverField === "pinPrecision") return "location"
    return ERROR_KEYS.find((key) => key === serverField) ?? null
}

const inputClass =
    "w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25 aria-[invalid=true]:border-bayan-red aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-bayan-red/20"

const FieldError = ({ id, message }: { id: string; message?: string }) =>
    message ? (
        <p id={id} className="mt-1.5 text-xs font-bold text-bayan-red">
            {message}
        </p>
    ) : null

type FieldProps = {
    id: string
    label: string
    tag?: string
    required?: boolean
    error?: string
    children: ReactNode
}

const Field = ({ id, label, tag, required, error, children }: FieldProps) => (
    <div>
        <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-black text-bayan-ink">
            <span>{label}</span>
            {tag && <span className={`text-xs font-bold ${required ? "text-bayan-red" : "text-slate-400"}`}>{tag}</span>}
        </label>
        <div className="mt-1.5">{children}</div>
        <FieldError id={`${id}-error`} message={error} />
    </div>
)

type CheckboxProps = { id: string; checked: boolean; onChange: (checked: boolean) => void; error?: string; children: ReactNode }

const Checkbox = ({ id, checked, onChange, error, children }: CheckboxProps) => (
    <div>
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-6 font-semibold text-slate-700">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-bayan-blue"
            />
            <span>{children}</span>
        </label>
        <FieldError id={`${id}-error`} message={error} />
    </div>
)

const SectionCard = ({ number, title, children }: { number: number; title: string; children: ReactNode }) => (
    <fieldset className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="sr-only">{title}</legend>
        <h2 className="flex items-center gap-3 text-lg font-black">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-sm font-black text-bayan-blue">{number}</span>
            {title}
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
)

const SuccessCard = ({ result, copy, onAnother }: { result: BusinessSubmitted; copy: BusinessDirectoryCopy["form"]; onAnother: () => void }) => (
    <div role="status" className="rounded-lg border border-emerald-200 bg-white p-6 text-center shadow-soft sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-bayan-green">
            <CheckCheck className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-2xl font-black">{copy.success.heading}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">{result.message || copy.success.body}</p>
        {/* No link to the listing itself: it answers 404 until a volunteer approves it. */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={onAnother} className="rounded-md bg-bayan-blue px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                {copy.success.another}
            </button>
            <Link to={DIRECTORY_PATH} className="rounded-md bg-bayan-mist px-5 py-3 text-sm font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50">
                {copy.success.backToDirectory}
            </Link>
        </div>
    </div>
)

const AddBusinessPage = () => {
    const { lang, t } = useLanguage()
    const copy = businessDirectoryCopy[lang]
    const page = copy.form
    const f = page.fields
    const m = page.map
    const e = page.errors
    const { categories, barangays, optionsLoading, optionsFailed, reloadOptions } = useBusinessDirectory()
    const handleDisabled = useDirectoryDisabledHandler()

    const [values, setValues] = useState<FormValues>(EMPTY_VALUES)
    const [errors, setErrors] = useState<FieldErrors>({})
    const [banner, setBanner] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState<BusinessSubmitted | null>(null)

    const [pin, setPin] = useState<LatLng | null>(null)
    const [focus, setFocus] = useState<BusinessMapFocus | null>(null)
    const [locating, setLocating] = useState(false)
    const [locateFailed, setLocateFailed] = useState(false)
    const [precision, setPrecision] = useState<PinPrecision>("exact")
    const pinOutside = pin !== null && !isWithinPagbilao(pin)

    const [logo, setLogo] = useState<PhotoItem | null>(null)
    const [gallery, setGallery] = useState<PhotoItem[]>([])
    const nextPhotoId = useRef(0)
    const formRef = useRef<HTMLFormElement>(null)

    // Revoke preview URLs when the page goes away.
    const photosRef = useRef<PhotoItem[]>([])
    useEffect(() => {
        photosRef.current = logo ? [logo, ...gallery] : gallery
    }, [logo, gallery])
    useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), [])

    useSeo({
        title: `${page.breadcrumb} | Better Pagbilao`,
        description: "Add your Pagbilao business to the community directory. Free listing for stores, food sellers, farms, services, and online sellers.",
        path: PAGE_PATH,
        noindex: true,
    })

    const maxYear = new Date().getFullYear()

    const clearError = (key: ErrorKey) => setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))

    const setText = (key: TextKey) => (value: string) => {
        setValues((current) => ({ ...current, [key]: value }))
        clearError(key)
    }
    const setFlag = (key: FlagKey) => (value: boolean) => {
        setValues((current) => ({ ...current, [key]: value }))
        clearError(key)
    }

    /** Props shared by every text input: value, change handler, and the error wiring. */
    const textProps = (key: TextKey, id: string) => ({
        id,
        value: values[key],
        onChange: (event: { target: { value: string } }) => setText(key)(event.target.value),
        "aria-invalid": errors[key] ? true : undefined,
        "aria-describedby": errors[key] ? `${id}-error` : undefined,
    })

    const handlePick = (position: LatLng) => {
        setPin(position)
        setLocateFailed(false)
        clearError("location")
    }

    const handleUseMyLocation = () => {
        if (!("geolocation" in navigator)) {
            setLocateFailed(true)
            return
        }
        setLocating(true)
        setLocateFailed(false)
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const position: LatLng = [coords.latitude, coords.longitude]
                handlePick(position)
                setFocus((current) => ({ position, key: (current?.key ?? 0) + 1 }))
                setLocating(false)
            },
            () => {
                setLocateFailed(true)
                setLocating(false)
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    const checkPhoto = (file: File) => (!PHOTO_TYPES.includes(file.type) ? e.photoBadType : file.size > MAX_PHOTO_BYTES ? e.photoTooLarge : undefined)
    const toPhotoItem = (file: File): PhotoItem => ({ id: nextPhotoId.current++, file, url: URL.createObjectURL(file) })

    const handleLogo = (files: FileList | null) => {
        const file = files?.[0]
        if (!file) return
        const problem = checkPhoto(file)
        setErrors((current) => ({ ...current, logo: problem }))
        if (problem) return
        if (logo) URL.revokeObjectURL(logo.url)
        setLogo(toPhotoItem(file))
    }

    const removeLogo = () => {
        if (logo) URL.revokeObjectURL(logo.url)
        setLogo(null)
        clearError("logo")
    }

    const handleGallery = (files: FileList | null) => {
        if (!files || files.length === 0) return
        const room = MAX_GALLERY - gallery.length
        const accepted: PhotoItem[] = []
        let problem: string | undefined

        for (const file of Array.from(files)) {
            const fileProblem = checkPhoto(file)
            if (fileProblem) problem = fileProblem
            else if (accepted.length >= room) problem = e.photoTooMany(MAX_GALLERY)
            else accepted.push(toPhotoItem(file))
        }

        setGallery((current) => [...current, ...accepted])
        setErrors((current) => ({ ...current, gallery: problem }))
    }

    const removeGalleryPhoto = (id: number) => {
        setGallery((current) => {
            const photo = current.find((item) => item.id === id)
            if (photo) URL.revokeObjectURL(photo.url)
            return current.filter((item) => item.id !== id)
        })
        clearError("gallery")
    }

    const validate = (): FieldErrors => {
        const next: FieldErrors = {}
        const tooLong = (key: keyof typeof MAX) => values[key].trim().length > MAX[key]
        const required: [TextKey, string][] = [
            ["businessName", e.businessName],
            ["category", e.category],
            ["description", e.description],
            ["barangay", e.barangay],
            ["address", e.address],
            ["ownerName", e.ownerName],
            ["phone", e.phone],
        ]
        for (const [key, message] of required) if (!values[key].trim()) next[key] = message
        for (const key of Object.keys(MAX) as (keyof typeof MAX)[]) if (!next[key] && tooLong(key)) next[key] = e.tooLong(MAX[key])

        const email = values.email.trim()
        if (email && !EMAIL_PATTERN.test(email)) next.email = e.email

        const year = values.yearStarted.trim()
        if (year && !(/^\d{4}$/.test(year) && Number(year) >= 1900 && Number(year) <= maxYear)) next.yearStarted = e.yearStarted(maxYear)

        if (pinOutside) next.location = e.location
        for (const key of ["consentPublish", "consentPrivacy", "consentAccurate"] as const) if (!values[key]) next[key] = e.consent
        return next
    }

    const focusFirstError = () =>
        window.requestAnimationFrame(() => {
            const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-error="true"]')
            target?.scrollIntoView({ behavior: "smooth", block: "center" })
            target?.focus({ preventScroll: true })
        })

    const resetForm = () => {
        if (logo) URL.revokeObjectURL(logo.url)
        gallery.forEach((photo) => URL.revokeObjectURL(photo.url))
        setValues(EMPTY_VALUES)
        setErrors({})
        setBanner(null)
        setPin(null)
        setPrecision("exact")
        setLocateFailed(false)
        setLogo(null)
        setGallery([])
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (submitting) return

        const next = validate()
        setErrors(next)
        setBanner(null)
        setGallery((current) => (current.some((photo) => photo.error) ? current.map((photo) => ({ ...photo, error: undefined })) : current))
        if (Object.keys(next).length > 0) {
            setBanner(page.submitErrors.fixFields)
            focusFirstError()
            return
        }

        const trimmed = (key: TextKey) => values[key].trim()
        const submission: BusinessSubmission = {
            businessName: trimmed("businessName"),
            category: values.category as BusinessCategoryId,
            productsServices: trimmed("productsServices"),
            description: trimmed("description"),
            barangay: values.barangay,
            address: trimmed("address"),
            homeBased: values.homeBased,
            deliversToOtherBarangays: values.deliversToOtherBarangays,
            ownerName: trimmed("ownerName"),
            showOwnerName: values.showOwnerName,
            phone: trimmed("phone"),
            email: trimmed("email"),
            online: trimmed("online"),
            hours: trimmed("hours"),
            employees: (values.employees || undefined) as EmployeeCount | undefined,
            yearStarted: values.yearStarted.trim() ? Number(values.yearStarted.trim()) : undefined,
            consentPublish: values.consentPublish,
            consentPrivacy: values.consentPrivacy,
            consentAccurate: values.consentAccurate,
            logo: logo?.file ?? null,
            gallery: gallery.map((photo) => photo.file),
        }
        if (pin) {
            submission.latitude = Number(pin[0].toFixed(6))
            submission.longitude = Number(pin[1].toFixed(6))
            submission.pinPrecision = precision
        }

        setSubmitting(true)
        try {
            const result = await submitBusiness(submission)
            resetForm()
            setSubmitted(result)
            window.scrollTo({ top: 0, behavior: "smooth" })
        } catch (error) {
            // 403: the directory was switched off while the form was open. The layout swaps to the "paused" screen.
            if (handleDisabled(error)) return
            if (!(error instanceof IssueApiError)) {
                setBanner(page.submitErrors.server)
            } else if (error.kind === "validation") {
                const serverErrors: FieldErrors = {}
                const photoErrors = new Map<number, string>()
                for (const [field, messages] of Object.entries(error.fieldErrors)) {
                    const photoIndex = /^gallery\.(\d+)$/.exec(field)
                    if (photoIndex) {
                        photoErrors.set(Number(photoIndex[1]), messages[0])
                        continue
                    }
                    const key = toErrorKey(field)
                    if (key && !serverErrors[key]) serverErrors[key] = messages[0]
                }
                setErrors(serverErrors)
                if (photoErrors.size > 0) setGallery((current) => current.map((photo, index) => ({ ...photo, error: photoErrors.get(index) })))
                const matched = Object.keys(serverErrors).length > 0 || photoErrors.size > 0
                setBanner(matched ? page.submitErrors.fixFields : error.message || page.submitErrors.fixFields)
                if (matched) focusFirstError()
            } else if (error.kind === "rate-limited") {
                setBanner(page.submitErrors.rateLimited)
            } else if (error.kind === "network") {
                setBanner(page.submitErrors.network)
            } else {
                setBanner(page.submitErrors.server)
            }
        } finally {
            setSubmitting(false)
        }
    }

    const canSubmit = !submitting && !optionsLoading && !optionsFailed

    return (
        <>
            <section className="bg-bayan-ink py-14 text-white sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <PageBreadcrumb
                        items={[
                            { label: t.services.breadcrumbHome, to: "/" },
                            { label: copy.breadcrumbCommunity },
                            { label: copy.directory.breadcrumb, to: DIRECTORY_PATH },
                            { label: page.breadcrumb },
                        ]}
                    />
                    <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-bayan-gold">{page.eyebrow}</p>
                    <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-normal sm:text-4xl">{page.heading}</h1>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-white/76">{page.intro}</p>
                </div>
            </section>

            <section className="bg-bayan-mist py-14 sm:py-16">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
                        {submitted ? (
                            <SuccessCard result={submitted} copy={page} onAnother={() => setSubmitted(null)} />
                        ) : (
                            <form ref={formRef} onSubmit={handleSubmit} className="relative space-y-6" noValidate>
                                {/* Honeypot: real visitors never see or fill this, and the request always sends `website` empty. */}
                                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                                    <label>
                                        Website
                                        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                                    </label>
                                </div>

                                {optionsFailed && (
                                    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                                        <TriangleAlert className="h-5 w-5 shrink-0" />
                                        <p className="min-w-0 flex-1 basis-56">{page.optionsFailed}</p>
                                        <button type="button" onClick={reloadOptions} className="rounded-md bg-white px-3 py-2 text-xs font-black ring-1 ring-bayan-red/30 hover:bg-red-100">
                                            {page.retry}
                                        </button>
                                    </div>
                                )}

                                <SectionCard number={1} title={page.sections.about}>
                                    <div className="sm:col-span-2">
                                        <Field id="biz-name" label={f.businessName} tag={f.required} required error={errors.businessName}>
                                            <input {...textProps("businessName", "biz-name")} type="text" maxLength={MAX.businessName} placeholder={f.businessNamePlaceholder} className={inputClass} />
                                        </Field>
                                    </div>
                                    <Field id="biz-category" label={f.category} tag={f.required} required error={errors.category}>
                                        <select {...textProps("category", "biz-category")} disabled={optionsLoading} className={inputClass}>
                                            <option value="" disabled>
                                                {f.categoryPlaceholder}
                                            </option>
                                            {categories.map(({ slug, name }) => (
                                                <option key={slug} value={slug}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field id="biz-products" label={f.productsServices} tag={f.optional} error={errors.productsServices}>
                                        <input
                                            {...textProps("productsServices", "biz-products")}
                                            type="text"
                                            maxLength={MAX.productsServices}
                                            placeholder={f.productsServicesPlaceholder}
                                            className={inputClass}
                                        />
                                    </Field>
                                    <div className="sm:col-span-2">
                                        <Field id="biz-description" label={f.description} tag={f.required} required error={errors.description}>
                                            <textarea
                                                {...textProps("description", "biz-description")}
                                                rows={4}
                                                maxLength={MAX.description}
                                                placeholder={f.descriptionPlaceholder}
                                                className={`${inputClass} resize-y`}
                                            />
                                        </Field>
                                        <p className="mt-1 text-right text-xs font-semibold text-slate-400" aria-live="off">
                                            {values.description.length}/{MAX.description}
                                        </p>
                                    </div>
                                </SectionCard>

                                <SectionCard number={2} title={page.sections.location}>
                                    <Field id="biz-barangay" label={f.barangay} tag={f.required} required error={errors.barangay}>
                                        <select {...textProps("barangay", "biz-barangay")} disabled={optionsLoading} className={inputClass}>
                                            <option value="" disabled>
                                                {f.barangayPlaceholder}
                                            </option>
                                            {barangays.map((name) => (
                                                <option key={name} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field id="biz-address" label={f.address} tag={f.required} required error={errors.address}>
                                        <input {...textProps("address", "biz-address")} type="text" maxLength={MAX.address} placeholder={f.addressPlaceholder} className={inputClass} />
                                    </Field>
                                    <div className="space-y-3 sm:col-span-2">
                                        <p className="text-sm font-black text-bayan-ink">{f.serviceArea}</p>
                                        <Checkbox id="biz-home" checked={values.homeBased} onChange={setFlag("homeBased")} error={errors.homeBased}>
                                            {f.homeBased}
                                        </Checkbox>
                                        <Checkbox
                                            id="biz-delivers"
                                            checked={values.deliversToOtherBarangays}
                                            onChange={setFlag("deliversToOtherBarangays")}
                                            error={errors.deliversToOtherBarangays}
                                        >
                                            {f.deliversTo}
                                        </Checkbox>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="min-w-0 basis-64 flex-1">
                                                <p className="text-sm font-black text-bayan-ink">{m.heading}</p>
                                                <p className="mt-1 text-sm leading-6 text-slate-600">{m.intro}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleUseMyLocation}
                                                disabled={locating}
                                                className="inline-flex items-center gap-2 rounded-md bg-bayan-mist px-4 py-2.5 text-sm font-black text-bayan-blue ring-1 ring-slate-200 transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
                                            >
                                                {locating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
                                                {locating ? m.locating : m.useMyLocation}
                                            </button>
                                        </div>

                                        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                                            <div className="isolate h-80 bg-slate-100 sm:h-96">
                                                <Suspense fallback={<div className="grid h-full place-items-center text-sm font-semibold text-slate-500">{m.loading}</div>}>
                                                    <BusinessMap draft={pin} pickEnabled onPick={handlePick} focus={focus} />
                                                </Suspense>
                                            </div>
                                        </div>

                                        <div
                                            role={pinOutside || errors.location ? "alert" : undefined}
                                            data-error={errors.location ? true : undefined}
                                            tabIndex={errors.location ? -1 : undefined}
                                            className={`mt-3 flex items-start justify-between gap-3 rounded-md px-4 py-3 text-sm font-semibold ${
                                                pinOutside || errors.location
                                                    ? "border border-bayan-red/40 bg-red-50 text-bayan-red"
                                                    : pin
                                                      ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                                                      : "bg-bayan-mist text-slate-600"
                                            }`}
                                        >
                                            <div className="flex min-w-0 items-start gap-2">
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                                <div>
                                                    <p>{errors.location ?? (pinOutside ? m.outside : locateFailed && !pin ? m.locationDenied : pin ? m.locationSet : m.pickHint)}</p>
                                                    {pin && (
                                                        <p className="mt-0.5 font-mono text-xs">
                                                            {pin[0].toFixed(5)}, {pin[1].toFixed(5)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {pin && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPin(null)
                                                        clearError("location")
                                                    }}
                                                    className="shrink-0 text-xs font-black underline underline-offset-2"
                                                >
                                                    {m.clearPin}
                                                </button>
                                            )}
                                        </div>

                                        <fieldset className="mt-5">
                                            <legend className="text-sm font-black text-bayan-ink">{m.precisionLabel}</legend>
                                            <div className="mt-2 grid gap-2 sm:grid-cols-3">
                                                {PRECISION_OPTIONS.map((option) => (
                                                    <label
                                                        key={option}
                                                        className="flex cursor-pointer items-start gap-2.5 rounded-md border border-slate-300 bg-white px-3.5 py-3 transition has-checked:border-bayan-blue has-checked:bg-blue-50"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="pin-precision"
                                                            value={option}
                                                            checked={precision === option}
                                                            onChange={() => setPrecision(option)}
                                                            className="mt-1 h-4 w-4 shrink-0 accent-bayan-blue"
                                                        />
                                                        <span>
                                                            <span className="block text-sm font-black text-bayan-ink">{m.precision[option].title}</span>
                                                            <span className="mt-0.5 block text-xs leading-5 font-semibold text-slate-500">{m.precision[option].body}</span>
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                </SectionCard>

                                <SectionCard number={3} title={page.sections.contact}>
                                    <Field id="biz-owner" label={f.ownerName} tag={f.required} required error={errors.ownerName}>
                                        <input
                                            {...textProps("ownerName", "biz-owner")}
                                            type="text"
                                            autoComplete="name"
                                            maxLength={MAX.ownerName}
                                            placeholder={f.ownerNamePlaceholder}
                                            className={inputClass}
                                        />
                                        <div className="mt-2.5">
                                            <Checkbox id="biz-show-owner" checked={values.showOwnerName} onChange={setFlag("showOwnerName")} error={errors.showOwnerName}>
                                                {f.showOwner}
                                            </Checkbox>
                                        </div>
                                    </Field>
                                    <Field id="biz-phone" label={f.phone} tag={f.required} required error={errors.phone}>
                                        <input
                                            {...textProps("phone", "biz-phone")}
                                            type="tel"
                                            autoComplete="tel"
                                            maxLength={MAX.phone}
                                            placeholder={f.phonePlaceholder}
                                            className={inputClass}
                                        />
                                    </Field>
                                    <Field id="biz-email" label={f.email} tag={f.optional} error={errors.email}>
                                        <input {...textProps("email", "biz-email")} type="email" autoComplete="email" placeholder={f.emailPlaceholder} className={inputClass} />
                                    </Field>
                                    <Field id="biz-online" label={f.online} tag={f.optional} error={errors.online}>
                                        <input {...textProps("online", "biz-online")} type="text" maxLength={MAX.online} placeholder={f.onlinePlaceholder} className={inputClass} />
                                    </Field>
                                </SectionCard>

                                <SectionCard number={4} title={page.sections.details}>
                                    <div className="sm:col-span-2">
                                        <Field id="biz-hours" label={f.hours} tag={f.optional} error={errors.hours}>
                                            <input {...textProps("hours", "biz-hours")} type="text" maxLength={MAX.hours} placeholder={f.hoursPlaceholder} className={inputClass} />
                                        </Field>
                                    </div>
                                    <Field id="biz-employees" label={f.employees} tag={f.optional} error={errors.employees}>
                                        <select {...textProps("employees", "biz-employees")} className={inputClass}>
                                            <option value="">{f.employeesPlaceholder}</option>
                                            {EMPLOYEE_OPTIONS.map((option, index) => (
                                                <option key={option} value={option}>
                                                    {f.employeesOptions[index] ?? option}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field id="biz-year" label={f.yearStarted} tag={f.optional} error={errors.yearStarted}>
                                        <input
                                            {...textProps("yearStarted", "biz-year")}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={4}
                                            placeholder={f.yearStartedPlaceholder}
                                            className={inputClass}
                                        />
                                    </Field>
                                </SectionCard>

                                <SectionCard number={5} title={page.sections.photos}>
                                    <div>
                                        <p className="text-sm font-black text-bayan-ink">{f.photoLogo}</p>
                                        {logo ? (
                                            <div
                                                data-error={errors.logo ? true : undefined}
                                                tabIndex={errors.logo ? -1 : undefined}
                                                className={`relative mt-1.5 flex items-center gap-3 rounded-lg border bg-bayan-mist p-2.5 ${errors.logo ? "border-bayan-red" : "border-slate-200"}`}
                                            >
                                                <img src={logo.url} alt="" className="h-16 w-16 rounded-md object-cover" />
                                                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-600">{logo.file.name}</p>
                                                <button
                                                    type="button"
                                                    onClick={removeLogo}
                                                    aria-label={`${f.removePhoto}: ${logo.file.name}`}
                                                    className="grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-bayan-red"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="biz-logo"
                                                data-error={errors.logo ? true : undefined}
                                                className={`mt-1.5 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed bg-bayan-mist px-4 py-6 text-center transition hover:border-bayan-blue hover:bg-blue-50 ${
                                                    errors.logo ? "border-bayan-red" : "border-slate-300"
                                                }`}
                                            >
                                                <Upload className="h-6 w-6 text-bayan-blue" />
                                                <span className="text-sm font-black text-bayan-blue">{f.chooseFile}</span>
                                                <span className="text-xs font-semibold text-slate-500">{f.photoHint}</span>
                                                <input
                                                    id="biz-logo"
                                                    type="file"
                                                    accept={PHOTO_TYPES.join(",")}
                                                    className="sr-only"
                                                    onChange={(event) => {
                                                        handleLogo(event.target.files)
                                                        event.target.value = ""
                                                    }}
                                                />
                                            </label>
                                        )}
                                        <FieldError id="biz-logo-error" message={errors.logo} />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                                            <p className="text-sm font-black text-bayan-ink">{f.galleryLabel}</p>
                                            <p className="text-xs font-bold text-slate-400">{f.galleryCount(gallery.length, MAX_GALLERY)}</p>
                                        </div>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">{f.galleryHint}</p>

                                        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                            {gallery.map((photo) => (
                                                <li key={photo.id} className="relative">
                                                    <div
                                                        data-error={photo.error ? true : undefined}
                                                        tabIndex={photo.error ? -1 : undefined}
                                                        className={`aspect-square overflow-hidden rounded-lg border-2 bg-bayan-mist ${photo.error ? "border-bayan-red" : "border-slate-200"}`}
                                                    >
                                                        <img src={photo.url} alt={photo.file.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryPhoto(photo.id)}
                                                        aria-label={`${f.removePhoto}: ${photo.file.name}`}
                                                        className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 hover:text-bayan-red"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                    {photo.error && <p className="mt-1 text-xs font-bold leading-4 text-bayan-red">{photo.error}</p>}
                                                </li>
                                            ))}
                                            {gallery.length < MAX_GALLERY && (
                                                <li>
                                                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 bg-bayan-mist text-center transition hover:border-bayan-blue hover:bg-blue-50">
                                                        <ImagePlus className="h-6 w-6 text-bayan-blue" />
                                                        <span className="px-2 text-xs font-black text-bayan-blue">{f.addPhoto}</span>
                                                        <input
                                                            type="file"
                                                            accept={PHOTO_TYPES.join(",")}
                                                            multiple
                                                            className="sr-only"
                                                            onChange={(event) => {
                                                                handleGallery(event.target.files)
                                                                event.target.value = ""
                                                            }}
                                                        />
                                                    </label>
                                                </li>
                                            )}
                                        </ul>
                                        <p className="mt-3 text-xs font-semibold text-slate-500">{f.photoHint}</p>
                                        <FieldError id="biz-gallery-error" message={errors.gallery} />
                                    </div>
                                </SectionCard>

                                <SectionCard number={6} title={page.sections.consent}>
                                    <div className="space-y-3 sm:col-span-2">
                                        <Checkbox id="consent-publish" checked={values.consentPublish} onChange={setFlag("consentPublish")} error={errors.consentPublish}>
                                            {page.consent.publish}
                                        </Checkbox>
                                        <Checkbox id="consent-privacy" checked={values.consentPrivacy} onChange={setFlag("consentPrivacy")} error={errors.consentPrivacy}>
                                            {page.consent.privacy}
                                        </Checkbox>
                                        <Checkbox id="consent-accurate" checked={values.consentAccurate} onChange={setFlag("consentAccurate")} error={errors.consentAccurate}>
                                            {page.consent.accurate}
                                        </Checkbox>
                                    </div>
                                </SectionCard>

                                {banner && (
                                    <div role="alert" className="flex items-start gap-3 rounded-lg border border-bayan-red/40 bg-red-50 px-4 py-3 text-sm font-semibold text-bayan-red">
                                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                                        <p>{banner}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="inline-flex items-center gap-2 rounded-md bg-bayan-blue px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-bayan-blue"
                                >
                                    {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                                    {submitting ? page.submitting : page.submit}
                                    {!submitting && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>
                        )}

                        <aside className="space-y-4 lg:sticky lg:top-36">
                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-slate-500">
                                    <ListChecks className="h-4 w-4 text-bayan-blue" /> {page.sidebar.afterHeading}
                                </h2>
                                <ol className="mt-4 space-y-3">
                                    {page.sidebar.after.map((step, index) => (
                                        <li key={step} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-black text-bayan-blue">{index + 1}</span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white p-5">
                                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-slate-500">
                                    <CheckCircle2 className="h-4 w-4 text-bayan-green" /> {page.sidebar.publishHeading}
                                </h2>
                                <ul className="mt-4 space-y-2">
                                    {page.sidebar.publish.map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bayan-green" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <h3 className="mt-5 flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-slate-500">
                                    <EyeOff className="h-4 w-4 text-bayan-red" /> {page.sidebar.notHeading}
                                </h3>
                                <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-700">
                                    <Lock className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-400" /> {page.sidebar.notBody}
                                </p>
                            </div>

                            <div className="rounded-lg bg-bayan-ink p-5 text-white">
                                <h2 className="text-base font-black">{page.sidebar.helpHeading}</h2>
                                <p className="mt-2 text-sm leading-6 text-white/76">{page.sidebar.helpBody}</p>
                                <Link to="/services/business-and-permits" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-bayan-gold hover:gap-2">
                                    {page.sidebar.helpLink} <ArrowRight className="h-4 w-4 transition-all" />
                                </Link>
                            </div>

                            <Link to={DIRECTORY_PATH} className="inline-flex items-center gap-2 text-sm font-bold text-bayan-blue hover:gap-3">
                                <ArrowLeft className="h-4 w-4 transition-all" /> {page.backToDirectory}
                            </Link>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddBusinessPage
