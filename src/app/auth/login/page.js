'use client'
import { MODE_ENV } from "@/config";
import { db } from "@/libs/supabase";
import Image from "next/image"
import Link from "next/link"

export default function LoginPage () {

    const handleGoogle = async () => {
        const redirectTo = MODE_ENV === 'develop' ? window.location.origin : 'https://socio.andaleya.pe';

        const { error } = await db.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo
            }
        });

        if (error) {
            console.error('Error con Google:', error);
        }
    }

    return (
        <main className="w-full h-screen">
            <div className="w-full h grid-center" style={{"--h": "calc(100dvh - 160px)"}}>
                <div className="w h" style={{"--w": "250px", "--h": "250px"}}>
                    <Image src={'/logo512.png'} width={250} height={250} alt="Logo de Ándale Ya" />
                </div>
            </div>
            <div className="w-full p-md flex flex-col gap-sm">
                <button type="button" onClick={handleGoogle} className="w-full h rounded-full bg-dark text-white text-sm text-medium" style={{"--h": "48px"}}>Continuar con <b>Google</b></button>
                <p className="text-xs text-muted text-center">Al continuar con Google, aceptas nuestros <Link href={'/terms'} className="text-dark"><b>Términos y Condiciones</b></Link>, la <Link href={'/terms/policy'} className="text-dark"><b>Política de Privacidad</b></Link> y la <Link href={'/terms/data-policy'} className="text-dark"><b>Política de Uso de Datos</b></Link>.</p>
            </div>
        </main>
    )
}