'use client';

import { getMyBusinessMemberships } from "@/services/business-members.service";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const BusinessAccessContext = createContext(null);

const getStorageKey = (userId) => {
    return `andale_socio_business_${userId}`;
};

export function BusinessAccessProvider({ children }) {
    const { user, loadAuth } = useAuth();

    const [memberships, setMemberships] = useState([]);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);
    const [loadingBusinessAccess, setLoadingBusinessAccess] = useState(true);

    const loadMemberships = async () => {
        try {
            if (!user?.id) {
                setMemberships([]);
                setSelectedBusinessId(null);
                setLoadingBusinessAccess(false);
                return;
            }

            setLoadingBusinessAccess(true);

            const data = await getMyBusinessMemberships(user.id);

            setMemberships(data);

            const savedBusinessId = localStorage.getItem(
                getStorageKey(user.id)
            );

            const savedMembership = data.find(
                (item) => item.business_id === savedBusinessId
            );

            if (savedMembership) {
                setSelectedBusinessId(savedMembership.business_id);
            } else if (data.length > 0) {
                setSelectedBusinessId(data[0].business_id);

                localStorage.setItem(
                    getStorageKey(user.id),
                    data[0].business_id
                );
            }

        } catch (error) {
            console.error("Error loading business access:", error);
            setMemberships([]);
            setSelectedBusinessId(null);
        } finally {
            setLoadingBusinessAccess(false);
        }
    };

    useEffect(() => {
        if (loadAuth) return;

        loadMemberships();
    }, [loadAuth, user?.id]);

    const activeMembership = useMemo(() => {
        if (!selectedBusinessId) return memberships[0] || null;

        return (
            memberships.find(
                (item) => item.business_id === selectedBusinessId
            ) || memberships[0] || null
        );
    }, [memberships, selectedBusinessId]);

    const activeBusiness = activeMembership?.businesses || null;

    const selectBusiness = (businessId) => {
        if (!user?.id || !businessId) return;

        setSelectedBusinessId(businessId);

        localStorage.setItem(
            getStorageKey(user.id),
            businessId
        );
    };

    const hasBusinessAccess = memberships.length > 0;

    const contextValue = {
        memberships,
        activeMembership,
        activeBusiness,
        selectedBusinessId,

        hasBusinessAccess,
        loadingBusinessAccess,

        selectBusiness,
        reloadBusinessAccess: loadMemberships
    };

    return (
        <BusinessAccessContext.Provider value={contextValue}>
            {children}
        </BusinessAccessContext.Provider>
    );
}

export function useBusinessAccess() {
    const context = useContext(BusinessAccessContext);

    if (!context) {
        throw new Error(
            "useBusinessAccess debe usarse dentro de BusinessAccessProvider"
        );
    }

    return context;
}