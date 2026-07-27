'use client';

import BusinessFormSection from "@/components/Forms/BusinessFormSection";
import BusinessInput from "@/components/Inputs/BusinessInput";
import BusinessTextarea from "@/components/Inputs/BusinessTextarea";
import Loading from "@/components/views/Loading";
import { useAuth } from "@/context/AuthContext";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { useBusinessEditor } from "@/hooks/useBusinessEditor";
import { toast } from "sonner";

export default function BusinessContactPage () {

    const { user } = useAuth();

    const { activeBusiness, loadingBusinessAccess, reloadBusinessAccess } = useBusinessAccess();

    const { form, saving, updateForm, saveBusiness } = useBusinessEditor({ business: activeBusiness, user, onUpdated: reloadBusinessAccess });

    const handleSave = async () => {
        const payload = {
            address: form.address?.trim() || null,
            reference: form.reference?.trim() || null,
            district: form.district?.trim() || "Jauja",
            province: form.province?.trim() || "Jauja",
            region: form.region?.trim() || "Junín",
            country: form.country?.trim() || "Perú",
            latitude: form.latitude !== "" && form.latitude !== null ? Number(form.latitude) : null,
            longitude: form.longitude !== "" && form.longitude !== null ? Number(form.longitude) : null,
            google_maps_url: form.google_maps_url?.trim() || null,
            phone: form.phone?.trim() || null,
            whatsapp: form.whatsapp?.trim() || null,
            email: form.email?.trim() || null,
            website_url: form.website_url?.trim() || null,
            facebook_url: form.facebook_url?.trim() || null,
            instagram_url: form.instagram_url?.trim() || null,
            tiktok_url: form.tiktok_url?.trim() || null
        };

        if (payload.latitude && Number.isNaN(payload.latitude)) {
            toast.warning("Latitud inválida", {
                description: "Ingresa una latitud válida."
            });

            return;
        }

        if (payload.longitude && Number.isNaN(payload.longitude)) {
            toast.warning("Longitud inválida", {
                description: "Ingresa una longitud válida."
            });

            return;
        }

        const result = await saveBusiness(payload);

        if (!result.ok) return toast.warning("Alerta", {description: result.message});

        toast.success("Contacto actualizado", { description: result.message });
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
            
            <BusinessFormSection title="Dirección del negocio" description="Esta información ayuda a que los clientes encuentren tu local y puedan pedir delivery correctamente.">
            
                <BusinessInput label="Dirección" placeholder="Ej. Jr. Tarapacá 493" value={form.address} onChange={(value) => updateForm("address", value)}/>

                <BusinessTextarea label="Referencia" placeholder="Ej. Frente al parque, al costado de..., puerta color..." value={form.reference} onChange={(value) => updateForm("reference", value)} rows={3}/>

                <div className="w-full grid gap-sm grid-cols-2">
                    <BusinessInput label="Distrito" placeholder="Jauja" value={form.district} onChange={(value) => updateForm("district", value)}/>
                    <BusinessInput label="Provincia" placeholder="Jauja" value={form.province} onChange={(value) => updateForm("province", value)}/>
                </div>

                <div className="w-full grid gap-sm grid-cols-2">
                    <BusinessInput label="Región" placeholder="Junín" value={form.region} onChange={(value) => updateForm("region", value)} />
                    <BusinessInput label="País" placeholder="Perú" value={form.country} onChange={(value) => updateForm("country", value)} />
                </div>

            </BusinessFormSection>

            <BusinessFormSection title="Mapa y coordenadas" description="Puedes pegar el enlace de Google Maps y, si lo tienes, colocar latitud y longitud.">

                <BusinessInput label="Link de Google Maps" placeholder="https://maps.google.com/..." value={form.google_maps_url} onChange={(value) => updateForm("google_maps_url", value)} />

                <div className="w-full grid gap-sm grid-cols-2">
                    <BusinessInput label="Latitud" type="number" placeholder="-11.7750000" value={form.latitude} onChange={(value) => updateForm("latitude", value)} />
                    <BusinessInput label="Longitud" type="number" placeholder="-75.5000000" value={form.longitude} onChange={(value) => updateForm("longitude", value)} />
                </div>

            </BusinessFormSection>

            <BusinessFormSection title="Canales de contacto" description="Estos datos serán visibles para que los clientes puedan comunicarse con tu negocio.">

                <BusinessInput label="Teléfono" type="tel" placeholder="064 000000" value={form.phone} onChange={(value) => updateForm("phone", value)} maxLength={30} />
                <BusinessInput label="WhatsApp" type="tel" placeholder="987654321" value={form.whatsapp} onChange={(value) => updateForm("whatsapp", value)} maxLength={30} />
                <BusinessInput label="Correo electrónico" type="email" placeholder="negocio@email.com" value={form.email} onChange={(value) => updateForm("email", value)} maxLength={160} />
            
            </BusinessFormSection>

            <BusinessFormSection title="Redes y enlaces" description="Agrega tus redes sociales oficiales para que los clientes puedan conocer más de tu negocio.">

                <BusinessInput label="Sitio web" placeholder="https://..." value={form.website_url} onChange={(value) => updateForm("website_url", value)} />
                <BusinessInput label="Facebook" placeholder="https://facebook.com/..." value={form.facebook_url} onChange={(value) => updateForm("facebook_url", value)} />
                <BusinessInput label="Instagram" placeholder="https://instagram.com/..." value={form.instagram_url} onChange={(value) => updateForm("instagram_url", value)} />
                <BusinessInput label="TikTok" placeholder="https://tiktok.com/@..." value={form.tiktok_url} onChange={(value) => updateForm("tiktok_url", value)} />
            
            </BusinessFormSection>

            <button type="button" className="w-full h rounded-full bg-primary text-white text-sm text-semibold" style={{ "--h": "42px", "--mnh": "42px" }} disabled={saving} onClick={handleSave}>
                {saving ? "Guardando cambios..." : "Guardar cambios"}
            </button>

        </div>
    )
}