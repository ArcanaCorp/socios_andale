'use client';

import BusinessFormSection from "@/components/Forms/BusinessFormSection";
import BusinessImageField from "@/components/Inputs/BusinessImageField";
import BusinessInput from "@/components/Inputs/BusinessInput";
import BusinessSelect from "@/components/Inputs/BusinessSelect";
import BusinessTagsInput from "@/components/Inputs/BusinessTagsInput";
import BusinessTextarea from "@/components/Inputs/BusinessTextarea";
import Loading from "@/components/views/Loading";
import { BUSINESS_TYPE_OPTIONS } from "@/constants/BUSINESS_TYPE_OPTIONS";
import { useAuth } from "@/context/AuthContext";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { useBusinessEditor } from "@/hooks/useBusinessEditor";
import { toast } from "sonner";

export default function BusinessProfilePage () {
    
    const { user } = useAuth();

    const { activeBusiness, loadingBusinessAccess, reloadBusinessAccess } = useBusinessAccess();

    const { form, saving, uploadingField, updateForm, saveBusiness, uploadImageField } = useBusinessEditor({ business: activeBusiness, user, onUpdated: reloadBusinessAccess });

    const handleUploadImage = async ({ field, folder, file }) => {
        try {
            await uploadImageField({ field, folder, file});
            toast.success("Imagen subida", { description: "La imagen se cargó correctamente." });
        } catch (error) {
            toast.error("Error", { description: error.message || "No se pudo subir la imagen." });
        }
    };

    const handleSave = async () => {
        const payload = {
            name: form.name?.trim(),
            commercial_name: form.commercial_name?.trim() || null,
            description: form.description?.trim() || null,
            short_description: form.short_description?.trim() || null,
            business_type: form.business_type || "restaurant",
            category: form.category?.trim() || null,
            tags: Array.isArray(form.tags) ? form.tags : [],
            profile_image_url: form.profile_image_url || null,
            cover_image_url: form.cover_image_url || null,
            gallery_images: Array.isArray(form.gallery_images) ? form.gallery_images : []
        };

        if (!payload.name) return toast.warning("Nombre requerido", { description: "Ingresa el nombre del negocio." });

        const result = await saveBusiness(payload);

        if (!result.ok) return toast.warning("Alerta", { description: result.message });

        toast.success("Perfil actualizado", { description: result.message });
    };

    if (loadingBusinessAccess) return <Loading />;

    if (!activeBusiness) {
        return (
            <main className="w-full h-full grid-center p-md">
                <p className="text-sm text-muted text-center">No tienes un negocio activo.</p>
            </main>
        );
    }
    
    return (
        <div className="w-full h-full p-md flex flex-col gap-md scroll-y">

            <BusinessFormSection title="Imagen pública" description="Estas imágenes aparecerán en la app de clientes.">
                
                <BusinessImageField label="Portada" value={form.cover_image_url} loading={uploadingField === "cover_image_url"} aspect="cover" onChange={(file) => handleUploadImage({ field: "cover_image_url", folder: "cover", file })}/>

                <BusinessImageField label="Logo o imagen de perfil" value={form.profile_image_url} loading={uploadingField === "profile_image_url"} aspect="avatar" onChange={(file) => handleUploadImage({ field: "profile_image_url", folder: "profile", file }) }/>

            </BusinessFormSection>

            <BusinessFormSection title="Información principal" description="Datos básicos para identificar tu negocio dentro de Ándale Ya!.">
                    
                <BusinessInput label="Nombre legal o principal" placeholder="Ej. Killa Farma" value={form.name} onChange={(value) => updateForm("name", value)} maxLength={160}/>

                <BusinessInput label="Nombre comercial" placeholder="Ej. Killa Farma Jauja" value={form.commercial_name} onChange={(value) => updateForm("commercial_name", value) } maxLength={160}/>

                <BusinessSelect label="Tipo de negocio" value={form.business_type} onChange={(value) => updateForm("business_type", value)} options={BUSINESS_TYPE_OPTIONS}/>

                <BusinessInput label="Categoría" placeholder="Ej. Cafetería, comida rápida, farmacia" value={form.category} onChange={(value) => updateForm("category", value)} maxLength={80}/>
            
            </BusinessFormSection>

            <BusinessFormSection title="Descripción" description="Cuenta qué ofrece tu negocio de forma clara y atractiva.">

                <BusinessTextarea label="Descripción corta" placeholder="Ej. Cafetería local con postres, bebidas calientes y atención rápida." value={form.short_description} onChange={(value) => updateForm("short_description", value)} maxLength={220} rows={3}/>
                <BusinessTextarea label="Descripción completa" placeholder="Describe tu historia, especialidades, ambiente y propuesta de valor." value={form.description} onChange={(value) => updateForm("description", value)} rows={6}/>
            
            </BusinessFormSection>

            <BusinessFormSection title="Etiquetas" description="Ayudan a que los clientes encuentren mejor tu negocio.">
                <BusinessTagsInput label="Tags" value={form.tags} onChange={(value) => updateForm("tags", value)}/>
            </BusinessFormSection>

            <button type="button" className="w-full h rounded-full bg-primary text-white text-sm text-semibold" style={{ "--h": "42px", "--mnh": "42px" }} disabled={saving} onClick={handleSave}>
                {saving ? "Guardando cambios..." : "Guardar cambios"}
            </button>

        </div>
    )
}