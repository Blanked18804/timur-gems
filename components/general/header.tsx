import { Gem, ShoppingCart } from "lucide-react"
import Link from "next/link"

const navOptions = [
    {name: "Home", href: "/"},
    {name: "Shop", href: "/Shop"},
    {name: "Stones", href: "/Stones"},
    {name: "Contact", href: "/contact"},
]

export default function Header() {
  return (
    <header className="px-16 py-4 flex justify-between items-center border border-border min-h-16">
        {/* logo */}
        <div className="flex gap-2 items-center">
            <Gem className="text-gold" />
            <h3 className="text-lg font-medium">Nur e Zar</h3>
        </div>

        {/* navigation */}
        <nav className="flex gap-4">
            {navOptions.map((navOption, index) => {
                return(
                    <Link href={navOption.href} key={index} className="nav-link font-medium">
                        {navOption.name}
                    </Link>
                )
            })}
        </nav>

        {/* cart */}
        <div className="flex items-center gap-1">
            <ShoppingCart />
            {`(0)`}
        </div>
    </header>
  )
}
