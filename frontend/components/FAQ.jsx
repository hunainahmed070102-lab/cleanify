'use client'
import { useState } from 'react';

const faqData = [
    {
        question: "What property services do you offer?",
        answer: "We offer a comprehensive range of property services including home and office cleaning, removal services, waste disposal, house clearance, end of tenancy cleaning, and specialized solutions tailored to your needs."
    },
    {
        question: "How can I book a service?",
        answer: "You can easily book any of our services directly through our website by clicking the Get a Free Quote button, selecting your preferred service, choosing a convenient date and time, and submitting your details. Our team will confirm your booking shortly."
    },
    {
        question: "Are your staff insured and vetted?",
        answer: "Yes, all our team members are fully insured, background-checked, and professionally trained. We take great care in selecting our staff to ensure the highest standards of service and trustworthiness across all our property services."
    },
    {
        question: "What areas do you cover?",
        answer: "We provide professional property services across London and the surrounding areas. If you're unsure whether we cover your location, please get in touch and our team will be happy to confirm service availability."
    },
    {
        question: "Do you provide supplies and equipment?",
        answer: "Yes, for cleaning services we bring all necessary professional-grade supplies and equipment. For removal and disposal services, we provide all necessary packing materials, vehicles, and disposal equipment."
    },
    {
        question: "What is your cancellation policy?",
        answer: "At this time, we do not offer cancellations once a booking has been confirmed. If you need to make changes to your appointment, please contact our team as soon as possible and we will do our best to assist you."
    },
    {
        question: "How do I pay for your services?",
        answer: "At this time, payment is collected after the service has been completed to your satisfaction. We currently accept cash payments, and additional payment methods such as bank transfer and card payments will be introduced soon."
    },
    {
        question: "Do you offer regular service packages?",
        answer: "Yes, we offer weekly, bi-weekly, and monthly service packages at discounted rates. Regular customers also receive priority booking and exclusive discounts across all our property services."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-14 md:py-16 bg-white" id="faq">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="text-green-600 font-semibold uppercase tracking-widest text-sm mb-3">
                        FAQ's
                    </p>

                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-800">
                        Looking for Answer?
                    </h2>

                    <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                        Find answers to the most frequently asked questions about our property services in London.
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            {/* Question Button */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition"
                            >
                                <span className="font-medium text-slate-800 pr-4">
                                    {faq.question}
                                </span>

                                {/* Arrow Icon */}
                                <svg
                                    className={`w-6 h-6 text-green-600 flex-shrink-0 transition-transform duration-300 ${
                                        openIndex === index ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Answer */}
                            <div
                                className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                    openIndex === index ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                                }`}
                            >
                                <div className="px-5 pt-3 pb-5 text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}