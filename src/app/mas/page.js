'use client';

import { db } from "@/libs/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MasPage () {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);

            const { error } = await db.auth.signOut({
                scope: 'local'
            });

            if (error) {
                throw error;
            }

            router.replace('/auth/login');
            router.refresh();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full p-md scroll-y">
            <button onClick={handleLogout}>{loading ? 'Cerrando...' : 'Cerrar sesión'}</button>
        </div>
    )
}