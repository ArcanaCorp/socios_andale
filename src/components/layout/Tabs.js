'use client';

import Link from "next/link";
import Icons from "../Icons/Icons";
import { usePathname } from "next/navigation";
import { TABS } from "@/helpers/tabs.helper";

export default function Tabs () {

    const pathname = usePathname();

    return (
        <nav className="w-full h" style={{"--h": "60px"}}>
            <ul className="w-full h-full px-md flex items-center justify-between">
                {TABS
                .filter((t) => t.type === 'tabs')
                .map((tab) => (
                    <li key={tab.id} className="w-full">
                        <Link href={tab.link} className={`flex flex-col items-center gap-2xs ${pathname === tab.link ? 'text-dark text-medium' : 'text-muted'}`}>
                            <Icons name={tab.icon} />
                            <span className={`text-2xs`}>{tab.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}