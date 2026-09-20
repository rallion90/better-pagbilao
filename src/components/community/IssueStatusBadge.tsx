import { statusMeta } from "../../lib/communityReports"

// Text is the statusLabel sent by the API; only the colours are decided on this side.
const IssueStatusBadge = ({ status, label }: { status: string; label: string }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusMeta(status).badge}`}>{label}</span>
)

export default IssueStatusBadge
