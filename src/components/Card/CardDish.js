import { formatMoney } from "@/helpers/formatted.helper";
import Link from "next/link";

export default function CardDish ({ dish }) {
    return (
        <li className="w-full bg-white border-thin border-surface rounded-md p-sm flex gap-sm">
            
            <div className="w h bg-surface rounded-md overflow-hidden" style={{"--h": "72px","--w": "72px","--mnw": "72px"}}>
                {dish.image_url ? (
                    <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover"/>
                ) : (
                    <div className="w-full h-full center">
                        <span className="text-xs text-muted">Sin foto</span>
                    </div>
                )}
            </div>

            <div className="w-full flex flex-col gap-2xs">
                <div className="w-full flex items-start justify-between gap-sm">
                    <div>
                        <h3 className="text-sm text-semibold">{dish.name}</h3>
                        <p className="text-xs text-muted">{dish.foodie_categories?.name || "Sin categoría"}</p>
                    </div>
                    <span className={`text-xs text-semibold ${ dish.is_available ? "text-success" : "text-danger"}`}>{dish.is_available ? "Activo" : "Oculto"}</span>
                </div>
                {dish.description && (
                    <p className="text-xs text-muted line-clamp-2">{dish.description}</p>
                )}
                <div className="w-full flex items-center justify-between">
                    <p className="text-sm text-semibold">S/ {formatMoney(Number(dish.price) || 0)}</p>
                    <Link href={`/menu/${dish.id}`} className="text-xs text-primary text-semibold">Editar</Link>
                </div>
            </div>

        </li>
    )
}