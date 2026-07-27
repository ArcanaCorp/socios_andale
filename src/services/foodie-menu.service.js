import { db } from "@/libs/supabase";

const sanitizeFileName = (name) => {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
};

export async function getFoodieCategories(foodieId) {
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

export async function createFoodieCategory({foodieId, name, sortOrder = 0}) {
    if (!foodieId) {
        throw new Error("No se encontró el negocio.");
    }

    if (!name?.trim()) {
        throw new Error("Ingresa el nombre de la categoría.");
    }

    const cleanName = name.trim();

    const { data: existingCategory, error: existingError } = await db
        .from("foodie_categories")
        .select("*")
        .eq("foodie_id", foodieId)
        .ilike("name", cleanName)
        .maybeSingle();

    if (existingError) {
        throw new Error(existingError.message);
    }

    if (existingCategory) {
        return existingCategory;
    }

    const { data, error } = await db
        .from("foodie_categories")
        .insert({
            foodie_id: foodieId,
            name: cleanName,
            sort_order: sortOrder,
            is_active: true
        })
        .select("*")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function uploadDishImage({foodieId, file}) {
    if (!file) return null;

    if (!foodieId) {
        throw new Error("No se encontró el negocio.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${sanitizeFileName(file.name || `plato.${extension}`)}`;

    const filePath = `${foodieId}/dishes/${fileName}`;

    const { error } = await db.storage
        .from("business")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
        });

    if (error) {
        throw new Error(error.message);
    }

    const { data } = db.storage
        .from("business")
        .getPublicUrl(filePath);

    return data.publicUrl;
}

export async function createFoodieDish({ foodieId, categoryId, name, description, price, imageUrl, isAvailable = true }) {
    if (!foodieId) {
        throw new Error("No se encontró el negocio.");
    }

    if (!name?.trim()) {
        throw new Error("Ingresa el nombre del plato.");
    }

    const cleanPrice = Number(price);

    if (Number.isNaN(cleanPrice) || cleanPrice < 0) {
        throw new Error("Ingresa un precio válido.");
    }

    const { data, error } = await db
        .from("foodie_dishes")
        .insert({
            foodie_id: foodieId,
            category_id: categoryId || null,
            name: name.trim(),
            description: description?.trim() || null,
            price: cleanPrice,
            image_url: imageUrl || null,
            is_available: isAvailable,
            is_active: true,
            sort_order: 0
        })
        .select("*")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}