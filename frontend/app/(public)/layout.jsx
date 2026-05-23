'use client'
import Navbar from "@/components/Navbar";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import PageEntryAnimation from "@/components/PageEntryAnimation";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }) {
    const pathname = usePathname();
    const isBookingPage = pathname === '/booking';
    const isServicesPage = pathname === '/services';
    const isTrackingPage = pathname === '/track-booking';
    const hideSections = isBookingPage || isServicesPage || isTrackingPage;

    return (
        <>
            <Navbar />
            {children}
            {!hideSections && (
                <PageEntryAnimation delay={100}>
                    <Reviews />
                </PageEntryAnimation>
            )}
            {!hideSections && (
                <PageEntryAnimation delay={200}>
                    <FAQ />
                </PageEntryAnimation>
            )}
            {!hideSections && (
                <PageEntryAnimation delay={300}>
                    <CTA />
                </PageEntryAnimation>
            )}
            <Footer />
        </>
    );
}
