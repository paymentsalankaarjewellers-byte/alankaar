import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-gold">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Info */}
                    <div>
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="bg-black p-2 rounded-xl shadow-2xl border border-white/5 transition-transform hover:scale-105">
                                <img 
                                    src={logo} 
                                    alt="Alankaar Logo" 
                                    className="h-12 w-auto object-contain" 
                                />
                            </div>
                            <span className="font-playfair font-bold text-2xl tracking-wide uppercase text-white">
                                Alankaar
                            </span>
                        </Link>
                        <p className="text-gray-400 font-light leading-relaxed mb-6">
                            Timeless gold and silver jewellery crafted with elegance and precision. Discover jewellery that makes every moment special.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/alankaar_jewellers1?igsh=MTlmdmh1dHQyZXM5dQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61580687116115" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="https://youtube.com/@alankaarjewellers?si=dl580OlMaSbkJ2eY" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold transition-colors">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-playfair text-xl mb-6 text-gold">Quick Links</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/collections" className="text-gray-400 hover:text-white transition-colors">Collections</Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-playfair text-xl mb-6 text-gold">Categories</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/collections?category=Necklace" className="text-gray-400 hover:text-white transition-colors">Necklace</Link>
                            </li>
                            <li>
                                <Link to="/collections?category=Earrings" className="text-gray-400 hover:text-white transition-colors">Earrings</Link>
                            </li>
                            <li>
                                <Link to="/collections?category=Bangles" className="text-gray-400 hover:text-white transition-colors">Bangles</Link>
                            </li>
                            <li>
                                <Link to="/collections?category=Vaddanams" className="text-gray-400 hover:text-white transition-colors">Vaddanams</Link>
                            </li>
                            <li>
                                <Link to="/collections?category=Premium bridal" className="text-gray-400 hover:text-white transition-colors">Premium Bridal</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-playfair text-xl mb-6 text-gold">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-gray-400">
                                <MapPin className="text-gold shrink-0 mt-1" size={20} />
                                <span>Sharmika nagar, Moulali, Secunderabad, Telangana 500040</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Phone className="text-gold shrink-0" size={20} />
                                <span>+91 6281282284</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Mail className="text-gold shrink-0" size={20} />
                                <span>sales.alankaarjewellers@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Alankaar Jewellers. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
