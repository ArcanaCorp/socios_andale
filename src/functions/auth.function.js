import { db } from "@/libs/supabase";

export const onLogout = async () => {
    try {

        const { error } = await db.auth.signOut({
            scope: 'local'
        });
        
        if (error) {
            throw error;
        }

        return { ok: true }

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return { ok: false }
    }
};