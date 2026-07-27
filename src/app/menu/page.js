import Link from "next/link";

export default function MenuPage () {
    return (
        <div className="w-full h-full py-md scroll-y">
            <Link href={'/menu/created'}>Crear plato</Link>
        </div>
    )
}