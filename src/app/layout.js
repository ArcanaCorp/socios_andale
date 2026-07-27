import { Montserrat } from "next/font/google";
import '@/styles/global.css';
import { Provider } from "@/providers/Provider";
import Tabs from "@/components/layout/Tabs";
import Header from "@/components/layout/Header";
import AppShell from "@/components/layout/AppShell";

const montserrat = Montserrat({
    variable: "--font-base",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

const SITE_URL = "https://socio.andaleya.pe";

export const metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Ándale Socios | Gestión de pedidos y carta digital",
        template: "%s | Ándale Socios"
    },

    description: "Ándale Socios permite a restaurantes y negocios gestionar pedidos, cartas digitales, productos, horarios y atención a clientes desde una plataforma simple y rápida.",

    applicationName: "Ándale Socios",

    keywords: [
        "Ándale Socios",
        "Andale Socios",
        "gestión de pedidos",
        "panel para restaurantes",
        "dashboard restaurantes",
        "carta digital restaurantes",
        "pedidos digitales",
        "pedidos por WhatsApp",
        "restaurantes Jauja",
        "restaurantes Perú",
        "software para restaurantes",
        "sistema de pedidos"
    ],

    authors: [
        {
            name: "ARCANA CORP",
            url: "https://arcanacorp.dev"
        }
    ],

    creator: "ARCANA CORP",
    publisher: "ARCANA CORP",

    alternates: {
        canonical: "/"
    },

    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    },

    openGraph: {
        type: "website",
        locale: "es_PE",
        url: SITE_URL,
        siteName: "Ándale Socios",
        title: "Ándale Socios | Gestión de pedidos y carta digital",
        description:"Panel para restaurantes y negocios afiliados a Ándale Ya!: gestión de pedidos, carta digital, productos, horarios y operación diaria.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Ándale Socios - Gestión de pedidos para negocios"
            }
        ]
    },

    twitter: {
        card: "summary_large_image",
        title: "Ándale Socios | Gestión de pedidos",
        description: "Gestiona pedidos, productos y carta digital desde el panel de negocios afiliados a Ándale Ya!.",
        images: ["/og-image.jpg"]
    },

    icons: {
        icon: [
            {
                url: "/favicon.ico"
            },
            {
                url: "/icon.png",
                type: "image/png",
                sizes: "512x512"
            }
        ],
        apple: [
            {
                url: "/apple-icon.png",
                sizes: "180x180",
                type: "image/png"
            }
        ]
    },

    manifest: "/manifest.json",

    appleWebApp: {
        capable: true,
        title: "Ándale Socios",
        statusBarStyle: "black-translucent"
    },

    formatDetection: {
        telephone: false,
        email: false,
        address: false
    },

    category: "business"
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#FFFFFF'
};

export default function RootLayout ({ children }) {
    return (
        <html lang="es" className={`${montserrat.variable}`} data-scroll-behavior="smooth">
            <body>
                <Provider>
                    <AppShell>
                        {children}
                    </AppShell>
                </Provider>
            </body>
        </html>
    )
}