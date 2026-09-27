"use client"

import { SquareLibrary, SquarePlus } from "lucide-react"

const sidebarOptions = [
    {name: "Add product", href: "/admin/add-product", icon: SquarePlus},
    {name: "All products", href: "/admin/all-product", icon: SquareLibrary},
]

export default function Sidebar() {
  return (
    <aside className="pl-4 pr-16 py-8 border border-border min-w-64">
        {sidebarOptions.map((option, index) => {
            return(
                <div key={index} className="flex gap-4 items-center px-2 py-4">
                    <option.icon />
                    <h3 className="text-base font-semibold">{option.name}</h3>
                </div>
            )
        })}
    </aside>
  )
}
