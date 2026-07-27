import { db } from "@/libs/supabase";

export async function getBusinessOrders({ businessId, status = "all", search = ""}) {

    if (!businessId) return [];

    let query = db
        .from("foodie_orders")
        .select(`
            *,
            foodie_order_items (
                id,
                product_id,
                product_name,
                product_description,
                product_image_url,
                quantity,
                unit_price,
                subtotal
            )
        `)
        .eq("company_id", businessId)
        .order("created_at", { ascending: false });

    if (status && status !== "all") {
        query = query.eq("status", status);
    }

    if (search?.trim()) {
        query = query.ilike("order_code", `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}

export async function updateBusinessOrderStatus({ orderId, businessId, status, extraPayload = {} }) {
    
    if (!orderId || !businessId) {
        throw new Error("No se encontró la orden o el negocio.");
    }

    const payload = {
        status,
        ...extraPayload
    };

    if (status === "accepted") {
        payload.accepted_at = new Date().toISOString();
    }

    if (status === "rejected") {
        payload.rejected_at = new Date().toISOString();
    }

    if (status === "cancelled") {
        payload.cancelled_at = new Date().toISOString();
    }

    if (status === "completed") {
        payload.completed_at = new Date().toISOString();
    }

    const { data, error } = await db
        .from("foodie_orders")
        .update(payload)
        .eq("id", orderId)
        .eq("company_id", businessId)
        .select("*")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}