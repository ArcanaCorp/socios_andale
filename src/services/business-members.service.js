import { db } from "@/libs/supabase";

export async function getMyBusinessMemberships(userId) {
    if (!userId) return [];

    const { data, error } = await db
        .from("business_members")
        .select(`
            id,
            role,
            status,
            business_id,
            businesses (
                *
            )
        `)
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}