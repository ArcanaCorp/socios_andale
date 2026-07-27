'use client';

import Icons from "@/components/Icons/Icons";
import { onLogout } from "@/functions/auth.function";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SETTINGS_OPTIONS = [
    {
        title: "Perfil del negocio",
        description: "Nombre, descripción, categoría, etiquetas e imágenes principales.",
        href: "/business/profile",
        badge: "Identidad",
        fields: [
            "name",
            "commercial_name",
            "description",
            "short_description",
            "business_type",
            "category",
            "tags",
            "profile_image_url",
            "cover_image_url",
            "gallery_images"
        ]
    },
    {
        title: "Ubicación y contacto",
        description: "Dirección, referencia, mapa, teléfono, WhatsApp, correo y redes.",
        href: "/business/contact",
        badge: "Contacto",
        fields: [
            "address",
            "reference",
            "district",
            "province",
            "region",
            "country",
            "latitude",
            "longitude",
            "google_maps_url",
            "phone",
            "whatsapp",
            "email",
            "website_url",
            "facebook_url",
            "instagram_url",
            "tiktok_url"
        ]
    },
    {
        title: "Pedidos y atención",
        description: "Activar pedidos, delivery, recojo, consumo en local y tiempos.",
        href: "/business/orders",
        badge: "Operación",
        fields: [
            "is_open",
            "accepts_orders",
            "has_delivery",
            "has_pickup",
            "has_dine_in",
            "delivery_time_min",
            "delivery_time_max",
            "delivery_fee",
            "min_order_amount",
            "free_delivery_from",
            "delivery_radius_km",
            "preparation_time_min",
            "preparation_time_max",
            "order_settings"
        ]
    },
    {
        title: "Métodos de pago",
        description: "Efectivo, Yape, Plin, tarjeta y números de cobro.",
        href: "/business/payments",
        badge: "Pagos",
        fields: [
            "currency",
            "accepts_cash",
            "accepts_yape",
            "accepts_plin",
            "accepts_card",
            "yape_number",
            "plin_number"
        ]
    },
    {
        title: "Horarios",
        description: "Días y horas de atención del negocio.",
        href: "/business/schedule",
        badge: "Atención",
        fields: [
            "opening_hours"
        ]
    },
    {
        title: "Visibilidad pública",
        description: "Estado del negocio, destacado, SEO y vista pública en Ándale Ya!.",
        href: "/business/visibility",
        badge: "Publicación",
        fields: [
            "is_active",
            "is_verified",
            "is_featured",
            "meta_title",
            "meta_description",
            "og_image_url"
        ]
    }
];

export default function MasPage () {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            const response = await onLogout();
            if (!response.ok) return toast.warning('No se pudo cerrar la sesión. Cierra y vuelva abrir.')
            router.replace('/auth/login');
            router.refresh();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full p-md scroll-y">
            <section className="w-full flex flex-col gap-sm mb-lg">
                {SETTINGS_OPTIONS.map((option) => (
                    <Link key={option.href} href={option.href} className="w-full bg-white border-thin border-surface rounded-md p-md flex items-center justify-between gap-md">
                        <div className="w-full flex flex-col gap-xs">
                            <div className="w-full flex items-center gap-sm">
                                <span className="badge">{option.badge}</span>
                            </div>
                            <h3 className="text-md text-semibold">{option.title}</h3>
                            <p className="text-xs text-muted">{option.description}</p>
                            <p className="text-2xs text-muted">{option.fields.length} campos configurables</p>
                        </div>
                        <span className="text-lg text-muted"><Icons name={'chevronRight'} /></span>
                    </Link>
                ))}
            </section>
            <section className="w-full flex flex-col gap-sm mb-lg">
                <button type="button" onClick={handleLogout} disabled={loading} className="w-full h rounded-md bg-surface text-danger text-sm text-semibold" style={{ "--h": "44px" }}>
                    {loading ? "Cerrando..." : "Cerrar sesión"}
                </button>
            </section>
        </div>
    )
}