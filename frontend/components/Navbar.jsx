'use client'
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ServicesDropdown from "./ServicesDropdown";

const Navbar = () => {

    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState('')
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const cartCount = useSelector(state => state.cart.total)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const handleNavigation = (e, sectionId) => {
        e.preventDefault();
        
        // If not on homepage, navigate to homepage first
        if (pathname !== '/') {
            router.push(`/#${sectionId}`);
            return;
        }
        
        // If on homepage, scroll to section
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const scrollToTop = (e) => {
        e.preventDefault();
        
        // If not on homepage, navigate to homepage
        if (pathname !== '/') {
            router.push('/');
            return;
        }
        
        // If on homepage, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const isHomePage = pathname === '/';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-md' 
                : isHomePage 
                    ? 'bg-transparent border-b border-white/20' 
                    : 'bg-white shadow-sm'
        }`}>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className={`relative text-4xl font-semibold transition-colors ${
                        isScrolled || !isHomePage ? 'text-slate-700' : 'text-white drop-shadow-lg'
                    }`}>
                        <span className="text-green-600">Clean</span>ify<span className="text-green-600">.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className={`hidden sm:flex items-center gap-4 lg:gap-8 transition-colors ${
                        isScrolled || !isHomePage ? 'text-slate-600' : 'text-white'
                    }`}>
                        <a href="/" onClick={scrollToTop} className="hover:text-green-600 transition cursor-pointer font-medium drop-shadow-md">Home</a>
                        <ServicesDropdown isTransparent={!isScrolled && isHomePage} />
                        <a href="/#pricing" onClick={(e) => handleNavigation(e, 'pricing')} className="hover:text-green-600 transition cursor-pointer font-medium drop-shadow-md">Pricing</a>
                        <a href="/#reviews" onClick={(e) => handleNavigation(e, 'reviews')} className="hover:text-green-600 transition cursor-pointer font-medium drop-shadow-md">Reviews</a>
                        <a href="/#faq" onClick={(e) => handleNavigation(e, 'faq')} className="hover:text-green-600 transition cursor-pointer font-medium drop-shadow-md">FAQ</a>
                        <Link href="/track-booking" className="hover:text-green-600 transition cursor-pointer font-medium drop-shadow-md">Track Booking</Link>
                        <a href="/#footer" onClick={(e) => handleNavigation(e, 'footer')} className="hover:text-green-600 transition cursor-pointer font-medium drop-shadow-md">Contact</a>
                        

                        <Link href="/booking" className="px-8 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-full shadow-lg hover:shadow-xl">
                            Book Now
                        </Link>

                    </div>

                    {/* Mobile Menu Button */}
                    <div className="sm:hidden flex items-center gap-2">
                        <Link href="/booking" className="px-5 py-1.5 bg-green-600 hover:bg-green-700 text-sm transition text-white rounded-full shadow-lg">
                            Book Now
                        </Link>
                        <button 
                            onClick={toggleMobileMenu}
                            className={`p-2 transition ${
                                isScrolled || !isHomePage ? 'text-slate-600 hover:text-green-600' : 'text-white hover:text-green-400'
                            }`}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
                    <div className="max-w-7xl mx-auto py-4 px-6 flex flex-col gap-4">
                        <a href="/" onClick={(e) => { scrollToTop(e); closeMobileMenu(); }} className="text-slate-600 hover:text-green-600 transition py-2 font-medium">Home</a>
                        <a href="/#services" onClick={(e) => { handleNavigation(e, 'services'); closeMobileMenu(); }} className="text-slate-600 hover:text-green-600 transition py-2 font-medium">Services</a>
                        <a href="/#pricing" onClick={(e) => { handleNavigation(e, 'pricing'); closeMobileMenu(); }} className="text-slate-600 hover:text-green-600 transition py-2 font-medium">Pricing</a>
                        <a href="/#reviews" onClick={(e) => { handleNavigation(e, 'reviews'); closeMobileMenu(); }} className="text-slate-600 hover:text-green-600 transition py-2 font-medium">Reviews</a>
                        <a href="/#faq" onClick={(e) => { handleNavigation(e, 'faq'); closeMobileMenu(); }} className="text-slate-600 hover:text-green-600 transition py-2 font-medium">FAQ</a>
                        <Link href="/track-booking" onClick={closeMobileMenu} className="text-slate-600 hover:text-green-600 transition py-2 font-medium">Track Booking</Link>
                        <a href="/#footer" onClick={(e) => { handleNavigation(e, 'footer'); closeMobileMenu(); }} className="text-slate-600 hover:text-green-600 transition py-2 font-medium">Contact</a>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar