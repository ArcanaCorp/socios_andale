import { db } from "@/libs/supabase";

export async function getMyFoodieCategories(foodieId) {
    if (!foodieId) return [];

    const { data, error } = await db
        .from("foodie_categories")
        .select("*")
        .eq("foodie_id", foodieId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}

export async function getMyFoodieDishes(foodieId) {
    if (!foodieId) return [];

    const { data, error } = await db
        .from("foodie_dishes")
        .select(`
            *,
            foodie_categories (
                id,
                name
            )
        `)
        .eq("foodie_id", foodieId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}

export async function getMyFoodieMenu(foodieId) {
    if (!foodieId) {
        return {
            categories: [],
            dishes: []
        };
    }

    const [categories, dishes] = await Promise.all([
        getMyFoodieCategories(foodieId),
        getMyFoodieDishes(foodieId)
    ]);

    return {
        categories,
        dishes
    };
}