'use client'
import { TABS } from "@/helpers/tabs.helper";
import { usePathname } from "next/navigation"

export default function Header () {
    
    const pathname = usePathname();
    
    const pageInfo = TABS.find((tab) => tab.link === pathname);

    return (
        <header className="w-full h" style={{"--h": "60px"}}>
            <div className="w-full h-full px-md flex items-center">
                <h2>{pageInfo.title || 'Pagina'}</h2>
            </div>
        </header>
    )
}