'use client';

import { getBusinessOrders, updateBusinessOrderStatus } from "@/services/business-orders.service";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useBusinessOrders(businessId) {

    const [orders, setOrders] = useState([]);
    const [activeStatus, setActiveStatus] = useState("all");
    const [search, setSearch] = useState("");

    const [loadingOrders, setLoadingOrders] = useState(false);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [errorOrders, setErrorOrders] = useState(null);

    const loadOrders = useCallback(async () => {
        try {
            if (!businessId) return;

            setLoadingOrders(true);
            setErrorOrders(null);

            const data = await getBusinessOrders({
                businessId,
                status: activeStatus,
                search
            });

            setOrders(data);

        } catch (error) {
            console.error("Error loading business orders:", error);
            setErrorOrders(error.message || "No se pudieron cargar las órdenes.");
        } finally {
            setLoadingOrders(false);
        }
    }, [ businessId, activeStatus, search ]);

    const updateOrderStatus = async ({ orderId, status, extraPayload = {} }) => {
        
        try {
            
            if (!businessId || !orderId) {
                return {
                    ok: false,
                    message: "No se encontró la orden o el negocio.",
                    order: null
                };
            }

            setUpdatingOrderId(orderId);

            const updatedOrder = await updateBusinessOrderStatus({
                orderId,
                businessId,
                status,
                extraPayload
            });

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId
                        ? {
                            ...order,
                            ...updatedOrder
                        }
                        : order
                )
            );

            return {
                ok: true,
                message: "Orden actualizada correctamente.",
                order: updatedOrder
            };

        } catch (error) {
            console.error(error);

            return {
                ok: false,
                message: error.message || "No se pudo actualizar la orden.",
                order: null
            };

        } finally {
            setUpdatingOrderId(null);
        }
    };

    const counters = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter((order) => order.status === "pending").length,
            accepted: orders.filter((order) => order.status === "accepted").length,
            preparing: orders.filter((order) => order.status === "preparing").length,
            completed: orders.filter((order) => order.status === "completed").length,
            cancelled: orders.filter((order) => order.status === "cancelled").length,
            rejected: orders.filter((order) => order.status === "rejected").length
        };
    }, [orders]);

    useEffect(() => {
        if (!businessId) return;

        loadOrders();
    }, [businessId, activeStatus]);

    return {
        orders,

        activeStatus,
        setActiveStatus,

        search,
        setSearch,

        counters,

        loadingOrders,
        updatingOrderId,
        errorOrders,

        loadOrders,
        updateOrderStatus
    };
}