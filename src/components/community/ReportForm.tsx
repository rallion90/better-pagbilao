import { Crosshair, ImagePlus, LoaderCircle, MapPin, Send, TriangleAlert, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import type { CommunityReportingCopy } from "../../i18n/communityReporting"
import { MAX_PHOTO_BYTES, MAX_PHOTOS, PHOTO_TYPES, categoryMeta, isWithinPagbilao } from "../../lib/communityReports"
import type { LatLng } from "../../lib/communityReports"
import { IssueApiError } from "../../lib/issuesApi"
import type { IssueCategory, IssueSubmission } from "../../types/issues"

type ReportFormProps = {
    copy: CommunityReportingCopy
    categories: IssueCategory[]
    barangays: string[]
    optionsLoading: boolean
    optionsFailed: boolean
    onReloadOptions: () => void
    position: LatLng | null
    locating: boolean
    locateFailed: boolean
    onUseMyLocation: () => void
    onClearPin: () => void
    /** Rejects with IssueApiError. The form shows 422/429/network/5xx itself; the page reacts to 403 and success. */
    onSubmit: (submission: IssueSubmission) => Promise<void>
}

type FieldKey = "category" | "title" | "description" | "barangay" | "location" | "locationText" | "photos" | "reporterName" | "reporterEmail" | "reporterPhone"
type FieldErrors = Partial<Record<FieldKey, string>>

type PhotoItem = { file: File; url: string }

const TITLE_MAX = 150
const DESCRIPTION_MIN = 10
const DESCRIPTION_MAX = 3000
const LOCATION_TEXT_MAX = 255
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
    "mt-2 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-bayan-ink placeholder:font-medium placeholder:text-slate-400 focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25"

// Server field names ("photos.0", "latitude") folded onto the field that renders their message.
function toFieldKey(serverField: string): FieldKey | null {
    const base = serverField.replace(/(\.\d+|\[\d*\])+$/, "")
    if (base === "latitude" || base === "longitude") return "location"
    const known: FieldKey[] = ["category", "title", "description", "barangay", "locationText", "photos", "reporterName", "reporterEmail", "reporterPhone"]
    return known.find((key) => key === base) ?? null
}

const FieldError = ({ id, message }: { id: string; message?: string }) =>
    message ? (
        <p id={id} className="mt-2 text-xs font-bold text-bayan-red">
            {message}
        </p>
    ) : null

const ReportForm = ({
    copy,
    categories,
    barangays,
    optionsLoading,
    optionsFailed,
    onReloadOptions,
    position,
    locating,
    locateFailed,
    onUseMyLocation,
    onClearPin,
    onSubmit,
}: ReportFormProps) => {
    const form = copy.form
    const [category, setCategory] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [barangay, setBarangay] = useState("")
    const [locationText, setLocationText] = useState("")
    const [reporterName, setReporterName] = useState("")
    const [reporterEmail, setReporterEmail] = useState("")
    const [reporterPhone, setReporterPhone] = useState("")
    const [photos, setPhotos] = useState<PhotoItem[]>([])
    const [errors, setErrors] = useState<FieldErrors>({})
    const [submitting, setSubmitting] = useState(false)
    const [banner, setBanner] = useState<string | null>(null)

    const photosRef = useRef<PhotoItem[]>([])
    useEffect(() => {
        photosRef.current = photos
    }, [photos])
    useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), [])

    const locationError = errors.location ?? (position && !isWithinPagbilao(position) ? form.errors.outside : undefined)

    const clearError = (key: FieldKey) => setErrors((current) => ({ ...current, [key]: undefined }))

    const handlePhotos = (files: FileList | null) => {
        if (!files || files.length === 0) return
        const room = MAX_PHOTOS - photos.length
        const accepted: PhotoItem[] = []
        let problem: string | undefined

        for (const file of Array.from(files)) {
            if (!PHOTO_TYPES.includes(file.type)) problem = form.photoBadType
            else if (file.size > MAX_PHOTO_BYTES) problem = form.photoTooLarge
            else if (accepted.length >= room) problem = form.photoTooMany
            else accepted.push({ file, url: URL.createObjectURL(file) })
        }

        setPhotos((current) => [...current, ...accepted])
        setErrors((current) => ({ ...current, photos: problem }))
    }

    const removePhoto = (url: string) => {
        URL.revokeObjectURL(url)
        setPhotos((current) => current.filter((photo) => photo.url !== url))
        clearError("photos")
    }

    const validate = (): FieldErrors => {
        const next: FieldErrors = {}
        if (!category) next.category = form.errors.category
        if (!title.trim()) next.title = form.errors.title
        if (description.trim().length < DESCRIPTION_MIN) next.description = form.errors.description
        if (!barangay) next.barangay = form.errors.barangay
        if (position && !isWithinPagbilao(position)) next.location = form.errors.outside
        if (reporterEmail.trim() && !EMAIL_PATTERN.test(reporterEmail.trim())) next.reporterEmail = form.errors.email
        return next
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (submitting) return

        const next = validate()
        setErrors(next)
        setBanner(null)
        if (Object.keys(next).length > 0) {
            setBanner(form.submitErrors.fixFields)
            return
        }

        const submission: IssueSubmission = {
            title: title.trim(),
            description: description.trim(),
            category,
            barangay,
            locationText: locationText.trim(),
            reporterName: reporterName.trim(),
            reporterEmail: reporterEmail.trim(),
            reporterPhone: reporterPhone.trim(),
            photos: photos.map((photo) => photo.file),
        }
        if (position) {
            submission.latitude = Number(position[0].toFixed(6))
            submission.longitude = Number(position[1].toFixed(6))
        }

        setSubmitting(true)
        try {
            await onSubmit(submission)
        } catch (error) {
            if (!(error instanceof IssueApiError)) {
                setBanner(form.submitErrors.server)
            } else if (error.kind === "validation") {
                const serverErrors: FieldErrors = {}
                for (const [field, messages] of Object.entries(error.fieldErrors)) {
                    const key = toFieldKey(field)
                    if (key && !serverErrors[key]) serverErrors[key] = messages.join(" ")
                }
                setErrors(serverErrors)
                setBanner(Object.keys(serverErrors).length > 0 ? form.submitErrors.fixFields : error.message || form.submitErrors.fixFields)
            } else if (error.kind === "rate-limited") {
                setBanner(form.submitErrors.rateLimited)
            } else if (error.kind === "network") {
                setBanner(form.submitErrors.network)
            } else if (error.kind !== "disabled") {
                setBanner(form.submitErrors.server)
            }
        } finally {
            setSubmitting(false)
        }
    }

    const canSubmit = !submitting && !optionsLoading && !optionsFailed

    return (
        <form onSubmit={handleSubmit} noValidate className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
            <h2 className="text-2xl font-black">{form.heading}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{form.subheading}</p>

            {/* Honeypot: real visitors never see or fill this, and the request always sends `website` empty. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                <label>
                    Website
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                </label>
            </div>

            {optionsFailed && (
                <div role="alert" className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-bayan-red/40 bg-red-50 p-4 text-sm font-semibold text-bayan-red">
                    <TriangleAlert className="h-5 w-5 shrink-0" />
                    <p className="min-w-0 flex-1 basis-56">{form.optionsFailed}</p>
                    <button type="button" onClick={onReloadOptions} className="rounded-md bg-white px-3 py-2 text-xs font-black ring-1 ring-bayan-red/30 hover:bg-red-100">
                        {form.retry}
                    </button>
                </div>
            )}

            <fieldset className="mt-6" aria-describedby={errors.category ? "report-category-error" : undefined}>
                <legend className="text-sm font-black">{form.categoryLabel}</legend>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                    {optionsLoading
                        ? Array.from({ length: 8 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-lg bg-slate-100" />)
                        : categories.map(({ slug, name }) => {
                              const { Icon, color } = categoryMeta(slug)
                              const active = category === slug
                              return (
                                  <button
                                      key={slug}
                                      type="button"
                                      aria-pressed={active}
                                      onClick={() => {
                                          setCategory(slug)
                                          clearError("category")
                                      }}
                                      className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center text-xs font-black leading-4 transition ${
                                          active
                                              ? "border-bayan-blue bg-blue-50 text-bayan-blue ring-2 ring-bayan-blue/25"
                                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                      }`}
                                  >
                                      <span className={`grid h-9 w-9 place-items-center rounded-md ${color}`}>
                                          <Icon className="h-4.5 w-4.5" />
                                      </span>
                                      {name}
                                  </button>
                              )
                          })}
                </div>
                <FieldError id="report-category-error" message={errors.category} />
            </fieldset>

            <div className="mt-6">
                <label htmlFor="report-title" className="text-sm font-black">
                    {form.titleLabel}
                </label>
                <input
                    id="report-title"
                    type="text"
                    value={title}
                    maxLength={TITLE_MAX}
                    placeholder={form.titlePlaceholder}
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? "report-title-error" : undefined}
                    onChange={(event) => {
                        setTitle(event.target.value)
                        clearError("title")
                    }}
                    className={inputClass}
                />
                <FieldError id="report-title-error" message={errors.title} />
            </div>

            <div className="mt-5">
                <label htmlFor="report-description" className="text-sm font-black">
                    {form.descriptionLabel}
                </label>
                <textarea
                    id="report-description"
                    value={description}
                    maxLength={DESCRIPTION_MAX}
                    rows={4}
                    placeholder={form.descriptionPlaceholder}
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={errors.description ? "report-description-error" : undefined}
                    onChange={(event) => {
                        setDescription(event.target.value)
                        clearError("description")
                    }}
                    className={`${inputClass} resize-y leading-6`}
                />
                <div className="mt-1 flex items-start justify-between gap-3">
                    <p id="report-description-error" className="text-xs font-bold text-bayan-red">
                        {errors.description}
                    </p>
                    <p className="shrink-0 text-xs font-semibold text-slate-400" aria-live="off">
                        {description.length}/{DESCRIPTION_MAX}
                    </p>
                </div>
            </div>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="report-barangay" className="text-sm font-black">
                        {form.barangayLabel}
                    </label>
                    <select
                        id="report-barangay"
                        value={barangay}
                        disabled={optionsLoading}
                        aria-invalid={Boolean(errors.barangay)}
                        onChange={(event) => {
                            setBarangay(event.target.value)
                            clearError("barangay")
                        }}
                        className={inputClass}
                    >
                        <option value="">{form.barangayPlaceholder}</option>
                        {barangays.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <FieldError id="report-barangay-error" message={errors.barangay} />
                </div>

                <div>
                    <p className="text-sm font-black">{form.locationLabel}</p>
                    <button
                        type="button"
                        onClick={onUseMyLocation}
                        disabled={locating}
                        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-bold text-bayan-ink transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70"
                    >
                        {locating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4 text-bayan-blue" />}
                        {locating ? form.locating : form.useMyLocation}
                    </button>
                </div>
            </div>

            <div
                className={`mt-3 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-semibold ${
                    locationError
                        ? "border-bayan-red/40 bg-red-50 text-bayan-red"
                        : position
                          ? "border-emerald-200 bg-emerald-50 text-bayan-green"
                          : "border-slate-200 bg-bayan-mist text-slate-600"
                }`}
                role={locationError ? "alert" : undefined}
            >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                    <p>{locationError ?? (locateFailed && !position ? form.locationDenied : position ? form.locationSet : form.locationHint)}</p>
                    {position && (
                        <p className="mt-0.5 text-xs font-bold opacity-80">
                            {position[0].toFixed(5)}, {position[1].toFixed(5)}
                        </p>
                    )}
                </div>
                {position && (
                    <button type="button" onClick={onClearPin} className="shrink-0 text-xs font-black underline underline-offset-2">
                        {form.clearPin}
                    </button>
                )}
            </div>

            <div className="mt-5">
                <label htmlFor="report-location-text" className="text-sm font-black">
                    {form.locationTextLabel} <span className="font-semibold text-slate-400">· {form.optional}</span>
                </label>
                <input
                    id="report-location-text"
                    type="text"
                    value={locationText}
                    maxLength={LOCATION_TEXT_MAX}
                    placeholder={form.locationTextPlaceholder}
                    onChange={(event) => {
                        setLocationText(event.target.value)
                        clearError("locationText")
                    }}
                    className={inputClass}
                />
                <FieldError id="report-location-text-error" message={errors.locationText} />
            </div>

            <div className="mt-6">
                <p className="text-sm font-black">
                    {form.photoLabel} <span className="font-semibold text-slate-400">· {form.optional}</span>
                </p>
                {photos.length > 0 && (
                    <ul className="mt-2 grid gap-2">
                        {photos.map((photo) => (
                            <li key={photo.url} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-bayan-mist p-2.5">
                                <img src={photo.url} alt="" className="h-16 w-16 rounded-md object-cover" />
                                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-600">{photo.file.name}</p>
                                <button
                                    type="button"
                                    onClick={() => removePhoto(photo.url)}
                                    aria-label={`${form.removePhoto}: ${photo.file.name}`}
                                    className="grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-bayan-red"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {photos.length < MAX_PHOTOS && (
                    <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-500 transition hover:border-bayan-blue hover:bg-blue-50/40">
                        <ImagePlus className="h-5 w-5 shrink-0 text-bayan-blue" />
                        <span>{form.photoHint}</span>
                        <input
                            type="file"
                            accept={PHOTO_TYPES.join(",")}
                            multiple
                            className="sr-only"
                            onChange={(event) => {
                                handlePhotos(event.target.files)
                                event.target.value = ""
                            }}
                        />
                    </label>
                )}
                <FieldError id="report-photos-error" message={errors.photos} />
            </div>

            <div className="mt-6 rounded-lg bg-bayan-mist p-4">
                <p className="text-sm font-black">
                    {form.contactHeading} <span className="font-semibold text-slate-400">· {form.optional}</span>
                </p>
                <div className="mt-1 grid gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="report-name" className="sr-only">
                            {form.nameLabel}
                        </label>
                        <input
                            id="report-name"
                            type="text"
                            autoComplete="name"
                            value={reporterName}
                            placeholder={form.nameLabel}
                            onChange={(event) => {
                                setReporterName(event.target.value)
                                clearError("reporterName")
                            }}
                            className={inputClass}
                        />
                        <FieldError id="report-name-error" message={errors.reporterName} />
                    </div>
                    <div>
                        <label htmlFor="report-email" className="sr-only">
                            {form.emailLabel}
                        </label>
                        <input
                            id="report-email"
                            type="email"
                            autoComplete="email"
                            value={reporterEmail}
                            placeholder={form.emailLabel}
                            aria-invalid={Boolean(errors.reporterEmail)}
                            onChange={(event) => {
                                setReporterEmail(event.target.value)
                                clearError("reporterEmail")
                            }}
                            className={inputClass}
                        />
                        <FieldError id="report-email-error" message={errors.reporterEmail} />
                    </div>
                    <div>
                        <label htmlFor="report-phone" className="sr-only">
                            {form.phoneLabel}
                        </label>
                        <input
                            id="report-phone"
                            type="tel"
                            autoComplete="tel"
                            value={reporterPhone}
                            placeholder={form.phoneLabel}
                            onChange={(event) => {
                                setReporterPhone(event.target.value)
                                clearError("reporterPhone")
                            }}
                            className={inputClass}
                        />
                        <FieldError id="report-phone-error" message={errors.reporterPhone} />
                    </div>
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{form.privacy}</p>
            </div>

            {banner && (
                <div role="alert" className="mt-6 flex items-start gap-3 rounded-lg border border-bayan-red/40 bg-red-50 px-4 py-3 text-sm font-semibold text-bayan-red">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{banner}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-bayan-blue px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-bayan-blue/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-bayan-blue"
            >
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? form.submitting : form.submit}
            </button>
        </form>
    )
}

export default ReportForm
