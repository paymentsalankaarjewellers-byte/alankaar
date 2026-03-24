import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const originalPrice = product.price ? Math.floor(Number(product.price) * 1.25) : null;
    const isOutOfStock = (Number(product.stock_quantity) || 0) <= 0;
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col h-full group">
            {/* Image Section */}
            <Link to={`/product/${product.id}`} className="relative block bg-[#FDF8EE] overflow-hidden aspect-square">
                {/* Out of Stock Badge */}
                {isOutOfStock && (
                    <div className="absolute top-0 left-0 bg-[#E53E3E] text-white text-[10px] font-bold px-3 py-1.5 rounded-br-lg z-10 uppercase tracking-wider">
                        Out of Stock
                    </div>
                )}

                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-300 font-playfair italic text-xs">No Image</span>
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="p-3 sm:p-4 flex flex-col flex-grow bg-[#FAFAFA]/50">
                <h3 className="font-playfair font-medium text-[#1A202C] text-[14px] sm:text-[16px] mb-1 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                    <Link to={`/product/${product.id}`}>
                        {product.name}
                    </Link>
                </h3>

                <p className="text-[#718096] text-[10px] sm:text-[12px] leading-snug line-clamp-2 mb-3 min-h-[2.4em]">
                    {product.description || `Handcrafted ${product.category ? product.category.toLowerCase() : 'jewellery'} with artistic precision`}
                </p>

                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        {originalPrice && (
                            <span className="text-[#A0AEC0] text-[10px] sm:text-[12px] line-through mb-0.5">
                                ₹{originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                        {product.price && (
                            <span className="text-[#D4AF37] font-bold text-[14px] sm:text-[16px]">
                                ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isOutOfStock) addToCart(product);
                        }}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm
                            ${isOutOfStock
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-[#1A202C] hover:bg-[#D4AF37] hover:text-white border border-gray-100 hover:border-[#D4AF37]'
                            }`}
                    >
                        <span className="text-xl sm:text-2xl font-light leading-none translate-y-[-1px]">+</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
