import type { CSSProperties } from "react"

type MascotProps = {
    className?: string
    style?: CSSProperties
}

export const Papag = ({ className, style }: MascotProps) => (
    <svg viewBox="0 0 180 200" className={className} style={style} aria-hidden="true">
        <ellipse cx="60" cy="176" rx="9" ry="7" fill="#0F3FA8" />
        <ellipse cx="120" cy="176" rx="9" ry="7" fill="#0F3FA8" />
        <rect x="18" y="86" width="144" height="92" rx="38" fill="#7DA9FF" stroke="#0F3FA8" strokeWidth="5" />
        <path d="M 30 104 Q 90 92 150 104" stroke="#B9D3FF" strokeWidth="6" strokeLinecap="round" fill="none" />
        <ellipse cx="56" cy="140" rx="11" ry="7" fill="#FF9FAE" opacity="0.7" />
        <ellipse cx="124" cy="140" rx="11" ry="7" fill="#FF9FAE" opacity="0.7" />
        <g className="chat-mascot-blink" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx="72" cy="128" r="11" fill="#172033" />
            <circle cx="108" cy="128" r="11" fill="#172033" />
            <circle cx="75" cy="124" r="3.4" fill="#FFFFFF" />
            <circle cx="111" cy="124" r="3.4" fill="#FFFFFF" />
        </g>
        <path d="M 78 150 Q 90 158 102 150" stroke="#0F3FA8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <text x="140" y="76" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="800" fill="#7DA9FF">z</text>
        <text x="150" y="62" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="800" fill="#7DA9FF">z</text>
    </svg>
)

export const Bilao = ({ className, style }: MascotProps) => (
    <svg viewBox="0 0 180 200" className={className} style={style} aria-hidden="true">
        <ellipse cx="66" cy="174" rx="9" ry="6" fill="#C97A00" />
        <ellipse cx="114" cy="174" rx="9" ry="6" fill="#C97A00" />
        <circle cx="90" cy="120" r="72" fill="#FFCB66" stroke="#C97A00" strokeWidth="5" />
        <path d="M 28 108 Q 90 88 152 108" stroke="#FFE1A6" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="18" cy="128" rx="13" ry="9" fill="#FFCB66" stroke="#C97A00" strokeWidth="4" transform="rotate(-18 18 128)" />
        <ellipse cx="162" cy="128" rx="13" ry="9" fill="#FFCB66" stroke="#C97A00" strokeWidth="4" transform="rotate(18 162 128)" />
        <ellipse cx="58" cy="140" rx="11" ry="7" fill="#FF9FAE" opacity="0.7" />
        <ellipse cx="122" cy="140" rx="11" ry="7" fill="#FF9FAE" opacity="0.7" />
        <g className="chat-mascot-blink" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx="74" cy="126" r="11" fill="#172033" />
            <circle cx="106" cy="126" r="11" fill="#172033" />
            <circle cx="77" cy="122" r="3.4" fill="#FFFFFF" />
            <circle cx="109" cy="122" r="3.4" fill="#FFFFFF" />
        </g>
        <path d="M 80 148 Q 90 154 100 148" stroke="#C97A00" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <ellipse cx="46" cy="168" rx="4" ry="2.4" fill="#F4F8FB" stroke="#C97A00" strokeWidth="1" />
        <ellipse cx="136" cy="166" rx="4" ry="2.4" fill="#F4F8FB" stroke="#C97A00" strokeWidth="1" />
    </svg>
)
