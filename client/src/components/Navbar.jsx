import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { getCartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Collections', path: '/collections' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header
            className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 font-poppins ${isScrolled
                ? 'bg-[#FDFCFB] shadow-sm'
                : 'bg-[#FDFCFB] border-b border-gray-100'
                }`}
        >
            {/* Top Marquee Bar */}
            <div className="bg-[#D4AF37] text-white py-1 md:py-1.5 overflow-hidden whitespace-nowrap relative border-b border-white/10">
                <div className="flex animate-marquee">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <span key={i} className="inline-block px-8 text-[10px] md:text-sm font-medium uppercase tracking-[0.2em]">
                            Bridal elegance • Exclusive Collection • Timeless Masterpieces
                        </span>
                    ))}
                </div>
            </div>

            <div className={`container mx-auto px-4 md:px-12 w-full max-w-[1400px] transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
                <div className="flex justify-between items-center w-full">
                    
                    {/* Brand Section (Left) */}
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="flex items-center gap-2 md:gap-4 group shrink-0">
                            <div className="transition-transform duration-300 group-hover:scale-110">
                                <img 
                                    src={logo} 
                                    alt="Alankaar Logo" 
                                    className="h-10 md:h-16 w-auto object-contain" 
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="font-playfair text-[#D4AF37] text-[18px] sm:text-[24px] md:text-[32px] leading-[1.1] tracking-tight whitespace-nowrap font-bold">
                                    Alankaar
                                </span>
                                <span className="text-[#333] font-normal text-[11px] sm:text-[14px] md:text-[16px] uppercase tracking-[0.2em] leading-none mt-0.5">
                                    Jewellers
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Center Navigation */}
                    <nav className="hidden md:flex items-center gap-12">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path && !location.search;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative text-[15px] transition-colors ${isActive ? 'text-[#D4AF37] font-medium' : 'text-[#4A5568] hover:text-[#D4AF37]'
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute left-0 right-0 -bottom-2 h-[2px] bg-[#D4AF37] w-full mt-1"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Action Icons (Right) */}
                    <div className="flex items-center gap-4 md:gap-7 flex-1 justify-end">
                        <Link to="/cart" className="relative text-[#4A5568] hover:text-[#D4AF37] transition-colors md:mr-2">
                            <ShoppingCart size={20} />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#E53E3E] text-white text-[11px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-[#4A5568] hover:text-[#D4AF37] transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#FDFCFB] shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col gap-4 animate-fade-in z-50 max-h-[70vh] overflow-y-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-[15px] font-medium py-3 border-b border-gray-100 transition-colors ${location.pathname === link.path ? 'text-[#D4AF37]' : 'text-[#4A5568]'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Navbar;
