'use client'

import BusinessFormSection from "@/components/Forms/BusinessFormSection";
import BusinessInput from "@/components/Inputs/BusinessInput";
import BusinessSwitch from "@/components/Inputs/BusinessSwitch";
import BusinessTextarea from "@/components/Inputs/BusinessTextarea";
import Loading from "@/components/views/Loading";

import { useAuth } from "@/context/AuthContext";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { toNumberOrNull } from "@/helpers/formatted.helper";
import { useBusinessEditor } from "@/hooks/useBusinessEditor";

import { toast } from "sonner";

export default function BusinessOrdersPage () {

    const { user } = useAuth();

    const { activeBusiness, loadingBusinessAccess, reloadBusinessAccess } = useBusinessAccess();

    const { form, saving, updateForm, saveBusiness } = useBusinessEditor({ business: activeBusiness, user, onUpdated: reloadBusinessAccess });

    const orderSettings = form.order_settings || {};

    const updateOrderSettings = (field, value) => {
        updateForm("order_settings", {
            ...orderSettings,
            [field]: value
        });
    };

    const handleSave = async () => {
        const deliveryTimeMin = toNumberOrNull(form.delivery_time_min);
        const deliveryTimeMax = toNumberOrNull(form.delivery_time_max);

        const preparationTimeMin = toNumberOrNull(form.preparation_time_min);
        const preparationTimeMax = toNumberOrNull(form.preparation_time_max);

        const deliveryFee = Number(form.delivery_fee) || 0;
        const minOrderAmount = Number(form.min_order_amount) || 0;
        const freeDeliveryFrom = toNumberOrNull(form.free_delivery_from);
        const deliveryRadiusKm = toNumberOrNull(form.delivery_radius_km);

        if ( deliveryTimeMin !== null && deliveryTimeMax !== null && deliveryTimeMin > deliveryTimeMax) {
            toast.warning("Tiempo de delivery inválido", {
                description: "El tiempo mínimo no puede ser mayor al tiempo máximo."
            });

            return;
        }

        if ( preparationTimeMin !== null && preparationTimeMax !== null && preparationTimeMin > preparationTimeMax ) {
            toast.warning("Tiempo de preparación inválido", {
                description: "El tiempo mínimo no puede ser mayor al tiempo máximo."
            });

            return;
        }

        if (deliveryFee < 0 || minOrderAmount < 0) {
            toast.warning("Montos inválidos", {
                description: "Los montos no pueden ser negativos."
            });

            return;
        }

        const payload = {
            is_open: form.is_open ?? true,
            accepts_orders: form.accepts_orders ?? true,

            has_delivery: form.has_delivery ?? false,
            has_pickup: form.has_pickup ?? true,
            has_dine_in: form.has_dine_in ?? true,

            delivery_time_min: deliveryTimeMin,
            delivery_time_max: deliveryTimeMax,
            delivery_fee: deliveryFee,
            min_order_amount: minOrderAmount,
            free_delivery_from: freeDeliveryFrom,
            delivery_radius_km: deliveryRadiusKm,

            preparation_time_min: preparationTimeMin,
            preparation_time_max: preparationTimeMax,

            order_settings: {
                auto_accept_orders: orderSettings.auto_accept_orders ?? false,
                require_phone_confirmation: orderSettings.require_phone_confirmation ?? true,
                allow_customer_notes: orderSettings.allow_customer_notes ?? true,
                allow_order_cancellation: orderSettings.allow_order_cancellation ?? true,
                cancellation_limit_minutes: toNumberOrNull(
                    orderSettings.cancellation_limit_minutes
                ),
                customer_message: orderSettings.customer_message || null,
                internal_notes: orderSettings.internal_notes || null
            }
        };

        const result = await saveBusiness(payload);

        if (!result.ok) {
            toast.warning("Alerta", {
                description: result.message
            });

            return;
        }

        toast.success("Pedidos actualizados", {
            description: result.message
        });
    };

    if (loadingBusinessAccess) {
        return <Loading />;
    }

    if (!activeBusiness) {
        return (
            <main className="w-full h-full grid-center p-md">
                <p className="text-sm text-muted text-center">
                    No tienes un negocio activo.
                </p>
            </main>
        );
    }

    return (
        <div className="w-full h-full p-md flex flex-col gap-md scroll-y">

            <BusinessFormSection title="Estado operativo" description="Activa o pausa la atención del negocio en la app.">

                <BusinessSwitch label="Negocio abierto" description="Si está apagado, el negocio se mostrará como cerrado temporalmente." checked={form.is_open ?? true} onChange={(value) => updateForm("is_open", value)}/>
                <BusinessSwitch label="Aceptar pedidos" description="Si está apagado, los clientes podrán ver tu carta, pero no podrán realizar pedidos." checked={form.accepts_orders ?? true} onChange={(value) => updateForm("accepts_orders", value)}/>
            
            </BusinessFormSection>

            <BusinessFormSection title="Modalidades de atención" description="Define cómo pueden comprar tus clientes.">

                <BusinessSwitch label="Delivery" description="Permite que los clientes pidan con envío a domicilio." checked={form.has_delivery ?? false} onChange={(value) => updateForm("has_delivery", value)} />
                <BusinessSwitch label="Recojo en local" description="Permite que el cliente haga el pedido y lo recoja en tu negocio." checked={form.has_pickup ?? true} onChange={(value) => updateForm("has_pickup", value)} />
                <BusinessSwitch label="Consumo en local" description="Indica que el negocio atiende dentro del establecimiento." checked={form.has_dine_in ?? true} onChange={(value) => updateForm("has_dine_in", value)} />
            
            </BusinessFormSection>

            <BusinessFormSection title="Delivery" description="Configura tiempos, costo de envío y condiciones mínimas para pedidos delivery." >
                
                <div className="w-full grid gap-sm grid-cols-2">
                    
                    <BusinessInput label="Tiempo mínimo" type="number" placeholder="20" value={form.delivery_time_min} onChange={(value) => updateForm("delivery_time_min", value)}/>
                    <BusinessInput label="Tiempo máximo" type="number" placeholder="40" value={form.delivery_time_max} onChange={(value) => updateForm("delivery_time_max", value)} />
                
                </div>

                <BusinessInput label="Costo de delivery" type="number" placeholder="0.00" value={form.delivery_fee} onChange={(value) => updateForm("delivery_fee", value)}/>

                <BusinessInput label="Pedido mínimo" type="number" placeholder="0.00" value={form.min_order_amount} onChange={(value) => updateForm("min_order_amount", value)}/>

                <BusinessInput label="Delivery gratis desde" type="number" placeholder="Ej. 50.00" value={form.free_delivery_from} onChange={(value) => updateForm("free_delivery_from", value) }/>

                <BusinessInput label="Radio de delivery en km" type="number" placeholder="Ej. 3" value={form.delivery_radius_km} onChange={(value) => updateForm("delivery_radius_km", value)}/>

            </BusinessFormSection>

            <BusinessFormSection title="Preparación" description="Tiempo estimado para preparar un pedido antes de entregarlo o tenerlo listo para recojo.">

                <div className="w-full grid gap-sm grid-cols-2">

                    <BusinessInput label="Preparación mínima" type="number" placeholder="20" value={form.preparation_time_min} onChange={(value) => updateForm("preparation_time_min", value)} />
                    <BusinessInput label="Preparación máxima" type="number" placeholder="40" value={form.preparation_time_max} onChange={(value) => updateForm("preparation_time_max", value)} />
                
                </div>

            </BusinessFormSection>

            <BusinessFormSection title="Reglas de pedidos" description="Ajustes generales sobre cómo se gestionan los pedidos.">

                <BusinessSwitch label="Aceptar pedidos automáticamente" description="Si está apagado, cada pedido quedará pendiente hasta que el negocio lo acepte." checked={orderSettings.auto_accept_orders ?? false} onChange={(value) => updateOrderSettings("auto_accept_orders", value)} />
                <BusinessSwitch label="Solicitar teléfono" description="Recomendado para confirmar pedidos por WhatsApp o llamada." checked={orderSettings.require_phone_confirmation ?? true} onChange={(value) => updateOrderSettings("require_phone_confirmation", value)} />
                <BusinessSwitch label="Permitir notas del cliente" description="Permite que el cliente agregue instrucciones al pedido." checked={orderSettings.allow_customer_notes ?? true} onChange={(value) => updateOrderSettings("allow_customer_notes", value)} />
                <BusinessSwitch label="Permitir cancelación" description="Permite que el cliente cancele el pedido antes de que avance su preparación." checked={orderSettings.allow_order_cancellation ?? true} onChange={(value) => updateOrderSettings("allow_order_cancellation", value)} />
                <BusinessInput label="Límite de cancelación en minutos" type="number" placeholder="Ej. 5" value={orderSettings.cancellation_limit_minutes} onChange={(value) => updateOrderSettings("cancellation_limit_minutes", value)} />
                <BusinessTextarea label="Mensaje para clientes" placeholder="Ej. Gracias por tu pedido. Te confirmaremos por WhatsApp." value={orderSettings.customer_message} onChange={(value) => updateOrderSettings("customer_message", value)} rows={3} />
                <BusinessTextarea label="Notas internas" placeholder="Ej. Confirmar pedidos grandes antes de preparar." value={orderSettings.internal_notes} onChange={(value) => updateOrderSettings("internal_notes", value)} rows={3} />
            
            </BusinessFormSection>
            
            <button type="button" className="w-full h rounded-full bg-primary text-white text-sm text-semibold" style={{ "--h": "42px", "--mnh": "42px" }} disabled={saving} onClick={handleSave}>
                {saving ? "Guardando cambios..." : "Guardar cambios"}
            </button>
            
        </div>
    )
}