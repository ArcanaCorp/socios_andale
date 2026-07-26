'use client';

import Loading from "@/components/views/Loading";
import { useAuth } from "@/context/AuthContext";
import { useBusinessAccess } from "@/context/BusinessAccessContext";

export default function OnboardingPage() {
    const { user, loadAuth } = useAuth();

    const { loadingBusinessAccess, hasBusinessAccess } = useBusinessAccess();

    if (loadAuth || loadingBusinessAccess) {
        return <Loading />;
    }

    if (hasBusinessAccess) {
        return <Loading />;
    }

    const message = `Hola *ARCANA*,\nNecesito ayuda para vincular mi negocio en Ándale Socios!.`

    return (
        <main className="w-full min-h-screen grid-center p-md bg-white">
            <section className="w-full max-w-md flex flex-col gap-md text-center">
                <div className="w-full flex flex-col gap-xs">
                    <h1 className="text-xl text-semibold">Bienvenido a Ándale Socios</h1>
                    <p className="text-sm text-muted">Tu cuenta ya inició sesión, pero aún no está asociada a un negocio.</p>
                </div>

                <div className="w-full bg-surface rounded-md p-md text-left">
                    <p className="text-xs text-muted">Cuenta detectada</p>
                    <p className="text-sm text-semibold">{user?.email}</p>
                </div>

                <div className="w-full flex flex-col gap-sm text-left">
                    <h3 className="text-md text-semibold">¿Qué sigue?</h3>
                    <p className="text-xs text-muted">Para ingresar al panel, <b>ARCANA</b> debe vincular este correo con el negocio correspondiente.</p>
                    <p className="text-xs text-muted">Si ya eres socio, solicita que activen tu acceso usando el correo mostrado arriba.</p>
                </div>

                <a href={`https://wa.me/51966327426/?text=${encodeURIComponent(message)}`} className="w-full h rounded-full bg-primary text-white center text-sm text-semibold" style={{ "--h": "44px" }} >Solicitar acceso</a>
            </section>
        </main>
    );
}