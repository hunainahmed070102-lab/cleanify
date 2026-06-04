import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    metadataBase: new URL('https://cleanify.store'),
    title: {
        default: "Cleanify | Professional Cleaning, Removal & Clearance Services in London",
        template: "%s | Cleanify"
    },
    description: "Professional cleaning, removal, disposal, clearance, moving and commercial services across London. Trusted partner for spotless, organized, and clutter-free properties. Book now for same-day service.",
    keywords: [
        "cleaning services London",
        "removal services London",
        "disposal services London",
        "clearance services London",
        "moving services London",
        "commercial cleaning London",
        "end of tenancy cleaning London",
        "house clearance London",
        "rubbish removal London",
        "office cleaning London",
        "deep cleaning London",
        "property services London"
    ],
    authors: [{ name: "Cleanify" }],
    creator: "Cleanify",
    publisher: "Cleanify",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_GB',
        url: 'https://cleanify.store',
        siteName: 'Cleanify',
        title: 'Cleanify | Professional Cleaning, Removal & Clearance Services in London',
        description: 'Professional cleaning, removal, disposal, clearance, moving and commercial services across London. Trusted partner for spotless properties.',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Cleanify - Professional Property Services in London',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cleanify | Professional Cleaning, Removal & Clearance Services in London',
        description: 'Professional cleaning, removal, disposal, clearance, moving and commercial services across London.',
        images: ['/images/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            { url: '/icon.svg', type: 'image/svg+xml' },
            { url: '/favicon.svg', type: 'image/svg+xml' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcut: '/favicon.svg',
    },
    manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Preload hero image for instant loading */}
                <link
                    rel="preload"
                    href="/videos/hero.jpg"
                    as="image"
                    type="image/jpeg"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "Cleanify",
                            "image": "https://cleanify.store/images/og-image.jpg",
                            "@id": "https://cleanify.store",
                            "url": "https://cleanify.store",
                            "telephone": "+44-20-XXXX-XXXX",
                            "email": "info@cleanify.store",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "London",
                                "addressLocality": "London",
                                "addressRegion": "Greater London",
                                "postalCode": "W1",
                                "addressCountry": "GB"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": 51.5074,
                                "longitude": -0.1278
                            },
                            "openingHoursSpecification": {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": [
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                    "Sunday"
                                ],
                                "opens": "08:00",
                                "closes": "20:00"
                            },
                            "sameAs": [
                                "https://facebook.com/cleanify",
                                "https://twitter.com/cleanify",
                                "https://instagram.com/cleanify"
                            ],
                            "priceRange": "££",
                            "areaServed": {
                                "@type": "City",
                                "name": "London"
                            },
                            "hasOfferCatalog": {
                                "@type": "OfferCatalog",
                                "name": "Property Services",
                                "itemListElement": [
                                    {
                                        "@type": "Offer",
                                        "itemOffered": {
                                            "@type": "Service",
                                            "name": "Cleaning Services",
                                            "description": "Professional home, office, and deep cleaning services"
                                        }
                                    },
                                    {
                                        "@type": "Offer",
                                        "itemOffered": {
                                            "@type": "Service",
                                            "name": "Removal Services",
                                            "description": "Furniture and appliance removal services"
                                        }
                                    },
                                    {
                                        "@type": "Offer",
                                        "itemOffered": {
                                            "@type": "Service",
                                            "name": "Disposal Services",
                                            "description": "Rubbish collection and waste disposal"
                                        }
                                    },
                                    {
                                        "@type": "Offer",
                                        "itemOffered": {
                                            "@type": "Service",
                                            "name": "Clearance Services",
                                            "description": "House, garage, and estate clearance"
                                        }
                                    },
                                    {
                                        "@type": "Offer",
                                        "itemOffered": {
                                            "@type": "Service",
                                            "name": "Moving Services",
                                            "description": "Professional moving and packing services"
                                        }
                                    },
                                    {
                                        "@type": "Offer",
                                        "itemOffered": {
                                            "@type": "Service",
                                            "name": "Commercial Services",
                                            "description": "Commercial cleaning and property maintenance"
                                        }
                                    }
                                ]
                            }
                        })
                    }}
                />
            </head>
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <Toaster />
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
