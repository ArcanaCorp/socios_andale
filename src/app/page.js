'use client';

import CardOrder from "@/components/Card/CardOrder";
import Icons from "@/components/Icons/Icons";
import Loading from "@/components/views/Loading";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { ORDER_FILTERS } from "@/helpers/orders.helper";
import { useBusinessOrders } from "@/hooks/useBusinessOrders";
import { toast } from "sonner";

import ButtonNotifications from "@/components/Buttons/ButtonNotifications";
import { useAuth } from "@/context/AuthContext";

export default function Page () {

    const { user } = useAuth();
    const { activeBusiness, loadingBusinessAccess } = useBusinessAccess();

    const businessId = activeBusiness?.id;

    const { orders, activeStatus, setActiveStatus, search, setSearch, loadingOrders, updatingOrderId, errorOrders, loadOrders, updateOrderStatus, soundEnabled, enableSound } = useBusinessOrders(businessId);

    const handleSearch = (event) => {
        event.preventDefault();
        loadOrders();
    };

    const handleUpdateStatus = async (orderId, status) => {
        const result = await updateOrderStatus({ orderId, status});
        if (!result.ok) return toast.warning("Alerta", { description: result.message });
        toast.success("Orden actualizada", {description: result.message});
    };

    if (loadingBusinessAccess) return <Loading />;

    if (!activeBusiness) {
        return (
            <main className="w-full h-full grid-center p-md">
                <p className="text-sm text-muted text-center">No tienes un negocio activo.</p>
            </main>
        );
    }

    return (

        <div className="w-full h-full py-md scroll-y">
            
            <div className="w-full flex flex-col mb-md gap-sm">

                <ul className="w-full flex items-center gap-xs scroll-x px-md">
                    {ORDER_FILTERS.map((item) => (
                        <li key={item.value}>
                            <button type="button" className={`badge ${activeStatus === item.value ? "is-active" : ""}`} onClick={() => setActiveStatus(item.value)}>{item.label}</button>
                        </li>
                    ))}
                </ul>

                <form className="w-full px-md" onSubmit={handleSearch}>
                    <div className="relative w-full">
                        <input type="text" className="w-full py-sm px-md bg-surface rounded-full text-xs" placeholder="Código del pedido" value={search} onChange={(event) => setSearch(event.target.value)}/>
                        <button type="submit" className="absolute h-full center" style={{top: 0, right: "10px"}}>
                            <Icons name="search" size={20} color="#888"/>
                        </button>
                    </div>
                </form>

            </div>

            {errorOrders && (
                <div className="w-full px-md mb-md">
                    <div className="w-full bg-danger-light rounded-md p-md">
                        <p className="text-sm text-danger">{errorOrders}</p>
                        <button type="button" className="text-xs text-danger text-semibold mt-sm" onClick={loadOrders}>Reintentar</button>
                    </div>
                </div>
            )}

            {!soundEnabled && (
                <div className="w-full px-md mb-md">
                    <button type="button" className="w-full h rounded-full bg-primary text-white text-xs text-semibold" style={{ "--h": "40px" }} onClick={enableSound}>
                        Activar sonido de nuevos pedidos
                    </button>
                </div>
            )}

            <div className="w-full px-md mb-md">
                <ButtonNotifications activeBusiness={activeBusiness} user={user}/> 
            </div>

            {loadingOrders ? (
                <div className="w-full py-xl center">
                    <p className="text-sm text-muted">Cargando órdenes...</p>
                </div>
            ) : (
                <ul className="w-full flex flex-col gap-sm px-md">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <CardOrder key={order.id} order={order} updating={updatingOrderId === order.id} onUpdateStatus={handleUpdateStatus}/>
                        ))
                    ) : (
                        <div className="w-full py-xl text-center">
                            <p className="text-sm text-muted">No tienes órdenes aún.</p>
                        </div>
                    )}
                </ul>
            )}

        </div>

    )
}