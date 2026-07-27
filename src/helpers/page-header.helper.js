// helpers/page-header.helper.js

const PAGE_HEADER_RULES = [
    {
        match: (pathname) => pathname === "/business/visibility", title: 'Visibilidad pública'
    },
    {
        match: (pathname) => pathname === "/business/schedule", title: 'Horarios'
    },
    {
        match: (pathname) => pathname === "/business/payments", title: "Métodos de pago",
    },
    {
        match: (pathname) => pathname === "/business/orders", title: 'Pedidos y atención'
    },
    {
        match: (pathname) => pathname === "/business/contact", title: 'Ubicación y contacto'
    },
    {
        match: (pathname) => pathname === "/business/profile", title: "Perfil del negocio",
    },
    {
        match: (pathname) => pathname === "/menu/created", title: "Crear nuevo plato",
    },
    {
        match: (pathname) => /^\/menu\/[^/]+\/edit\/?$/.test(pathname), title: "Editar plato",
    },
    {
        match: (pathname) => /^\/menu\/[^/]+\/?$/.test(pathname), title: "Detalle del plato",
    },
    {
        match: (pathname) => pathname === "/menu" || pathname.startsWith("/menu/"), title: "Menú",
    },
    {
        match: (pathname) => pathname === "/tabler" || pathname.startsWith("/tabler/"), title: "Resumen",
    },
    {
        match: (pathname) => pathname === "/mas" || pathname.startsWith("/mas/"), title: "Más",
    },
    {
        match: (pathname) => pathname === "/", title: "Historial de pedidos",
    },
];

export function getPageTitle(pathname) {
    const page = PAGE_HEADER_RULES.find((rule) => rule.match(pathname));
    return page?.title || "Página";
}