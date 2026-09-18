import { Crosshair, ImagePlus, LoaderCircle, MapPin, Send, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import type { CommunityReportingCopy } from "../../i18n/communityReporting"
import { BARANGAYS, CATEGORY_IDS, CATEGORY_META, isWithinPagbilao } from "../../lib/communityReports"
import type { CategoryId, LatLng } from "../../lib/communityReports"

export type ReportFormValues = {
    category: CategoryId
    title: string
    description: string
    barangay: string
    position: LatLng
}

type ReportFormProps = {
    copy: CommunityReportingCopy
    position: LatLng | null
    locating: boolean
    locateFailed: boolean
    onUseMyLocation: () => void
    onClearPin: () => void
    onSubmit: (values: ReportFormValues) => void
}

type FieldErrors = Partial<Record<"category" | "title" | "description" | "barangay" | "location", string>>

const MAX_PHOTO_BYTES = 5 * 1024 * 1024

const inputClass =
    "mt-2 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-bayan-ink placeholder:font-medium placeholder:text-slate-400 focus:border-bayan-blue focus:outline-none focus:ring-2 focus:ring-bayan-blue/25"

const ReportForm = ({ copy, position, locating, locateFailed, onUseMyLocation, onClearPin, onSubmit }: ReportFormProps) => {
    const form = copy.form
    const [category, setCategory] = useState<CategoryId | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [barangay, setBarangay] = useState("")
    const [photo, setPhoto] = useState<{ url: string; name: string } | null>(null)
    const [photoError, setPhotoError] = useState(false)
    const [errors, setErrors] = useState<FieldErrors>({})

    useEffect(() => {
        if (!photo) return
        return () => URL.revokeObjectURL(photo.url)
    }, [photo])

    const locationError = errors.location ?? (position && !isWithinPagbilao(position) ? form.errors.outside : undefined)

    const handlePhoto = (file: File | undefined) => {
        if (!file) return
        if (file.size > MAX_PHOTO_BYTES) {
            setPhotoError(true)
            return
        }
        setPhotoError(false)
        setPhoto({ url: URL.createObjectURL(file), name: file.name })
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        const next: FieldErrors = {}
        if (!category) next.category = form.errors.category
        if (title.trim().length < 5) next.title = form.errors.title
        if (description.trim().length < 15) next.description = form.errors.description
        if (!barangay) next.barangay = form.errors.barangay
        if (!position) next.location = form.errors.location
        else if (!isWithinPagbilao(position)) next.location = form.errors.outside

        setErrors(next)
        if (Object.keys(next).length > 0 || !category || !position) return

        onSubmit({ category, title: title.trim(), description: description.trim(), barangay, position })
    }

    const clearError = (key: keyof FieldErrors) => setErrors((current) => ({ ...current, [key]: undefined }))

    return (
        <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
            <h2 className="text-2xl font-black">{form.heading}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{form.subheading}</p>

            <fieldset className="mt-6">
                <legend className="text-sm font-black">{form.categoryLabel}</legend>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {CATEGORY_IDS.map((id) => {
                        const { Icon, color } = CATEGORY_META[id]
                        const active = category === id
                        return (
                            <button
                                key={id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                    setCategory(id)
                                    clearError("category")
                                }}
                                className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center text-xs font-black leading-4 transition ${
                                    active
                                        ? "border-bayan-blue bg-blue-50 text-bayan-blue ring-2 ring-bayan-blue/25"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                <span className={`grid h-9 w-9 place-items-center rounded-md ${color}`}>
                                    <Icon className="h-[18px] w-[18px]" />
                                </span>
                                {copy.categories[id]}
                            </button>
                        )
                    })}
                </div>
                {errors.category && <p className="mt-2 text-xs font-bold text-bayan-red">{errors.category}</p>}
            </fieldset>

            <div className="mt-6">
                <label htmlFor="report-title" className="text-sm font-black">
                    {form.titleLabel}
                </label>
                <input
                    id="report-title"
                    type="text"
                    value={title}
                    maxLength={90}
                    placeholder={form.titlePlaceholder}
                    onChange={(event) => {
                        setTitle(event.target.value)
                        clearError("title")
                    }}
                    className={inputClass}
                />
                {errors.title && <p className="mt-2 text-xs font-bold text-bayan-red">{errors.title}</p>}
            </div>

            <div className="mt-5">
                <label htmlFor="report-description" className="text-sm font-black">
                    {form.descriptionLabel}
                </label>
                <textarea
                    id="report-description"
                    value={description}
                    maxLength={600}
                    rows={4}
                    placeholder={form.descriptionPlaceholder}
                    onChange={(event) => {
                        setDescription(event.target.value)
                        clearError("description")
                    }}
                    className={`${inputClass} resize-y leading-6`}
                />
                <div className="mt-1 flex items-start justify-between gap-3">
                    <p className="text-xs font-bold text-bayan-red">{errors.description}</p>
                    <p className="shrink-0 text-xs font-semibold text-slate-400">{description.length}/600</p>
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
                        onChange={(event) => {
                            setBarangay(event.target.value)
                            clearError("barangay")
                        }}
                        className={inputClass}
                    >
                        <option value="">{form.barangayPlaceholder}</option>
                        {BARANGAYS.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                    {errors.barangay && <p className="mt-2 text-xs font-bold text-bayan-red">{errors.barangay}</p>}
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

            <div className="mt-6">
                <p className="text-sm font-black">
                    {form.photoLabel} <span className="font-semibold text-slate-400">· {form.optional}</span>
                </p>
                {photo ? (
                    <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-bayan-mist p-2.5">
                        <img src={photo.url} alt="" className="h-16 w-16 rounded-md object-cover" />
                        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-600">{photo.name}</p>
                        <button
                            type="button"
                            onClick={() => setPhoto(null)}
                            aria-label={form.removePhoto}
                            className="grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-bayan-red"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-500 transition hover:border-bayan-blue hover:bg-blue-50/40">
                        <ImagePlus className="h-5 w-5 shrink-0 text-bayan-blue" />
                        <span>{form.photoHint}</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png"
                            className="sr-only"
                            onChange={(event) => {
                                handlePhoto(event.target.files?.[0])
                                event.target.value = ""
                            }}
                        />
                    </label>
                )}
                {photoError && <p className="mt-2 text-xs font-bold text-bayan-red">{form.photoTooLarge}</p>}
            </div>

            <div className="mt-6 rounded-lg bg-bayan-mist p-4">
                <p className="text-sm font-black">
                    {form.contactHeading} <span className="font-semibold text-slate-400">· {form.optional}</span>
                </p>
                <div className="mt-1 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="report-name" className="sr-only">
                            {form.nameLabel}
                        </label>
                        <input id="report-name" type="text" autoComplete="name" placeholder={form.nameLabel} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="report-contact" className="sr-only">
                            {form.contactLabel}
                        </label>
                        <input id="report-contact" type="text" autoComplete="email" placeholder={form.contactLabel} className={inputClass} />
                    </div>
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{form.privacy}</p>
            </div>

            <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-bayan-blue px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-bayan-blue/30"
            >
                <Send className="h-4 w-4" /> {form.submit}
            </button>
        </form>
    )
}

export default ReportForm
