import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp = () => {
    const handleWhatsAppClick = () => {
        const whatsappNumber = "916281282284";
        const message = encodeURIComponent("Hello Alankaar Jewellers, I have an enquiry.");
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    return (
        <button
            onClick={handleWhatsAppClick}
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
            aria-label="Contact on WhatsApp"
        >
            <MessageCircle size={28} />
            {/* Tooltip */}
            <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-black text-white text-xs px-3 py-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with us
            </span>
        </button>
    );
};

export default FloatingWhatsApp;
