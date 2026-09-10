import QuickLinks from "../ui/QuickLinks"
import BottomHeader from "../ui/BotomHeader"

const Header = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
            <div className="flag-ribbon h-1.5 w-full"></div>
            <QuickLinks />
            <BottomHeader />
        </header>
    )
}

export default Header