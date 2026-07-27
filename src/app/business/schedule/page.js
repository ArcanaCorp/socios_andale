'use client';

import CardSchedule from "@/components/Card/CardSchedule";
import BusinessFormSection from "@/components/Forms/BusinessFormSection";
import BusinessSwitch from "@/components/Inputs/BusinessSwitch";
import Loading from "@/components/views/Loading";

import { useAuth } from "@/context/AuthContext";
import { useBusinessAccess } from "@/context/BusinessAccessContext";
import { DAYS, normalizeOpeningHours } from "@/helpers/schedule.helper";
import { useBusinessEditor } from "@/hooks/useBusinessEditor";

import { toast } from "sonner";

export default function BusinessSchedulePage () {

    const { user } = useAuth();

    const { activeBusiness, loadingBusinessAccess, reloadBusinessAccess } = useBusinessAccess();
    const { form, saving, updateForm, saveBusiness } = useBusinessEditor({ business: activeBusiness, user, onUpdated: reloadBusinessAccess });

    const openingHours = normalizeOpeningHours(form.opening_hours);

    const updateDaySchedule = (dayKey, value) => {
        updateForm("opening_hours", {
            ...openingHours,
            [dayKey]: value
        });
    };

    const setEveryDayOpen = () => {
        const updated = DAYS.reduce((acc, day) => {
            acc[day.key] = {
                open: "16:00",
                close: "22:00",
                is_open: true
            };

            return acc;
        }, {});

        updateForm("opening_hours", updated);
    };

    const setWeekdaysOpen = () => {
        const updated = DAYS.reduce((acc, day) => {
            const isWeekend =
                day.key === "sabado" ||
                day.key === "domingo";

            acc[day.key] = {
                open: "16:00",
                close: "22:00",
                is_open: !isWeekend
            };

            return acc;
        }, {});

        updateForm("opening_hours", updated);
    };

    const setEveryDayClosed = () => {
        const updated = DAYS.reduce((acc, day) => {
            acc[day.key] = {
                open: openingHours?.[day.key]?.open || "09:00",
                close: openingHours?.[day.key]?.close || "18:00",
                is_open: false
            };

            return acc;
        }, {});

        updateForm("opening_hours", updated);
    };

    const handleSave = async () => {
        const payloadOpeningHours = normalizeOpeningHours(openingHours);

        const hasInvalidDay = DAYS.some((day) => {
            const currentDay = payloadOpeningHours[day.key];

            if (!currentDay.is_open) return false;

            return !currentDay.open || !currentDay.close;
        });

        if (hasInvalidDay) {
            toast.warning("Horario incompleto", {
                description: "Los días abiertos deben tener hora de apertura y cierre."
            });

            return;
        }

        const payload = {
            opening_hours: payloadOpeningHours
        };

        const result = await saveBusiness(payload);

        if (!result.ok) {
            toast.warning("Alerta", {
                description: result.message
            });

            return;
        }

        toast.success("Horarios actualizados", {
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
            
            <BusinessFormSection title="Estado de atención" description="Este interruptor es temporal. Sirve para marcar el negocio como abierto o cerrado sin cambiar el horario semanal.">
            
                <BusinessSwitch label="Negocio abierto ahora" description="Si está apagado, el negocio aparecerá como cerrado temporalmente aunque tenga horario activo." checked={form.is_open ?? true} onChange={(value) => updateForm("is_open", value)}/>
            
            </BusinessFormSection>

            <BusinessFormSection title="Acciones rápidas" description="Usa una plantilla base y luego ajusta cada día si lo necesitas.">

                <div className="w-full grid gap-sm">

                    <button type="button" className="w-full h rounded-md bg-surface text-sm text-semibold" style={{ "--h": "42px" }} onClick={setEveryDayOpen}>Abrir todos los días 16:00 - 22:00</button>
                    <button type="button" className="w-full h rounded-md bg-surface text-sm text-semibold" style={{ "--h": "42px" }} onClick={setWeekdaysOpen} >Abrir solo lunes a viernes</button>
                    <button type="button" className="w-full h rounded-md bg-surface text-danger text-sm text-semibold" style={{ "--h": "42px" }} onClick={setEveryDayClosed} >Marcar todos como cerrado</button>
                
                </div>

            </BusinessFormSection>

            <BusinessFormSection title="Horario semanal" description="Activa los días que atiendes e indica la hora de apertura y cierre.">

                {DAYS.map((day) => (
                    <CardSchedule key={day.key} day={day} schedule={openingHours} onChange={updateDaySchedule} />
                ))}

            </BusinessFormSection>

            <BusinessFormSection title="Vista pública" description="Así se interpretará tu horario en la app de clientes.">

                <div className="w-full flex flex-col gap-sm bg-surface rounded-md p-md">
                    {DAYS.map((day) => {
                        
                        const currentDay = openingHours[day.key];

                        return (
                            <div key={day.key} className="w-full flex items-center justify-between gap-md">
                                <span className="text-sm text-medium">{day.label}</span>
                                <span className={`text-xs text-semibold ${currentDay.is_open ? "text-success" : "text-muted"}`}>
                                    {currentDay.is_open ? `${currentDay.open} - ${currentDay.close}` : "Cerrado"}
                                </span>
                            </div>
                        );
                    })}
                </div>

            </BusinessFormSection>
            
            <button type="button" className="w-full h rounded-full bg-primary text-white text-sm text-semibold" style={{ "--h": "42px", "--mnh": "42px" }} disabled={saving} onClick={handleSave}>
                {saving ? "Guardando cambios..." : "Guardar cambios"}
            </button>

        </div>
    )
}