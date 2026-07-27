'use client'

import BusinessFormSection from "@/components/Forms/BusinessFormSection";
import BusinessInput from "@/components/Inputs/BusinessInput";
import BusinessSelect from "@/components/Inputs/BusinessSelect";
import BusinessSwitch from "@/components/Inputs/BusinessSwitch";
import Loading from "@/components/views/Loading";

import { useAuth } from "@/context/AuthContext";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { CURRENCY_OPTIONS } from "@/helpers/formatted.helper";
import { useBusinessEditor } from "@/hooks/useBusinessEditor";

import { toast } from "sonner";

export default function BusinessPaymentsPage () {

    const { user } = useAuth();

    const { activeBusiness, loadingBusinessAccess, reloadBusinessAccess } = useBusinessAccess();

    const { form, saving, updateForm, saveBusiness } = useBusinessEditor({ business: activeBusiness, user, onUpdated: reloadBusinessAccess});

    const handleSave = async () => {
        const payload = {
            currency: form.currency || "PEN",
            accepts_cash: form.accepts_cash ?? true,
            accepts_yape: form.accepts_yape ?? true,
            accepts_plin: form.accepts_plin ?? true,
            accepts_card: form.accepts_card ?? false,
            yape_number: form.accepts_yape ? form.yape_number?.trim() || null : null,
            plin_number: form.accepts_plin ? form.plin_number?.trim() || null : null
        };

        if ( payload.accepts_yape && !payload.yape_number) {
            toast.warning("Número de Yape requerido", {
                description: "Si aceptas Yape, debes ingresar el número de cobro."
            });
            return;
        }

        if ( payload.accepts_plin && !payload.plin_number ) {
            toast.warning("Número de Plin requerido", {
                description: "Si aceptas Plin, debes ingresar el número de cobro."
            });

            return;
        }

        if ( !payload.accepts_cash && !payload.accepts_yape && !payload.accepts_plin && !payload.accepts_card ) {
            toast.warning("Método de pago requerido", {
                description: "Debes activar al menos un método de pago."
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

        toast.success("Métodos de pago actualizados", {
            description: result.message
        });
    };

    if (loadingBusinessAccess) return <Loading />;

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

            <BusinessFormSection title="Moneda" description="Define la moneda principal que usará tu negocio para mostrar precios y pedidos.">
                
                <BusinessSelect label="Moneda" value={form.currency || "PEN"} onChange={(value) => updateForm("currency", value)} options={CURRENCY_OPTIONS} />
            
            </BusinessFormSection>

            <BusinessFormSection title="Pagos disponibles" description="Activa los métodos de pago que tu negocio aceptará en Ándale Ya!.">
                
                <BusinessSwitch label="Efectivo" description="El cliente pagará al recibir el pedido o al recogerlo en el local." checked={form.accepts_cash ?? true} onChange={(value) => updateForm("accepts_cash", value)} />
                <BusinessSwitch label="Yape" description="El cliente verá tu número de Yape y podrá adjuntar la captura de pago." checked={form.accepts_yape ?? true} onChange={(value) => updateForm("accepts_yape", value)} />

                {form.accepts_yape && (
                    <BusinessInput label="Número de Yape" type="tel" placeholder="987654321" value={form.yape_number} onChange={(value) => updateForm("yape_number", value)} maxLength={30} />
                )}

                <BusinessSwitch label="Plin" description="El cliente verá tu número de Plin y podrá adjuntar la captura de pago." checked={form.accepts_plin ?? true} onChange={(value) => updateForm("accepts_plin", value)} />

                {form.accepts_plin && (
                    <BusinessInput label="Número de Plin" type="tel" placeholder="987654321" value={form.plin_number} onChange={(value) => updateForm("plin_number", value)} maxLength={30} />
                )}

                <BusinessSwitch label="Tarjeta" description="Activa esta opción solo si tu negocio ya tiene pasarela de pago o POS disponible." checked={form.accepts_card ?? false} onChange={(value) => updateForm("accepts_card", value)} />
            
            </BusinessFormSection>

            <BusinessFormSection title="Vista para el cliente" description="Así se interpretará la configuración actual en la app de clientes.">

                <div className="w-full flex flex-col gap-sm bg-surface rounded-md p-md">

                    <div className="w-full flex items-center justify-between">
                        <span className="text-sm text-medium">Efectivo</span>
                        <span className={`text-xs text-semibold ${ form.accepts_cash ? "text-success" : "text-muted" }`}>{form.accepts_cash ? "Activo" : "Inactivo"}</span>
                    </div>

                    <div className="w-full flex items-center justify-between">
                        <span className="text-sm text-medium">Yape</span>
                        <span className={`text-xs text-semibold ${form.accepts_yape ? "text-success" : "text-muted" }`}>{form.accepts_yape ? form.yape_number || "Sin número" : "Inactivo"}</span>
                    </div>

                    <div className="w-full flex items-center justify-between">
                        <span className="text-sm text-medium">Plin</span>
                        <span className={`text-xs text-semibold ${form.accepts_plin ? "text-success" : "text-muted"}`}>{form.accepts_plin ? form.plin_number || "Sin número" : "Inactivo"}</span>
                    </div>

                    <div className="w-full flex items-center justify-between">
                        <span className="text-sm text-medium">Tarjeta</span>
                        <span className={`text-xs text-semibold ${form.accepts_card ? "text-success" : "text-muted"}`}>{form.accepts_card ? "Activo" : "Inactivo"}</span>
                    </div>

                </div>

            </BusinessFormSection>

            <button type="button" className="w-full h rounded-full bg-primary text-white text-sm text-semibold" style={{ "--h": "42px", "--mnh": "42px" }} disabled={saving} onClick={handleSave}>
                {saving ? "Guardando cambios..." : "Guardar cambios"}
            </button>
            
        </div>
    )
}