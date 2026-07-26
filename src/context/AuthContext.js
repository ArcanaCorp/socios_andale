'use client';

import { db } from "@/libs/supabase";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loadAuth, setLoadAuth] = useState(true);

    useEffect(() => {

        let mounted = true;

        const loadSession = async () => {

            const { data: { session }, error } = await db.auth.getSession();

            if (!mounted) return;

            if (error) {
                console.error('Error loading session:', error);
            }

            setSession(session);
            setUser(session?.user ?? null);
            setLoadAuth(false);

        };

        loadSession();

        const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {

            if (!mounted) return;

            setSession(session);
            setUser(session?.user ?? null);
            setLoadAuth(false);

        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };

    }, []);

    const contextValue = {
        session,
        user,
        loadAuth,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );

}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }

    return context;

}