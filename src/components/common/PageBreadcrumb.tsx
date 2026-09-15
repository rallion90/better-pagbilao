import { ChevronRight } from "lucide-react"
import { Link } from "react-router"
import { useEffect } from "react"

export type BreadcrumbItem = {
    label: string
    to?: string
}

const SITE_URL = "https://betterpagbilao.org"

const PageBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
    const itemsKey = items.map((item) => `${item.label}|${item.to ?? ""}`).join(">>")

    useEffect(() => {
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.label,
                ...(item.to ? { item: `${SITE_URL}${item.to}` } : {}),
            })),
        }

        const script = document.createElement("script")
        script.type = "application/ld+json"
        script.text = JSON.stringify(jsonLd)
        document.head.appendChild(script)

        return () => {
            document.head.removeChild(script)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsKey])

    return (
        <nav aria-label="Breadcrumb" className="text-sm font-semibold">
            <ol className="flex flex-wrap items-center gap-1.5">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    return (
                        <li key={item.label} className="flex items-center gap-1.5">
                            {item.to && !isLast ? (
                                <Link to={item.to} className="text-white/68 transition hover:text-white">
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-white" : "text-white/68"}>
                                    {item.label}
                                </span>
                            )}
                            {!isLast && <ChevronRight className="h-3.5 w-3.5 text-white/40" />}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default PageBreadcrumb
