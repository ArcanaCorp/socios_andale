import { db } from "@/libs/supabase";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

export async function registerBusinessPush({
    businessId,
    userId
}) {
    if (!businessId || !userId) {
        throw new Error("No se encontró el negocio o usuario.");
    }

    if (!("serviceWorker" in navigator)) {
        throw new Error("Este navegador no soporta Service Worker.");
    }

    if (!("PushManager" in window)) {
        throw new Error("Este navegador no soporta notificaciones push.");
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
        throw new Error("No se concedió permiso para notificaciones.");
    }

    const registration = await navigator.serviceWorker.register("/sw.js");

    const existingSubscription =
        await registration.pushManager.getSubscription();

    const subscription =
        existingSubscription ||
        await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

    const subscriptionJson = subscription.toJSON();

    const { error } = await db
        .from("business_push_subscriptions")
        .upsert({
            business_id: businessId,
            user_id: userId,
            subscription: subscriptionJson,
            endpoint: subscription.endpoint,
            user_agent: navigator.userAgent,
            is_active: true
        }, {
            onConflict: "endpoint"
        });

    if (error) {
        throw new Error(error.message);
    }

    return subscriptionJson;
}