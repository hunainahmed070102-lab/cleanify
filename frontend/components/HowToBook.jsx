import { ClipboardList, CalendarCheck, BadgeCheck } from 'lucide-react';

const HowToBook = () => {
    const steps = [
        {
            number: '1',
            icon: ClipboardList,
            title: 'Select Service',
            description: 'Choose from our wide range of professional cleaning, removal, disposal, and clearance services.'
        },
        {
            number: '2',
            icon: CalendarCheck,
            title: 'Book Appointment',
            description: 'Pick your preferred date and time. We offer flexible scheduling to fit your needs.'
        },
        {
            number: '3',
            icon: BadgeCheck,
            title: 'Get It Done',
            description: 'Our professional team arrives on time and completes the job to your satisfaction. Pay after service!'
        }
    ];

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-14 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-green-600 font-semibold uppercase tracking-widest text-sm mb-3">
                        Process
                    </p>
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-800">
                        How to Book
                    </h2>
                    <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                        Book your service in just 3 easy steps. It's quick, simple, and hassle-free!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 left-[calc(50%+32px)] w-[calc(100%-64px)] h-0.5 bg-green-600 -translate-y-1/2" />
                            )}
                            
                            <div className="relative bg-white rounded-2xl p-8 border-2 border-slate-100 hover:border-green-600 hover:shadow-xl transition-all duration-300 group h-full min-h-[280px] flex flex-col">
                                {/* Step Number Badge */}
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="mb-6 mt-2">
                                    <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                                        <step.icon className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-green-600 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed flex-1">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        Book Your Service Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HowToBook;
