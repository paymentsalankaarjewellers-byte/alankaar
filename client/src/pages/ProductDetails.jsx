import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { MessageCircle, ChevronLeft, ShoppingCart, Minus, Plus, ZoomIn, ZoomOut, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                setProduct(data);
                setSelectedImage(data.image_url);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load product", err);
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const handleWhatsAppEnquiry = () => {
        if (!product) return;
        const message = `Hello Alankaar Jewellers,\nI am interested in this product.\n\nProduct Name: ${product.name}\nProduct ID: ${product.id}\nWeight: ${product.weight || 'N/A'}\nQuantity: ${quantity}\n\nPlease share more details.`;
        const whatsappUrl = `https://wa.me/916281282284?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    const isOutOfStock = product ? (Number(product.stock_quantity) || 0) <= 0 : false;
    const originalPrice = product?.price ? Math.floor(Number(product.price) * 1.25) : null;
    const discountPercent = product?.price && originalPrice
        ? Math.round(((originalPrice - Number(product.price)) / originalPrice) * 100)
        : null;

    if (loading) return (
        <div className="pt-32 pb-20 text-center min-h-screen bg-[#F6F5F2] font-poppins">
            <div className="animate-pulse text-gray-400">Loading product details...</div>
        </div>
    );

    if (!product) return (
        <div className="pt-32 pb-20 text-center min-h-screen bg-[#F6F5F2]">
            <h2 className="text-2xl font-playfair mb-4 text-gray-800">Product Not Found</h2>
            <Link to="/collections" className="text-[#D4AF37] underline">Return to Collections</Link>
        </div>
    );

    return (
        <div className="pt-24 pb-20 bg-[#F6F5F2] min-h-screen font-poppins">
            <div className="container mx-auto px-4 md:px-12 max-w-[1400px]">

                {/* Back link */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#D4AF37] transition-colors mb-6 group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Collections
                </button>

                <div className="flex flex-col md:flex-row gap-10 lg:gap-16">

                    {/* Left: Image Gallery */}
                    <div className="w-full md:w-[48%] space-y-6">
                        {/* Main Image Viewport */}
                        <div
                            className={`relative bg-white rounded-3xl overflow-hidden border border-gray-100 aspect-square flex items-center justify-center cursor-zoom-in group shadow-sm ${isZoomed ? 'cursor-zoom-out' : ''}`}
                            onClick={() => setIsZoomed(!isZoomed)}
                        >
                            <motion.div 
                                key={selectedImage}
                                initial={{ opacity: 0.8, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full flex items-center justify-center"
                            >
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className={`w-full h-full object-contain p-4 transition-transform duration-700 ease-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-gray-300">
                                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                                            <ZoomIn size={24} />
                                        </div>
                                        <span className="font-playfair italic text-sm">No Image Available</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Controls Overlay */}
                            <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={e => e.stopPropagation()}>
                                <button onClick={() => setIsZoomed(true)}
                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center text-gray-600 hover:text-[#D4AF37] transition-all hover:scale-110">
                                    <ZoomIn size={18} />
                                </button>
                                <button onClick={() => setIsZoomed(false)}
                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center text-gray-600 hover:text-[#D4AF37] transition-all hover:scale-110">
                                    <ZoomOut size={18} />
                                </button>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-gray-100 shadow-sm">
                                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">{product.category}</span>
                            </div>
                        </div>

                        {/* Premium Thumbnail Selection Row (Matches User Screenshot) */}
                        {(() => {
                            const allImages = [
                                ...(product.image_url ? [{ id: 'primary', image_url: product.image_url }] : []),
                                ...(product.images || [])
                            ];
                            if (allImages.length <= 1) return null;
                            return (
                                <div className="flex flex-wrap gap-4 px-1">
                                    {allImages.map((img) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setSelectedImage(img.image_url)}
                                            className={`relative w-20 md:w-24 aspect-square rounded-[18px] overflow-hidden border-2 transition-all duration-300 ${
                                                selectedImage === img.image_url 
                                                ? 'border-[#D4AF37] scale-105 shadow-md' 
                                                : 'border-transparent bg-white hover:border-gray-200'
                                            }`}
                                        >
                                            <img 
                                                src={img.image_url} 
                                                alt="" 
                                                className={`w-full h-full object-cover p-1 transition-transform duration-500 ${selectedImage === img.image_url ? 'scale-110' : 'group-hover:scale-110'}`} 
                                            />
                                            {selectedImage === img.image_url && (
                                                <motion.div 
                                                    layoutId="outline"
                                                    className="absolute inset-0 border-2 border-[#D4AF37] rounded-[16px] pointer-events-none"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Right: Info */}
                    <div className="w-full md:w-[52%] flex flex-col">

                            {/* Category */}
                            <span className="text-[#D4AF37] uppercase tracking-widest text-xs font-semibold mb-2">{product.category}</span>

                            {/* Name */}
                            <h1 className="font-playfair text-[28px] md:text-[36px] font-medium text-[#1A202C] mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Price row */}
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                {product.price && (
                                    <span className="text-[#D4AF37] font-semibold text-[28px] font-playfair">
                                        ₹{Number(product.price).toLocaleString('en-IN')}
                                    </span>
                                )}
                                {originalPrice && (
                                    <span className="text-gray-400 text-lg line-through">
                                        ₹{originalPrice.toLocaleString('en-IN')}
                                    </span>
                                )}
                                {discountPercent && (
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Stock Badge */}
                            <div className="mb-5">
                                {isOutOfStock ? (
                                    <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                                        Out of Stock
                                    </span>
                                ) : (
                                    <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                                        In Stock
                                    </span>
                                )}
                            </div>

                            <div className="w-full h-px bg-gray-200 mb-5" />

                            {/* Description */}
                            <div className="mb-5">
                                <h3 className="font-semibold text-[#1A202C] text-[15px] mb-1.5">Description</h3>
                                <p className="text-gray-500 leading-relaxed text-[14px]">
                                    {product.description || "An elegant piece designed to perfection. Experience the luxury of fine craftsmanship with this exquisite addition to our collection."}
                                </p>
                            </div>

                            {/* Product Specs */}
                            <div className="mb-6 space-y-2 text-sm">
                                {product.weight && (
                                    <div className="flex gap-4">
                                        <span className="text-gray-400 w-24">Weight</span>
                                        <span className="font-medium text-gray-700">{product.weight}</span>
                                    </div>
                                )}
                                {product.design && (
                                    <div className="flex gap-4">
                                        <span className="text-gray-400 w-24">Design</span>
                                        <span className="font-medium text-gray-700">{product.design}</span>
                                    </div>
                                )}
                                {product.jewel_type && (
                                    <div className="flex gap-4">
                                        <span className="text-gray-400 w-24">Jewel Type</span>
                                        <span className="font-medium text-gray-700">{product.jewel_type}</span>
                                    </div>
                                )}
                                {product.style && (
                                    <div className="flex gap-4">
                                        <span className="text-gray-400 w-24">Style</span>
                                        <span className="font-medium text-gray-700">{product.style}</span>
                                    </div>
                                )}
                                {product.occasions && (
                                    <div className="flex gap-4">
                                        <span className="text-gray-400 w-24">Occasion</span>
                                        <span className="font-medium text-gray-700">{product.occasions}</span>
                                    </div>
                                )}
                                {product.color && (
                                    <div className="flex gap-4">
                                        <span className="text-gray-400 w-24">Color</span>
                                        <span className="font-medium text-gray-700">{product.color}</span>
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    <span className="text-gray-400 w-24">Item Code</span>
                                    <span className="font-medium text-gray-700 tracking-wider">ALN-{String(product.id).padStart(4, '0')}</span>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            {!isOutOfStock && (
                                <div className="mb-5">
                                    <h3 className="font-semibold text-[#1A202C] text-[15px] mb-2.5">Quantity</h3>
                                    <div className="flex items-center gap-0 border border-gray-200 rounded-lg w-fit overflow-hidden bg-white">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-semibold text-[16px] text-gray-800">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-lg font-semibold text-[15px] transition-all ${isOutOfStock
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#D4AF37] hover:bg-[#c59b27] text-white shadow-md hover:shadow-lg hover:scale-[1.01]'
                                        }`}
                                >
                                    <ShoppingCart size={19} />
                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </button>

                                <button
                                    onClick={handleWhatsAppEnquiry}
                                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-lg border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold text-[15px] transition-all"
                                >
                                    <MessageCircle size={19} />
                                    Enquire on WhatsApp
                                </button>
                            </div>

                            <div className="w-full h-px bg-gray-200 mb-5" />

                            {/* Trust Badges */}
                            <div className="space-y-2.5">
                                {[
                                    'Handcrafted with premium materials',
                                    'Free shipping on orders above ₹2,000',
                                    'Authentic South Indian craftsmanship',
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[13px] text-gray-500">
                                        <Check size={14} className="text-green-500 shrink-0" />
                                        {text}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

            export default ProductDetails;
