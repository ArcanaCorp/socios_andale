'use client';

import CardStatus from "@/components/Card/CardStatus";
import BusinessFormSection from "@/components/Forms/BusinessFormSection";
import BusinessImageField from "@/components/Inputs/BusinessImageField";
import BusinessInput from "@/components/Inputs/BusinessInput";
import BusinessSwitch from "@/components/Inputs/BusinessSwitch";
import BusinessTextarea from "@/components/Inputs/BusinessTextarea";
import Loading from "@/components/views/Loading";

import { useAuth } from "@/context/AuthContext";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { useBusinessEditor } from "@/hooks/useBusinessEditor";

import { toast } from "sonner";

export default function BusinessVisibilityPage () {

    const { user } = useAuth();

    const { activeBusiness, loadingBusinessAccess, reloadBusinessAccess } = useBusinessAccess();

    const { form, saving, uploadingField, updateForm, saveBusiness, uploadImageField } = useBusinessEditor({
        business: activeBusiness,
        user,
        onUpdated: reloadBusinessAccess
    });

    const publicUrl = activeBusiness?.slug ? `https://andaleya.pe/foodies/${activeBusiness.slug}` : null;

    const previewTitle = form.meta_title || form.commercial_name || form.name || "Nombre del negocio";

    const previewDescription = form.meta_description || form.short_description || "Descripción breve del negocio para buscadores y redes sociales.";

    const previewImage = form.og_image_url || form.cover_image_url || form.profile_image_url || null;

    const handleUploadOgImage = async (file) => {
        try {
            await uploadImageField({
                field: "og_image_url",
                folder: "seo",
                file
            });

            toast.success("Imagen subida", {
                description: "La imagen SEO se cargó correctamente."
            });

        } catch (error) {
            toast.error("Error", {
                description: error.message || "No se pudo subir la imagen."
            });
        }
    };

    const handleSave = async () => {
        const payload = {
            is_active: form.is_active ?? true,

            meta_title: form.meta_title?.trim() || null,
            meta_description: form.meta_description?.trim() || null,
            og_image_url: form.og_image_url || null
        };

        if (payload.meta_title && payload.meta_title.length > 180) {
            toast.warning("Título muy largo", {
                description: "El título SEO no debe superar los 180 caracteres."
            });

            return;
        }

        if (payload.meta_description && payload.meta_description.length > 260) {
            toast.warning("Descripción muy larga", {
                description: "La descripción SEO no debe superar los 260 caracteres."
            });

            return;
        }

        const result = await saveBusiness(payload);

        if (!result.ok) {
            toast.warning("Alerta", {
                description: result.message
            });

            return;
        }

        toast.success("Visibilidad actualizada", {
            description: result.message
        });
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

            <BusinessFormSection title="Publicación" description="Activa o pausa la visibilidad pública de tu negocio.">

                <BusinessSwitch label="Negocio visible" description="Si está apagado, el negocio dejará de aparecer públicamente en la app de clientes." checked={form.is_active ?? true} onChange={(value) => updateForm("is_active", value)} />

                {publicUrl && (
                    <div className="w-full flex flex-col gap-xs bg-surface rounded-md p-md">
                        <p className="text-xs text-muted">Enlace público</p>
                        <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm text-primary text-semibold break-all">{publicUrl}</a>
                    </div>
                )}

            </BusinessFormSection>

            <BusinessFormSection title="Estado en Ándale" description="Estos estados ayudan a dar confianza y mayor exposición dentro de la plataforma.">
                
                <CardStatus label="Negocio verificado" description="La verificación es gestionada por Ándale para confirmar que el negocio es real." active={form.is_verified ?? false} activeText="Verificado" inactiveText="No verificado" />
                <CardStatus label="Negocio destacado" description="Los negocios destacados pueden tener mayor exposición en secciones principales." active={form.is_featured ?? false} activeText="Destacado" inactiveText="Normal" />

            </BusinessFormSection>

            <BusinessFormSection title="SEO y vista previa" description="Personaliza cómo se verá tu negocio cuando se comparta en redes sociales o aparezca en buscadores.">
                
                <BusinessInput label="Título SEO" placeholder="Ej. Killa Farma | Farmacia y delivery en Jauja" value={form.meta_title} onChange={(value) => updateForm("meta_title", value)} maxLength={180} />
                <BusinessTextarea label="Descripción SEO" placeholder="Describe brevemente tu negocio, ubicación y propuesta principal." value={form.meta_description} onChange={(value) => updateForm("meta_description", value)} rows={4} maxLength={260} />
                <BusinessImageField label="Imagen para compartir" value={form.og_image_url} loading={uploadingField === "og_image_url"} aspect="cover" onChange={handleUploadOgImage} />

            </BusinessFormSection>

            <BusinessFormSection title="Vista previa pública" description="Referencia aproximada de cómo podría verse el negocio al compartirlo.">

                <div className="w-full bg-surface rounded-md hidden">

                    <div className="w-full h bg-white center hidden" style={{ "--h": "150px" }}>
                        {previewImage ? (
                            <img src={previewImage} alt={previewTitle} className="w-full h-full object-cover"/>
                        ) : (
                            <p className="text-xs text-muted">Sin imagen de vista previa</p>
                        )}
                    </div>

                    <div className="w-full flex flex-col gap-xs p-md">
                        <p className="text-xs text-muted">andaleya.pe</p>
                        <h3 className="text-md text-semibold">{previewTitle}</h3>
                        <p className="text-xs text-muted">{previewDescription}</p>
                    </div>

                </div>

            </BusinessFormSection>
            
            <button type="button" className="w-full h rounded-full bg-primary text-white text-sm text-semibold" style={{ "--h": "42px", "--mnh": "42px" }} disabled={saving} onClick={handleSave}>
                {saving ? "Guardando cambios..." : "Guardar cambios"}
            </button>

        </div>
    )
}