'use client';

import Header from "@/components/layout/Header";
import Tabs from "@/components/layout/Tabs";
import Loading from "@/components/views/Loading";

import { useAuth } from "@/context/AuthContext";
import { useBusinessAccess } from "@/context/BusinessAccessContext";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const isAuthRoute = (pathname) => {
    return pathname.startsWith("/auth");
};

const isOnboardingRoute = (pathname) => {
    return pathname.startsWith("/onboarding");
};

export default function AppShell({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const { user, loadAuth } = useAuth();

    const { hasBusinessAccess, loadingBusinessAccess } = useBusinessAccess();

    const publicRoute = isAuthRoute(pathname);
    const onboardingRoute = isOnboardingRoute(pathname);

    useEffect(() => {
        if (loadAuth || loadingBusinessAccess) return;

        if (!user && !publicRoute) {
            router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
            return;
        }

        if (user && !hasBusinessAccess && !publicRoute && !onboardingRoute) {
            router.replace("/onboarding");
            return;
        }

        if (user && hasBusinessAccess && onboardingRoute) {
            router.replace("/");
        }

    }, [
        loadAuth,
        loadingBusinessAccess,
        user,
        hasBusinessAccess,
        publicRoute,
        onboardingRoute,
        pathname,
        router
    ]);

    if (publicRoute || onboardingRoute) {
        return children;
    }

    if (loadAuth || loadingBusinessAccess || !user) {
        return <Loading />;
    }

    if (!hasBusinessAccess) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <main className="w-full h" style={{"--h": "calc(100dvh - 120px)"}}>
                {children}
            </main>
            <Tabs />
        </>
    );
}