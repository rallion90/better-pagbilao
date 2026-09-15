import { ChevronRight } from "lucide-react"
import { Link } from "react-router"

export type BreadcrumbItem = {
    label: string
    to?: string
}

const PageBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
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
