import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { fetchSetting, fetchCategories, fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const DEFAULT_HERO = "https://images.unsplash.com/photo-1599643478524-fb66fa5320e5?q=80&w=2000&auto=format&fit=crop";

const DEFAULT_CAT_IMAGES = {
    "Necklace": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop",
    "Necklaces": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop",
    "Rings": "https://images.unsplash.com/photo-1605100804763-247f66126e28?w=800&auto=format&fit=crop",
    "Earrings": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop",
    "Bangles": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop",
    "Chains": "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&auto=format&fit=crop",
    "Silver Jewellery": "https://images.unsplash.com/photo-1620656798579-1984d9e974cb?w=800&auto=format&fit=crop",
    "Gold Jewellery": "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&auto=format&fit=crop",
    "Vaddanams": "https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800&auto=format&fit=crop",
    "Premium bridal": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
    "Other accessories": "https://images.unsplash.com/photo-1629020751628-48e811ded17e?w=800&auto=format&fit=crop",
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&auto=format&fit=crop&q=60";

const TESTIMONIALS = [
    {
        id: 1,
        name: "Ananya Sharma",
        role: "Valued Customer",
        review: "The quality of the gold and the intricacy of the design is simply unmatched. Alankaar Jewellers has become my go-to for all special occasions.",
        rating: 5
    },
    {
        id: 2,
        name: "Vikram Reddy",
        role: "Gifts Specialist",
        review: "I bought a silver set for my wife, and she was absolutely thrilled. The craftsmanship is excellent and the service was very professional.",
        rating: 5
    },
    {
        id: 3,
        name: "Priyanka Gupta",
        role: "Fashion Designer",
        review: "Elegant, timeless, and sophisticated. Their collections perfectly balance traditional heritage with modern aesthetics. Highly recommended!",
        rating: 5
    }
];

const Home = () => {
    const [heroSlides, setHeroSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch 3 slides
                const slidesData = [];
                for (let i = 1; i <= 3; i++) {
                    const [img, title, sub] = await Promise.all([
                        fetchSetting(`hero_image_${i}`).catch(() => ({ value: '' })),
                        fetchSetting(`hero_title_${i}`).catch(() => ({ value: '' })),
                        fetchSetting(`hero_subtitle_${i}`).catch(() => ({ value: '' }))
                    ]);
                    // Only add if at least image exists, else use default for slide 1
                    if (img.value || i === 1) {
                        slidesData.push({
                            image: img.value || DEFAULT_HERO,
                            title: title.value || (i === 1 ? "Elegance in Every Detail" : ""),
                            subtitle: sub.value || (i === 1 ? "Discover our curated collection of timeless gold and silver masterpieces." : "")
                        });
                    }
                }
                
                const [catData, prodData] = await Promise.all([
                    fetchCategories().catch(() => []),
                    fetchProducts().catch(() => [])
                ]);

                setHeroSlides(slidesData);
                setCategories(catData);
                setProducts(prodData.slice(0, 6));
            } catch (err) {
                console.error("Critical error loading home data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Auto-advance carousel
    useEffect(() => {
        if (heroSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [heroSlides]);

    return (
        <div className="bg-[#FAF9F6]">
            {/* Split Screen Hero Carousel */}
            <section className="relative min-h-[90vh] flex flex-col lg:flex-row overflow-hidden pt-[115px] lg:pt-[150px]">
                <div className="absolute inset-0 bg-[#FAF9F6] z-0" />
                
                {heroSlides.length > 0 && (
                    <div className="flex-1 flex flex-col lg:flex-row w-full relative z-10">
                        {/* Image Content (Top on Mobile, Right on Desktop) */}
                        <div className="w-full lg:flex-1 relative order-1 lg:order-2 h-[42%] md:h-[50%] lg:h-full group flex items-center justify-center px-6 lg:px-0">
                            <motion.div
                                key={`img-${currentSlide}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="relative lg:absolute lg:inset-0 p-1 lg:p-12 w-full h-full flex items-center justify-center mt-2 lg:mt-0"
                            >
                                <div className="max-w-[260px] md:max-w-[400px] lg:max-w-none w-full h-full lg:h-full rounded-[20px] lg:rounded-[40px] overflow-hidden shadow-xl lg:shadow-2xl shadow-gold/10 relative border-2 lg:border-8 border-white">
                                    <img
                                        src={heroSlides[currentSlide].image}
                                        alt={heroSlides[currentSlide].title}
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                        fetchPriority="high"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent lg:hidden" />
                                </div>
                            </motion.div>

                            {/* Decorative background shape */}
                            <div className="absolute top-1/2 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                        </div>

                        {/* Text Content (Bottom on Mobile, Left on Desktop) */}
                        <div className="flex-1 flex flex-col justify-center px-10 md:px-16 lg:px-24 py-6 md:py-8 lg:py-0 order-2 lg:order-1 text-center lg:text-left overflow-hidden">
                            <motion.div
                                key={`text-${currentSlide}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="max-w-xl mx-auto lg:mx-0"
                            >
                                <motion.span 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gold font-bold text-[9px] md:text-[11px] uppercase tracking-[0.4em] mb-3 md:mb-5 block"
                                >
                                    Exclusive Collection
                                </motion.span>
                                
                                <h1 className="font-playfair text-[26px] md:text-5xl lg:text-7xl font-bold text-[#1A202C] mb-3 md:mb-8 leading-[1.3] lg:leading-[1.1]">
                                    {heroSlides[currentSlide].title}
                                </h1>
                                
                                <p className="text-gray-500 text-[13px] md:text-base lg:text-xl font-light leading-relaxed mb-6 md:mb-12 max-w-[280px] md:max-w-md mx-auto lg:mx-0">
                                    {heroSlides[currentSlide].subtitle}
                                </p>
                                
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 mb-6 lg:mb-0">
                                    <Link to="/collections" className="bg-[#1A202C] hover:bg-gold text-white px-7 md:px-12 py-3 md:py-5 uppercase tracking-widest text-[9px] md:text-[11px] font-bold transition-all duration-300 shadow-xl shadow-black/10 hover:scale-105 active:scale-95 whitespace-nowrap">
                                        Shop Now
                                    </Link>
                                    <Link to="/about" className="bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-gold px-7 md:px-12 py-3 md:py-5 uppercase tracking-widest text-[9px] md:text-[11px] font-bold text-[#1A202C] transition-all duration-300 whitespace-nowrap">
                                        Our Story
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Carousel Indicators */}
                            <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-5 mt-6 lg:mt-24">
                                {heroSlides.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`transition-all duration-700 rounded-full ${currentSlide === idx ? 'w-10 md:w-20 h-[3px] md:h-[4px] bg-gold shadow-md shadow-gold/30' : 'w-4 md:w-8 h-[2px] bg-gray-200 hover:bg-gold/40'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Shop by Category — Moved after Hero */}
            <section className="py-12 md:py-24 bg-white relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                <div className="container mx-auto px-4 md:px-12 relative z-10">
                    <div className="text-center mb-10 md:mb-16 px-4">
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-playfair text-3xl md:text-5xl text-black mb-3 md:mb-4"
                        >
                            Shop By Category
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed text-sm md:text-base"
                        >
                            Explore our curated collection of traditional South Indian jewellery
                        </motion.p>
                    </div>

                    <motion.div 
                        initial="hidden"
                        animate={!loading && categories.length > 0 ? "show" : "hidden"}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 min-h-[300px]"
                    >
                        {Array.isArray(categories) && categories.length > 0 ? categories.slice(0, 6).map((cat, idx) => {
                            return (
                                <motion.div
                                    key={cat.id ?? idx}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.95, y: 20 },
                                        show: { opacity: 1, scale: 1, y: 0 }
                                    }}
                                    className="relative group rounded-[20px] overflow-hidden bg-gray-50 shadow-sm hover:shadow-2xl transition-all duration-500 aspect-[3/2]"
                                >
                                    <Link to={`/collections?category=${cat.name}`} className="block w-full h-full relative overflow-hidden">
                                        <img
                                            src={`${cat.image_url || DEFAULT_CAT_IMAGES[cat.name] || FALLBACK_IMG}${ (cat.image_url || DEFAULT_CAT_IMAGES[cat.name] || FALLBACK_IMG).includes('unsplash') ? '&w=800&q=70' : ''}`}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            loading={idx < 3 ? "eager" : "lazy"}
                                            onError={(e) => { 
                                                console.error(`Category image (${cat.name}) failed to load:`, e.target.src);
                                                e.target.src = FALLBACK_IMG; 
                                                e.target.onerror = null; 
                                            }}
                                        />
                                        
                                        {/* Watermark */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                            <span className="text-white/20 font-playfair text-sm md:text-xl tracking-[0.5em] uppercase select-none">Thrisheka</span>
                                        </div>

                                        {/* Premium Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 z-20" />
                                        
                                        <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end z-30">
                                            <motion.div 
                                                className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
                                            >
                                                <h3 className="text-white font-playfair text-xl md:text-4xl mb-1 tracking-wide font-medium">
                                                    {cat.name}
                                                </h3>
                                                <p className="text-white/90 text-[10px] md:text-sm font-light tracking-wider mb-2">
                                                    Elegant jadu kundan
                                                </p>
                                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-2 group-hover:translate-y-0">
                                                    <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]">View Collection</span>
                                                    <div className="w-10 h-[1px] bg-gold" />
                                                </div>
                                            </motion.div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        }) : (
                            <>
                                {[1, 2, 3].map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="relative group rounded-[20px] overflow-hidden bg-gray-100 aspect-[3/2] animate-pulse"
                                    >
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Featured Collections Section */}
            <section className="py-24 bg-[#F9F7F2]">
                <div className="container mx-auto px-4 md:px-12">
                    <div className="text-center mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-playfair text-4xl md:text-5xl text-black mb-4"
                        >
                            Featured Collections
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 max-w-2xl mx-auto"
                        >
                            Discover our handpicked selection of exquisite jewellery
                        </motion.p>
                    </div>

                    <motion.div 
                        initial="hidden"
                        animate={!loading && products.length > 0 ? "show" : "hidden"}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 }
                                }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    <div className="text-center mt-16">
                        <Link to="/collections" className="inline-block border-2 border-gold text-gold hover:bg-gold hover:text-white px-10 py-3 uppercase tracking-widest text-sm font-medium transition-all duration-300">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                
                <div className="container mx-auto px-4 md:px-12">
                    <div className="text-center mb-16">
                        <h2 className="font-playfair text-4xl md:text-5xl text-black mb-4">Voices of Elegance</h2>
                        <div className="w-16 h-1 bg-gold mx-auto mb-6" />
                        <p className="text-gray-500 max-w-xl mx-auto">Hear what our customers have to say about their Alankaar experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((t, idx) => (
                            <motion.div 
                                key={t.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#FDF8EE] p-8 rounded-2xl relative shadow-sm border border-[#F5EDD7]"
                            >
                                <div className="text-[#D4AF37] mb-4 flex gap-1">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <span key={i} className="text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 italic mb-8 leading-relaxed font-light">"{t.review}"</p>
                                <div className="mt-auto">
                                    <h4 className="font-semibold text-black">{t.name}</h4>
                                    <p className="text-[#D4AF37] text-xs uppercase tracking-widest">{t.role}</p>
                                </div>
                                <div className="absolute top-8 right-8 text-gold/10 pointer-events-none">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WhatsApp Community Section */}
            <section className="py-20 bg-[#F7EBE8]">
                <div className="container mx-auto px-4 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-[#25D366]/10 rounded-full mb-6 text-[#25D366]"
                    >
                        <MessageCircle size={32} />
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-playfair text-3xl md:text-4xl text-black mb-4"
                    >
                        Join Our WhatsApp Community
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 max-w-2xl mx-auto mb-10 font-light text-sm md:text-base"
                    >
                        Get exclusive updates on new arrivals, special offers, and personalized recommendations directly on WhatsApp.
                    </motion.p>
                    <motion.button 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onClick={() => window.open('https://wa.me/919876543210?text=Hi! I would like to join the Alankaar community.', '_blank')}
                        className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 mx-auto shadow-md hover:scale-105"
                    >
                        <MessageCircle size={18} />
                        Chat with Us
                    </motion.button>
                </div>
            </section>

        </div>
    );
};

export default Home;
