'use client'
import Hero from "@/components/Hero";
import HowToBook from "@/components/HowToBook";
import OurSpecs from "@/components/OurSpec";
import Pricing from "@/components/Pricing";
import Services from "@/components/Services";
import PageEntryAnimation from "@/components/PageEntryAnimation";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
        document.title = "Cleanify | Professional Cleaning, Removal & Clearance Services";
    }, []);

    return (
        <div>
            <PageEntryAnimation>
                <Hero />
            </PageEntryAnimation>
            <PageEntryAnimation delay={100}>
                <HowToBook />
            </PageEntryAnimation>
            <PageEntryAnimation delay={200}>
                <Services />
            </PageEntryAnimation>
            <PageEntryAnimation delay={300}>
                <OurSpecs />
            </PageEntryAnimation>
            <PageEntryAnimation delay={400}>
                <Pricing />
            </PageEntryAnimation>
        </div>
    );
}
