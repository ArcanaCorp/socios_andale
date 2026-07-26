'use client';

import { useState } from 'react';
import { MODE_ENV } from '@/config';
import { db } from '@/libs/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    const [loadingProvider, setLoadingProvider] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleOAuth = async (provider) => {
        try {
            setLoadingProvider(provider);
            setErrorMessage('');

            const redirectTo = MODE_ENV === 'develop' ? window.location.origin : 'https://socio.andaleya.pe';

            const { error } = await db.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo
                }
            });

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error(`Error con ${provider}:`, error);
            setErrorMessage('No pudimos iniciar sesión. Inténtalo nuevamente.');
            setLoadingProvider(null);
        }
    };

    const isLoading = Boolean(loadingProvider);

    return (
        <main className="w-full h-screen">
            <div className="w-full h grid-center" style={{'--h': 'calc(100dvh - 210px)'}}>
                <div className="w h" style={{'--w': '250px', '--h': '250px'}}>
                    <Image src="/logo512.png" width={250} height={250} alt="Logo de Ándale Ya" priority />
                </div>
            </div>

            <div className="w-full p-md flex flex-col gap-sm">
                <button type="button" onClick={() => handleOAuth('google')} disabled={isLoading} className="w-full h rounded-full bg-dark text-white text-sm text-medium disabled:opacity-60" style={{'--h': '48px'}}>
                    {loadingProvider === 'google' ? 'Conectando...' : ( <>Continuar con <b>Google</b></> )}
                </button>

                <button type="button" onClick={() => handleOAuth('facebook')} disabled={isLoading} className="w-full h rounded-full text-white text-sm text-medium disabled:opacity-60" style={{ '--h': '48px', backgroundColor: '#1877F2'}}>
                    {loadingProvider === 'facebook' ? 'Conectando...' : (<>Continuar con <b>Facebook</b></>)}
                </button>

                {errorMessage && (
                    <p role="alert" className="text-xs text-center" style={{ color: '#b42318' }}>{errorMessage}</p>
                )}

                <p className="text-xs text-muted text-center">
                    Al continuar, aceptas nuestros{' '}
                    <Link href="https://andaleya.pe/terms" target="_blank" rel="noopener noreferrer" className="text-dark">
                        <b>Términos y Condiciones</b>
                    </Link>
                    , la{' '}
                    <Link href="https://andaleya.pe/terms/policy" target="_blank" rel="noopener noreferrer" className="text-dark">
                        <b>Política de Privacidad</b>
                    </Link>{' '}
                    y la{' '}
                    <Link href="https://andaleya.pe/terms/data-policy" target="_blank" rel="noopener noreferrer" className="text-dark">
                        <b>Política de Uso de Datos</b>
                    </Link>
                    .
                </p>
            </div>
        </main>
    );
}