import { motion } from 'framer-motion';
import { Award, Heart, Shield, Sparkles, Instagram, Facebook, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

// New assets
import aboutHero from '../assets/about/hero.png';
import aboutLegacy from '../assets/about/legacy.png';
import process1 from '../assets/about/process_1.png';
import process2 from '../assets/about/process_2.png';
import process3 from '../assets/about/process_3.png';

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const stats = [
        { label: 'Years of Legacy', value: '25+' },
        { label: 'Happy Customers', value: '10k+' },
        { label: 'Master Artisans', value: '50+' },
        { label: 'Unique Designs', value: '5k+' }
    ];

    const values = [
        {
            icon: <Award className="w-7 h-7 text-[#D4AF37]" />,
            title: 'Exquisite Craftsmanship',
            description: 'Every piece is a masterpiece, handcrafted by our master artisans with unparalleled attention to detail and patience.'
        },
        {
            icon: <Shield className="w-7 h-7 text-[#D4AF37]" />,
            title: 'Purity Guaranteed',
            description: 'We adhere to the highest standards of purity. Every diamond and gold piece is strictly certified and ethically sourced.'
        },
        {
            icon: <Heart className="w-7 h-7 text-[#D4AF37]" />,
            title: 'Generational Trust',
            description: 'Our relationship with jewelry is deeply personal. We believe in building trust that lasts for generations to come.'
        },
        {
            icon: <Sparkles className="w-7 h-7 text-[#D4AF37]" />,
            title: 'Timeless Design',
            description: 'Blending traditional South Indian techniques with modern aesthetics to create treasures for the contemporary soul.'
        }
    ];

    const processes = [
        {
            title: "The Artistic Sketch",
            desc: "Every creation begins with a hand-drawn vision, capturing the soul of heritage.",
            img: process1
        },
        {
            title: "Traditional Casting",
            desc: "Using age-old methods to breathe life into raw gold and precious metals.",
            img: process2
        },
        {
            title: "Masterful Setting",
            desc: "The final touch where every gem finds its perfect place under expert precision.",
            img: process3
        }
    ];

    return (
        <div className="bg-[#FAF9F6] pt-[110px]">
            {/* Hero Section */}
            <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img 
                        src={aboutHero} 
                        alt="Fine Jewelry Background" 
                        className="w-full h-full object-cover brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FAF9F6]" />
                </motion.div>
                
                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <span className="text-gold font-bold text-xs md:text-sm uppercase tracking-[0.4em] mb-4 block">
                            Est. 1998
                        </span>
                        <h1 className="text-4xl md:text-7xl font-playfair text-white mb-6 leading-tight font-bold">
                            Crafting Legacies <br className="hidden md:block"/> for Generations
                        </h1>
                        <p className="text-white/90 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto italic">
                            "Where every ornament tells a story of tradition, elegance, and absolute purity."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story section with airy layout */}
            <section className="py-24 md:py-32 px-6">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div {...fadeIn} className="relative group">
                        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                            <img 
                                src={aboutLegacy} 
                                alt="Master Artisan at Work" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-10 -right-6 bg-black text-white p-10 rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-2xl border-4 border-gold z-20 hidden md:flex">
                            <span className="text-3xl font-playfair font-bold text-gold">25+</span>
                            <span className="text-[10px] uppercase tracking-widest text-center mt-1">Years of <br/> Trust</span>
                        </div>
                    </motion.div>

                    <motion.div {...fadeIn} className="space-y-8">
                        <div>
                            <span className="text-gold font-bold text-[10px] uppercase tracking-[0.3em] mb-3 block">Our Heritage</span>
                            <h2 className="text-4xl md:text-6xl font-playfair text-[#1A202C] leading-tight font-bold">The Soul of Alankaar</h2>
                        </div>
                        <div className="w-24 h-1 bg-gold"></div>
                        <p className="text-gray-600 text-lg leading-relaxed font-light first-letter:text-5xl first-letter:font-playfair first-letter:mr-3 first-letter:float-left first-letter:text-gold">
                            Founded over a quarter-century ago in the heart of traditional South India, Alankaar Jewellers began with a singular devotion: to preserve the dying art of ancient temple jewelry while embracing the evolving tastes of the modern woman.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed font-light">
                            Each golden thread woven into our designs represents a commitment to honesty—a principle that has made us a household name for families across generations. We don't just sell jewelry; we celebrate the milestones of your life with the brilliance you deserve.
                        </p>
                        <div className="flex gap-6 pt-4">
                            <div className="flex-1 border-l-2 border-gold/30 pl-6">
                                <h4 className="font-playfair text-2xl text-[#1A202C] mb-1">Authentic</h4>
                                <p className="text-sm text-gray-500 font-light">100% BIS Hallmarked pieces that guarantee purity.</p>
                            </div>
                            <div className="flex-1 border-l-2 border-gold/30 pl-6">
                                <h4 className="font-playfair text-2xl text-[#1A202C] mb-1">Bespoke</h4>
                                <p className="text-sm text-gray-500 font-light">Tailored designs that reflect your unique personality.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats - Refined minimal look */}
            <section className="bg-white py-20 border-y border-gray-100">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                        {stats.map((stat, index) => (
                            <motion.div 
                                key={index}
                                {...fadeIn}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-5xl md:text-7xl font-playfair text-[#D4AF37] mb-2 font-bold">{stat.value}</p>
                                <p className="text-[#1A202C] text-xs uppercase tracking-[0.3em] font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Craft - Grid of process */}
            <section className="py-24 md:py-32 bg-[#FAF9F6]">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-gold font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">Our Process</span>
                        <h2 className="text-4xl md:text-6xl font-playfair text-[#1A202C] mb-6 font-bold">The Journey of a Masterpiece</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto font-light text-lg">
                            Witness the meticulous steps taken by our artisans to transform raw materials into eternal symbols of beauty.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {processes.map((step, idx) => (
                            <motion.div 
                                key={idx}
                                {...fadeIn}
                                transition={{ delay: idx * 0.2 }}
                                className="group"
                            >
                                <div className="relative aspect-square rounded-[30px] overflow-hidden mb-8 shadow-xl border-4 border-white transition-all duration-500 group-hover:shadow-gold/10 group-hover:-translate-y-2">
                                    <img 
                                        src={step.img} 
                                        alt={step.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center font-playfair text-xl border border-gold/30">
                                        0{idx + 1}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-playfair text-[#1A202C] mb-3 font-bold">{step.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values - Premium Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div 
                                key={index}
                                {...fadeIn}
                                transition={{ delay: index * 0.1 }}
                                className="p-10 rounded-[35px] bg-[#FAF9F6] border border-gray-100 hover:border-gold/30 hover:bg-white transition-all duration-500 group"
                            >
                                <div className="mb-8 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-gold group-hover:text-white transition-all duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-playfair text-[#1A202C] mb-4 font-bold">{value.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-light text-sm">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA / Engagement */}
            <section className="py-32 bg-[#1A202C] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                
                <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
                    <motion.div {...fadeIn}>
                        <h2 className="text-4xl md:text-6xl font-playfair text-white mb-8 font-bold">Experience the Brilliance</h2>
                        <p className="text-white/70 max-w-2xl mx-auto mb-12 text-lg font-light leading-loose uppercase tracking-[0.2em] text-[10px] md:text-sm">
                            Connect with us to design your heirloom masterpiece or visit our flagship boutique to explore our signature collections.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a href="/contact" className="bg-gold hover:bg-white text-white hover:text-gold px-12 py-5 uppercase tracking-widest text-xs font-bold transition-all duration-500 shadow-2xl">
                                Visit Our Store
                            </a>
                            <div className="flex items-center gap-6 px-4">
                                <a href="https://www.instagram.com/alankaar_jewellers1?igsh=MTlmdmh1dHQyZXM5dQ==" target="_blank" rel="noopener noreferrer">
                                    <Instagram className="w-6 h-6 text-white/50 hover:text-gold cursor-pointer transition-colors" />
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <Facebook className="w-6 h-6 text-white/50 hover:text-gold cursor-pointer transition-colors" />
                                </a>
                                <a href="https://youtube.com/@alankaarjewellers?si=dl580OlMaSbkJ2eY" target="_blank" rel="noopener noreferrer">
                                    <svg className="w-6 h-6 text-white/50 hover:text-gold cursor-pointer transition-colors fill-current" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                    </svg>
                                </a>
                                <a href="mailto:sales.alankaarjewellers@gmail.com">
                                    <Mail className="w-6 h-6 text-white/50 hover:text-gold cursor-pointer transition-colors" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
