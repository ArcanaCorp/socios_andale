export const ORDER_FILTERS = [
    {
        label: "Todos",
        value: "all"
    },
    {
        label: "Pendientes",
        value: "pending"
    },
    {
        label: "Aceptados",
        value: "accepted"
    },
    {
        label: "Preparando",
        value: "preparing"
    },
    {
        label: "Completados",
        value: "completed"
    },
    {
        label: "Cancelados",
        value: "cancelled"
    },
    {
        label: "Rechazados",
        value: "rejected"
    }
];

export const STATUS_LABELS = {
    pending: "Pendiente",
    accepted: "Aceptado",
    preparing: "Preparando",
    ready: "Listo",
    on_the_way: "En camino",
    completed: "Completado",
    cancelled: "Cancelado",
    rejected: "Rechazado"
};

export const PAYMENT_LABELS = {
    cash: "Efectivo",
    yape: "Yape",
    plin: "Plin",
    card: "Tarjeta",
    other: "Otro"
};

export const ORDER_TYPE_LABELS = {
    delivery: "Delivery",
    pickup: "Recojo",
    dine_in: "En local"
};

export const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export const formatDate = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleString("es-PE", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export const getStatusClass = (status) => {
    if (status === "pending") return "bg-warning-light text-warning";
    if (status === "accepted") return "bg-primary text-white";
    if (status === "preparing") return "bg-primary text-white";
    if (status === "completed") return "bg-success-light text-success";
    if (status === "cancelled") return "bg-danger-light text-danger";
    if (status === "rejected") return "bg-danger-light text-danger";

    return "bg-surface text-muted";
}