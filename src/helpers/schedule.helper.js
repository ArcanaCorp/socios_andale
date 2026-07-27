export const DAYS = [
    {
        key: "lunes",
        label: "Lunes"
    },
    {
        key: "martes",
        label: "Martes"
    },
    {
        key: "miercoles",
        label: "Miércoles"
    },
    {
        key: "jueves",
        label: "Jueves"
    },
    {
        key: "viernes",
        label: "Viernes"
    },
    {
        key: "sabado",
        label: "Sábado"
    },
    {
        key: "domingo",
        label: "Domingo"
    }
];

export const DEFAULT_DAY = {
    open: "09:00",
    close: "18:00",
    is_open: false
};

export const DEFAULT_OPENING_HOURS = DAYS.reduce((acc, day) => {
    acc[day.key] = {
        ...DEFAULT_DAY
    };

    return acc;
}, {});

export const normalizeOpeningHours = (openingHours) => {
    const currentOpeningHours = openingHours || {};

    return DAYS.reduce((acc, day) => {
        acc[day.key] = {
            open: currentOpeningHours?.[day.key]?.open || DEFAULT_DAY.open,
            close: currentOpeningHours?.[day.key]?.close || DEFAULT_DAY.close,
            is_open: currentOpeningHours?.[day.key]?.is_open ?? DEFAULT_DAY.is_open
        };

        return acc;
    }, {});
}