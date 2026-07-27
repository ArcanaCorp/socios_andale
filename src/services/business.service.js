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

export async function updateBusiness({ businessId, payload }) {
    if (!businessId) {
        throw new Error("No se encontró el negocio.");
    }

    const { data, error } = await db
        .from("businesses")
        .update(payload)
        .eq("id", businessId)
        .select("*")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function uploadBusinessImage({businessId, file, folder = "profile"}) {
    
    if (!businessId) {
        throw new Error("No se encontró el negocio.");
    }

    if (!file) {
        return null;
    }

    const extension = file.name
        ?.split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName = `${Date.now()}-${sanitizeFileName(file.name || `image.${extension}`)}`;

    const filePath = `${businessId}/${folder}/${fileName}`;

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

    return {
        path: filePath,
        url: data.publicUrl
    };
}