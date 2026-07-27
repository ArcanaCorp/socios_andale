'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { registerBusinessPush } from "@/services/push.service";

export default function ButtonNotifications({ activeBusiness, user }) {
    
    const [pushEnabled, setPushEnabled] = useState(false);
    const [checkingPush, setCheckingPush] = useState(true);
    const [activatingPush, setActivatingPush] = useState(false);

    const checkPushStatus = async () => {
        try {
            if (
                typeof window === "undefined" ||
                !("serviceWorker" in navigator) ||
                !("PushManager" in window)
            ) {
                setPushEnabled(false);
                return;
            }

            if (Notification.permission !== "granted") {
                setPushEnabled(false);
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            setPushEnabled(!!subscription);

        } catch (error) {
            console.error("Error revisando notificaciones:", error);
            setPushEnabled(false);
        } finally {
            setCheckingPush(false);
        }
    };

    const handleEnablePush = async () => {
        try {
            setActivatingPush(true);

            await registerBusinessPush({
                businessId: activeBusiness.id,
                userId: user.id
            });

            setPushEnabled(true);

            toast.success("Notificaciones activadas", {
                description: "Recibirás avisos cuando entre un nuevo pedido."
            });

        } catch (error) {
            toast.warning("No se activaron las notificaciones", {
                description: error.message
            });
        } finally {
            setActivatingPush(false);
        }
    };

    useEffect(() => {
        checkPushStatus();
    }, []);

    return (
        <>
            {!checkingPush && !pushEnabled && (
                <button
                    type="button"
                    className="w-full h rounded-full bg-primary text-white text-xs text-semibold"
                    style={{ "--h": "40px" }}
                    onClick={handleEnablePush}
                    disabled={activatingPush}
                >
                    {activatingPush
                        ? "Activando notificaciones..."
                        : "Activar notificaciones push"}
                </button>
            )}
        </>
    );
}