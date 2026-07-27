'use client';

import { getBusinessOrderById, getBusinessOrders, updateBusinessOrderStatus } from "@/services/business-orders.service";

import { db } from "@/libs/supabase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNewOrderSound } from "./useNewOrderSound";

export function useBusinessOrders(businessId) {

    const { enabled: soundEnabled, enableSound, playNewOrderSound } = useNewOrderSound();

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

    const addRealtimeOrder = async (orderId) => {
        try {
            const fullOrder = await getBusinessOrderById({ businessId, orderId});

            if (!fullOrder) return;

            setOrders((prev) => {
                const alreadyExists = prev.some((order) => order.id === fullOrder.id);

                if (alreadyExists) {
                    return prev.map((order) =>
                        order.id === fullOrder.id ? fullOrder : order
                    );
                }

                if (activeStatus !== "all" && fullOrder.status !== activeStatus) {
                    return prev;
                }

                return [
                    fullOrder,
                    ...prev
                ];
            });

            toast.success("Nuevo pedido recibido", {
                description: `Pedido ${fullOrder.order_code} por S/ ${Number(fullOrder.total || 0).toFixed(2)}`
            });

            await playNewOrderSound();

        } catch (error) {
            console.error("Error adding realtime order:", error);
        }
    };

    const updateRealtimeOrder = async (orderId) => {
        try {

            const fullOrder = await getBusinessOrderById({ businessId, orderId });

            if (!fullOrder) return;

            setOrders((prev) => {
                const exists = prev.some((order) => order.id === fullOrder.id);

                if (!exists) return prev;

                if (activeStatus !== "all" && fullOrder.status !== activeStatus) {
                    return prev.filter((order) => order.id !== fullOrder.id);
                }

                return prev.map((order) =>
                    order.id === fullOrder.id ? fullOrder : order
                );
            });

        } catch (error) {
            console.error("Error updating realtime order:", error);
        }
    };

    const updateOrderStatus = async ({orderId,status,extraPayload = {}}) => {

        try {

            if (!businessId || !orderId) {
                return {
                    ok: false,
                    message: "No se encontró la orden o el negocio.",
                    order: null
                };
            }

            setUpdatingOrderId(orderId);

            const updatedOrder = await updateBusinessOrderStatus({ orderId, businessId, status, extraPayload });

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, ...updatedOrder } : order
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
    }, [businessId,activeStatus]);

    useEffect(() => {
        if (!businessId) return;

        const channel = db
            .channel(`business-orders-${businessId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "foodie_orders",
                    filter: `company_id=eq.${businessId}`
                },
                async (payload) => {
                    const orderId = payload?.new?.id;

                    if (!orderId) return;

                    await addRealtimeOrder(orderId);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "foodie_orders",
                    filter: `company_id=eq.${businessId}`
                },
                async (payload) => {
                    const orderId = payload?.new?.id;

                    if (!orderId) return;

                    await updateRealtimeOrder(orderId);
                }
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    console.log("Realtime conectado a pedidos:", businessId);
                }

                if (status === "CHANNEL_ERROR") {
                    console.error("Error en canal realtime de pedidos");
                }
            });

        return () => {
            db.removeChannel(channel);
        };

    }, [
        businessId,
        activeStatus
    ]);

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
        updateOrderStatus,
        
        soundEnabled,
        enableSound,
    };
}