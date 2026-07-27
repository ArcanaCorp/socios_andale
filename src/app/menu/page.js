'use client'
import CardDish from "@/components/Card/CardDish";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { useMenu } from "@/hooks/useMenu";
import Link from "next/link";

export default function MenuPage () {

    const { activeBusiness, loadingBusinessAccess } = useBusinessAccess();

    const foodieId = activeBusiness?.id;

    const { categories, filteredDishes, activeCategory, setActiveCategory, totalDishes, availableDishes, unavailableDishes, loadingMenu, errorMenu, loadMenu } = useMenu(foodieId);

    if (loadingBusinessAccess || loadingMenu) {
        return (
            <div className="w-full h-full grid-center">
                <p className="text-sm text-muted">
                    Cargando menú...
                </p>
            </div>
        );
    }

    if (!activeBusiness) {
        return (
            <div className="w-full h-full grid-center p-md">
                <p className="text-sm text-muted text-center">
                    No tienes un negocio activo.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full py-md scroll-y">
            <Link href={'/menu/created'} className="btn-float">Crear plato</Link>
            <section className="w-full flex flex-col gap-md px-md mb-md">
                <div className="w-full grid gap-sm" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                    <div className="bg-surface rounded-md p-sm text-center">
                        <p className="text-xs text-muted">
                            Platos
                        </p>

                        <h3 className="text-lg text-semibold">
                            {totalDishes}
                        </h3>
                    </div>

                    <div className="bg-surface rounded-md p-sm text-center">
                        <p className="text-xs text-muted">
                            Activos
                        </p>

                        <h3 className="text-lg text-semibold text-success">
                            {availableDishes}
                        </h3>
                    </div>

                    <div className="bg-surface rounded-md p-sm text-center">
                        <p className="text-xs text-muted">
                            Ocultos
                        </p>

                        <h3 className="text-lg text-semibold text-danger">
                            {unavailableDishes}
                        </h3>
                    </div>
                </div>

                {errorMenu && (
                    <div className="w-full bg-danger-light rounded-md p-sm">
                        <p className="text-xs text-danger">
                            {errorMenu}
                        </p>

                        <button
                            type="button"
                            className="text-xs text-semibold text-danger mt-xs"
                            onClick={loadMenu}
                        >
                            Reintentar
                        </button>
                    </div>
                )}
            </section>
            <section className="w-full flex flex-col gap-md">
                <div className="w-full flex gap-xs scroll-x px-md">
                    <button type="button" className={`badge ${ !activeCategory ? "bg-primary text-white" : ""}`} onClick={() => setActiveCategory(null)}>Todos</button>
                    {categories.map((category) => (
                        <button key={category.id} type="button" className={`badge ${activeCategory === category.id ? "bg-primary text-white" : ""}`} onClick={() => setActiveCategory(category.id)} >{category.name}</button>
                    ))}
                </div>
                <ul className="w-full flex flex-col gap-sm px-md">
                    {filteredDishes.length > 0 ? (
                        filteredDishes.map((dish) => (
                            <CardDish key={dish.id} dish={dish} />
                        ))
                    ) : (
                        <div className="w-full py-xl text-center">
                            <p className="text-sm text-muted">No tienes platos en esta categoría.</p>
                            <Link href="/menu/created" className="inline-flex mt-md text-sm text-primary text-semibold">Crear primer plato</Link>
                        </div>
                    )}
                </ul>
            </section>
        </div>
    )
}