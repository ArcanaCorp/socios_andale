'use client';

import { useEffect, useRef, useState } from "react";

export function useNewOrderSound() {
    const audioRef = useRef(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio("/sound.mp3");
        audioRef.current.preload = "auto";
    }, []);

    const enableSound = async () => {
        try {
            if (!audioRef.current) return;

            audioRef.current.volume = 1;
            await audioRef.current.play();
            audioRef.current.pause();
            audioRef.current.currentTime = 0;

            setEnabled(true);

            return true;
        } catch (error) {
            console.warn("El navegador bloqueó el sonido hasta interacción del usuario.");
            return false;
        }
    };

    const playNewOrderSound = async () => {
        try {
            if (!audioRef.current || !enabled) return;

            audioRef.current.currentTime = 0;
            await audioRef.current.play();

            if ("vibrate" in navigator) {
                navigator.vibrate([200, 100, 200]);
            }
        } catch (error) {
            console.error("No se pudo reproducir sonido:", error);
        }
    };

    return {
        enabled,
        enableSound,
        playNewOrderSound
    };
}