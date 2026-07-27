'use client';

import { createFoodieCategory, createFoodieDish, getFoodieCategories, uploadDishImage } from "@/services/foodie-menu.service";

import { useEffect, useState } from "react";

export function useCreateDish(foodieId) {
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        new_category: "",
        image_file: null,
        image_preview: null,
        is_available: true
    });

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [saving, setSaving] = useState(false);

    const updateForm = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            price: "",
            category_id: "",
            new_category: "",
            image_file: null,
            image_preview: null,
            is_available: true
        });
    };

    const loadCategories = async () => {
        try {
            if (!foodieId) return;

            setLoadingCategories(true);

            const data = await getFoodieCategories(foodieId);

            setCategories(data);

        } catch (error) {
            console.error("Error loading categories:", error);
        } finally {
            setLoadingCategories(false);
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
            if (!foodieId) {
                return {
                    ok: false,
                    message: "No se encontró el negocio activo.",
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

            if (!form.price || Number(form.price) < 0) {
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
                    name: form.new_category,
                    sortOrder: categories.length + 1
                });

                categoryId = category.id;
            }

            let imageUrl = null;

            if (form.image_file) {
                imageUrl = await uploadDishImage({
                    foodieId,
                    file: form.image_file
                });
            }

            const dish = await createFoodieDish({
                foodieId,
                categoryId,
                name: form.name,
                description: form.description,
                price: form.price,
                imageUrl,
                isAvailable: form.is_available
            });

            await loadCategories();
            resetForm();

            return {
                ok: true,
                message: "Plato creado correctamente.",
                dish
            };

        } catch (error) {
            console.error(error);

            return {
                ok: false,
                message: error.message || "No se pudo crear el plato.",
                dish: null
            };

        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!foodieId) return;

        loadCategories();
    }, [foodieId]);

    return {
        form,
        categories,

        saving,
        loadingCategories,

        updateForm,
        selectImage,
        saveDish,
        resetForm,
        loadCategories
    };
}