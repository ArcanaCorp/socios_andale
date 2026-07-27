'use client';

import Link from "next/link";

import Loading from "@/components/views/Loading";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { useMenu } from "@/hooks/useMenu";
import CardStat from "@/components/Card/CardStat";
import CardStatus from "@/components/Card/CardStatus";
import QuickAction from "@/components/Buttons/QuickAction";
import { formatNumber } from "@/helpers/formatted.helper";

export default function TablerPage () {

    const { activeBusiness, loadingBusinessAccess } = useBusinessAccess();

    const foodieId = activeBusiness?.id;

    const { categories, dishes, totalDishes, availableDishes, unavailableDishes, loadingMenu } = useMenu(foodieId);

    if (loadingBusinessAccess) return <Loading />;

    if (!activeBusiness) {
        return (
            <main className="w-full h-full grid-center p-md">
                <p className="text-sm text-muted text-center">No tienes un negocio activo.</p>
            </main>
        );
    }

    const publicUrl = activeBusiness?.slug ? `https://andaleya.pe/foodies/${activeBusiness.slug}` : null;

    const businessImage = activeBusiness?.cover_image_url || activeBusiness?.profile_image_url || null;

    return (
        <div className="w-full h-full py-md scroll-y">
            
            <section className="w-full flex flex-col gap-md px-md mb-md">

                <div className="w-full bg-white border-thin border-surface rounded-md hidden">
                    
                    <div className="w-full h bg-surface center hidden" style={{"--h": "150px"}}>
                        {businessImage ? (
                            <img src={businessImage} alt={activeBusiness?.name} className="w-full h-full object-cover"/>
                        ) : (
                            <p className="text-xs text-muted">Sin imagen de portada</p>
                        )}
                    </div>

                    <div className="w-full flex flex-col gap-sm p-md">
                            
                        <div className="w-full flex items-start justify-between gap-md">
                            <div className="w-full flex flex-col gap-2xs">
                                <h2 className="text-md text-semibold">{activeBusiness?.name}</h2>
                                <p className="text-xs text-muted">{activeBusiness?.category || "Sin categoría"}</p>
                                {activeBusiness?.short_description && (
                                    <p className="text-xs text-muted">{activeBusiness.short_description}</p>
                                )}
                            </div>

                            <span className={`text-xs text-semibold rounded-full px-sm py-2xs ${activeBusiness?.is_active ? "bg-primary text-white" : "bg-surface text-muted"}`}>
                                {activeBusiness?.is_active ? "Publicado" : "Oculto"}
                            </span>
                        </div>

                        {publicUrl && (
                            <a href={publicUrl} target="_blank" rel="noreferrer" className="w-full h rounded-full bg-surface center text-xs text-semibold" style={{"--h": "38px"}}>Ver tienda pública</a>
                        )}
                    </div>
                </div>

            </section>

            <section className="w-full px-md mb-md">
                
                <div className="w-full grid gap-sm grid-cols-2">
                    
                    <CardStat label="Platos" value={loadingMenu ? "..." : formatNumber(totalDishes)} helper="Total en carta"/>
                    <CardStat label="Categorías" value={loadingMenu ? "..." : formatNumber(categories.length)} helper="Secciones del menú"/>
                    <CardStat label="Disponibles" value={loadingMenu ? "..." : formatNumber(availableDishes)} helper="Platos activos"/>
                    <CardStat label="Ocultos" value={loadingMenu ? "..." : formatNumber(unavailableDishes)} helper="No visibles"/>
                    <CardStat label="Pedidos" value={formatNumber(activeBusiness?.orders_count)} helper="Pedidos históricos"/>
                    <CardStat label="Calificación" value={Number(activeBusiness?.rating_avg || 0).toFixed(1)} helper={`${formatNumber(activeBusiness?.rating_count)} reseñas`}/>

                </div>

            </section>

            <section className="w-full flex flex-col gap-sm px-md mb-md">
            
                <h3 className="text-md text-semibold">Estado del negocio</h3>

                <CardStatus title="Negocio visible" description="Controla si aparece o no en Ándale Ya!." active={activeBusiness?.is_active} activeText="Visible" inactiveText="Oculto"/>
                <CardStatus title="Atención actual" description="Estado temporal del negocio para los clientes." active={activeBusiness?.is_open} activeText="Abierto" inactiveText="Cerrado"/>
                <CardStatus title="Pedidos" description="Permite que los clientes realicen pedidos desde la app." active={activeBusiness?.accepts_orders} activeText="Acepta" inactiveText="Pausado"/>
                <CardStatus title="Delivery" description="Indica si el negocio ofrece entrega a domicilio." active={activeBusiness?.has_delivery} activeText="Disponible" inactiveText="No disponible"/>
                
            </section>

            <section className="w-full flex flex-col gap-sm px-md mb-md">

                <h3 className="text-md text-semibold">Acciones rápidas</h3>

                <QuickAction title="Gestionar carta" description="Ver, crear y editar platos del negocio." href="/menu"/>
                <QuickAction title="Crear plato" description="Agrega un nuevo producto a tu carta." href="/menu/created"/>
                <QuickAction title="Perfil del negocio" description="Edita nombre, descripción, categoría e imágenes." href="/business/profile"/>
                <QuickAction title="Ubicación y contacto" description="Actualiza dirección, WhatsApp, teléfono, correo y redes." href="/business/contact"/>
                <QuickAction title="Pedidos y atención" description="Configura delivery, recojo, tiempos y reglas de pedidos." href="/business/orders"/>
                <QuickAction title="Métodos de pago" description="Configura efectivo, Yape, Plin, tarjeta y moneda." href="/business/payments"/>
                <QuickAction title="Horarios" description="Define los días y horas de atención." href="/business/schedule"/>
                <QuickAction title="Visibilidad pública" description="Configura publicación, SEO y vista compartida." href="/business/visibility"/>

            </section>

            {dishes.length === 0 && !loadingMenu && (
                <section className="w-full px-md mb-md">
                    <div className="w-full bg-surface rounded-md p-md flex flex-col gap-sm text-center">
                        <h3 className="text-md text-semibold">Tu carta todavía está vacía</h3>
                        <p className="text-sm text-muted">Crea tu primer plato para que los clientes puedan empezar a ver tu menú.</p>
                        <Link href="/menu/created" className="w-full h rounded-full bg-primary text-white center text-sm text-semibold" style={{"--h": "42px"}}>
                            Crear primer plato
                        </Link>
                    </div>
                </section>
            )}

        </div>
    )
}