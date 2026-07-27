'use client';

import { deleteMyFoodieDish, getMyFoodieCategories, getMyFoodieDishById, updateMyFoodieDish } from "@/services/menu.service";
import { createFoodieCategory, uploadDishImage } from "@/services/foodie-menu.service";

import { useEffect, useState } from "react";

export function useEditDish({ dishId, foodieId }) {
    
    const [dish, setDish] = useState(null);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        new_category: "",
        image_url: "",
        image_file: null,
        image_preview: null,
        is_available: true
    });

    const [loadingDish, setLoadingDish] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const updateForm = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const fillForm = (data) => {
        setForm({
            name: data?.name || "",
            description: data?.description || "",
            price: data?.price ?? "",
            category_id: data?.category_id || "",
            new_category: "",
            image_url: data?.image_url || "",
            image_file: null,
            image_preview: null,
            is_available: data?.is_available ?? true
        });
    };

    const loadCategories = async () => {
        try {
            if (!foodieId) return;

            setLoadingCategories(true);

            const data = await getMyFoodieCategories(foodieId);

            setCategories(data);

        } catch (error) {
            console.error("Error loading categories:", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const loadDish = async () => {
        try {
            if (!dishId || !foodieId) return;

            setLoadingDish(true);

            const data = await getMyFoodieDishById({
                dishId,
                foodieId
            });

            setDish(data);

            if (data) {
                fillForm(data);
            }

        } catch (error) {
            console.error("Error loading dish:", error);
        } finally {
            setLoadingDish(false);
        }
    };

    const selectImage = (file) => {
        if (!file) {
            updateForm("image_file", null);
            updateForm("image_preview", null);
            return;
        }

        updateForm("image_file", file);
        updateForm("image_preview", URL.createObjectURL(file));
    };

    const saveDish = async () => {
        try {
            if (!dishId || !foodieId) {
                return {
                    ok: false,
                    message: "No se encontró el plato o el negocio.",
                    dish: null
                };
            }

            if (!form.name.trim()) {
                return {
                    ok: false,
                    message: "Ingresa el nombre del plato.",
                    dish: null
                };
            }

            const price = Number(form.price);

            if (Number.isNaN(price) || price < 0) {
                return {
                    ok: false,
                    message: "Ingresa un precio válido.",
                    dish: null
                };
            }

            setSaving(true);

            let categoryId = form.category_id || null;

            if (form.new_category.trim()) {
                const category = await createFoodieCategory({
                    foodieId,
                    name: form.new_category.trim(),
                    sortOrder: categories.length + 1
                });

                categoryId = category.id;
            }

            let imageUrl = form.image_url || null;

            if (form.image_file) {
                imageUrl = await uploadDishImage({
                    foodieId,
                    file: form.image_file
                });
            }

            const payload = {
                name: form.name.trim(),
                description: form.description.trim() || null,
                price,
                category_id: categoryId,
                image_url: imageUrl,
                is_available: form.is_available
            };

            const updatedDish = await updateMyFoodieDish({
                dishId,
                foodieId,
                payload
            });

            setDish(updatedDish);
            fillForm(updatedDish);

            await loadCategories();

            return {
                ok: true,
                message: "Plato actualizado correctamente.",
                dish: updatedDish
            };

        } catch (error) {
            console.error(error);

            return {
                ok: false,
                message: error.message || "No se pudo actualizar el plato.",
                dish: null
            };

        } finally {
            setSaving(false);
        }
    };

    const deleteDish = async () => {
        try {
            if (!dishId || !foodieId) {
                return {
                    ok: false,
                    message: "No se encontró el plato o el negocio."
                };
            }

            setDeleting(true);

            await deleteMyFoodieDish({
                dishId,
                foodieId
            });

            return {
                ok: true,
                message: "Plato eliminado correctamente."
            };

        } catch (error) {
            console.error(error);

            return {
                ok: false,
                message: error.message || "No se pudo eliminar el plato."
            };

        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        if (!dishId || !foodieId) return;

        loadDish();
        loadCategories();

    }, [dishId, foodieId]);

    return {
        dish,
        categories,
        form,

        loadingDish,
        loadingCategories,
        saving,
        deleting,

        updateForm,
        selectImage,
        saveDish,
        deleteDish,
        loadDish,
        loadCategories
    };
}