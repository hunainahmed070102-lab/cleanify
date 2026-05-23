'use client'

const ServicesDropdown = () => {
    const scrollToServices = (e) => {
        e.preventDefault();
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <a 
            href="#services"
            onClick={scrollToServices}
            className="hover:text-green-600 transition cursor-pointer"
        >
            Services
        </a>
    );
};

export default ServicesDropdown;
