'use client';

import { getMyFoodieMenu } from "@/services/menu.service";
import { useEffect, useMemo, useState } from "react";

export function useMenu(foodieId) {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);

    const [activeCategory, setActiveCategory] = useState(null);

    const [loadingMenu, setLoadingMenu] = useState(false);
    const [errorMenu, setErrorMenu] = useState(null);

    const loadMenu = async () => {
        try {
            if (!foodieId) return;

            setLoadingMenu(true);
            setErrorMenu(null);

            const data = await getMyFoodieMenu(foodieId);

            setCategories(data.categories);
            setDishes(data.dishes);

        } catch (error) {
            console.error("Error loading menu:", error);
            setErrorMenu(error.message || "No se pudo cargar el menú.");
        } finally {
            setLoadingMenu(false);
        }
    };

    const filteredDishes = useMemo(() => {
        if (!activeCategory) return dishes;

        return dishes.filter((dish) => {
            return dish.category_id === activeCategory;
        });
    }, [dishes, activeCategory]);

    const totalDishes = dishes.length;

    const availableDishes = useMemo(() => {
        return dishes.filter((dish) => dish.is_available).length;
    }, [dishes]);

    const unavailableDishes = useMemo(() => {
        return dishes.filter((dish) => !dish.is_available).length;
    }, [dishes]);

    useEffect(() => {
        if (!foodieId) return;

        loadMenu();
    }, [foodieId]);

    return {
        categories,
        dishes,
        filteredDishes,

        activeCategory,
        setActiveCategory,

        totalDishes,
        availableDishes,
        unavailableDishes,

        loadingMenu,
        errorMenu,

        loadMenu
    };
}