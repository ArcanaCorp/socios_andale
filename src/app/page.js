'use client';

import Icons from "@/components/Icons/Icons";
import Loading from "@/components/views/Loading";
import { useAuth } from "@/context/AuthContext";
import { orders } from "@/db/orders.db";
import { FILTERS_ORDERS } from "@/helpers/filters.helper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page () {

    const { user, loadAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loadAuth && !user) {
            router.replace('/auth/login?next=/orders');
        }
    }, [loadAuth, user, router]);

    if (loadAuth || !user) {
        return <Loading />;
    }

    return (
        <div className="w-full h-full py-md scroll-y">
            <div className="w-full flex flex-col mb-md gap-sm">
                <ul className="w-full flex items-center gap-xs scroll-x px-md">
                    {FILTERS_ORDERS.map((itm, idx) => (
                        <li key={idx} className={`badge`}>{itm.label}</li>
                    ))}
                </ul>
                <div className="w-full px-md">
                    <div className="relative w-full">
                        <input type="text" className="w-full py-sm px-md bg-surface rounded-full text-xs" placeholder="Código del pedido" />
                        <span className="absolute h-full center" style={{top: 0, right: '10px'}}><Icons name={'search'} size={20} color="#888" /></span>
                    </div>
                </div>
            </div>
            <ul>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <li key={order.id}>
                            <div>{order.order_code}</div>
                        </li>
                    ))
                ) : ( 
                    <p>No tienes órdenes aún</p> 
                )}
            </ul>
        </div>
    )
}