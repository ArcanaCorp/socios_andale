'use client';

import { updateBusiness, uploadBusinessImage } from "@/services/business.service";
import { useEffect, useState } from "react";

export function useBusinessEditor({business, user, onUpdated}) {
    
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [uploadingField, setUploadingField] = useState(null);

    const businessId = business?.id;

    const updateForm = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setForm(business || {});
    };

    const saveBusiness = async (payload) => {
        try {
            if (!businessId) {
                return {
                    ok: false,
                    message: "No se encontró el negocio.",
                    business: null
                };
            }

            setSaving(true);

            const cleanPayload = {
                ...payload,
                updated_by: user?.id || null
            };

            const updatedBusiness = await updateBusiness({
                businessId,
                payload: cleanPayload
            });

            setForm(updatedBusiness);

            if (onUpdated) {
                await onUpdated();
            }

            return {
                ok: true,
                message: "Información actualizada correctamente.",
                business: updatedBusiness
            };

        } catch (error) {
            console.error(error);

            return {
                ok: false,
                message: error.message || "No se pudo actualizar la información.",
                business: null
            };

        } finally {
            setSaving(false);
        }
    };

    const uploadImageField = async ({ field, file, folder }) => {
        try {
            if (!file) return null;

            setUploadingField(field);

            const uploaded = await uploadBusinessImage({
                businessId,
                file,
                folder
            });

            updateForm(field, uploaded.url);

            return uploaded;

        } catch (error) {
            console.error(error);
            throw error;

        } finally {
            setUploadingField(null);
        }
    };

    useEffect(() => {
        if (!business) return;

        setForm(business);
    }, [business?.id]);

    return {
        form,
        saving,
        uploadingField,

        updateForm,
        resetForm,
        saveBusiness,
        uploadImageField
    };
}