import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="pt-32 pb-24 bg-[#FDFCFB] min-h-screen">
            <div className="container mx-auto px-4 md:px-12 max-w-[1200px]">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#D4AF37] font-bold text-[11px] uppercase tracking-[0.3em] mb-3 block"
                    >
                        Get In Touch
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-playfair text-4xl md:text-6xl text-black mb-6"
                    >
                        Contact Us
                    </motion.h1>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="h-1 bg-[#D4AF37] mx-auto rounded-full" 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-playfair text-3xl mb-8 text-black">Let's start a conversation</h2>
                        <p className="text-gray-600 mb-12 font-light leading-relaxed max-w-md">
                            Whether you have a question about our collections, need styling advice, or want to discuss a custom piece, our team is here to help.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-[#F9F4E8] rounded-2xl flex items-center justify-center text-[#D4AF37] shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-black mb-1 text-lg">Our Boutique</h4>
                                    <p className="text-gray-500 font-light leading-relaxed">
                                       Flat no. 127, Mahesh nagar, Kapra, ECIL post, Hyderabad 500062

                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-[#F9F4E8] rounded-2xl flex items-center justify-center text-[#D4AF37] shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-black mb-1 text-lg">Phone & WhatsApp</h4>
                                    <p className="text-gray-500 font-light">+91 6281282284</p>
                                    <button 
                                        onClick={() => window.open('https://wa.me/916281282284', '_blank')}
                                        className="text-[#D4AF37] text-sm font-medium mt-1 hover:underline flex items-center gap-1"
                                    >
                                        Chat with us on WhatsApp
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-[#F9F4E8] rounded-2xl flex items-center justify-center text-[#D4AF37] shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-black mb-1 text-lg">Email Us</h4>
                                    <p className="text-gray-500 font-light text-sm">sales.alankaarjewellers@gmail.com</p>
                                    <p className="text-gray-500 font-light text-sm">payments.alankaarjewellers@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links placeholder */}
                        <div className="mt-16 pt-8 border-t border-gray-100">
                            <h4 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 font-bold">Follow Our Journey</h4>
                            <div className="flex gap-4">
                                <a href="https://www.instagram.com/alankaar_jewellers1?igsh=MTlmdmh1dHQyZXM5dQ==" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-[#D4AF37] transition-colors font-medium">
                                    Instagram
                                </a>
                                <a href="#" className="text-sm text-gray-700 hover:text-[#D4AF37] transition-colors font-medium">
                                    Facebook
                                </a>
                                <a href="https://youtube.com/@alankaarjewellers?si=dl580OlMaSbkJ2eY" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-[#D4AF37] transition-colors font-medium">
                                    Youtube
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-8 md:p-12 rounded-[32px] shadow-xl shadow-black/5 border border-gray-100"
                    >
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send size={32} />
                                </div>
                                <h3 className="font-playfair text-3xl mb-4 text-black">Message Sent!</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    Thank you for reaching out. We will get back to you within 24 hours.
                                </p>
                                <button 
                                    onClick={() => setSubmitted(false)}
                                    className="bg-gold text-white px-8 py-3 rounded-full hover:bg-black transition-all"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-medium text-gray-700 ml-1">Your Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-gold transition-colors text-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-medium text-gray-700 ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-gold transition-colors text-sm"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-gray-700 ml-1">Subject</label>
                                    <input 
                                        type="text" 
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-gold transition-colors text-sm"
                                        placeholder="Inquiry about collections"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-gray-700 ml-1">Message</label>
                                    <textarea 
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-gold transition-colors text-sm resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full bg-gold text-white py-4 rounded-2xl font-semibold tracking-wide hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg shadow-gold/20 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Send Message
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
