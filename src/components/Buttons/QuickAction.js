import Link from "next/link";
import Icons from "../Icons/Icons";

export default function QuickAction({ title, description, href }) {
    return (
        <Link href={href} className="w-full bg-white border-thin border-surface rounded-md p-md flex items-center justify-between gap-md">
            <div className="w-full flex flex-col gap-2xs">
                <h4 className="text-sm text-semibold">{title}</h4>
                <p className="text-xs text-muted">{description}</p>
            </div>

            <span className="text-lg text-muted"><Icons name={'chevronRight'} /></span>
        </Link>
    );
}