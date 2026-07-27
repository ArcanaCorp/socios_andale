'use client'
import { getPageTitle } from "@/helpers/page-header.helper";
import { usePathname } from "next/navigation"

export default function Header () {
    
    const pathname = usePathname();
    const title = getPageTitle(pathname);

    return (
        <header className="w-full h" style={{"--h": "60px"}}>
            <div className="w-full h-full px-md flex items-center">
                <h2 className="text-lg text-semibold">{title}</h2>
            </div>
        </header>
    )
}