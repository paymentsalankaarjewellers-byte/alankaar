import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ChevronRight } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();


    if (cartItems.length === 0) {
        return (
            <div className="pt-40 pb-20 bg-[#F6F5F2] min-h-[70vh] flex flex-col items-center justify-center px-4">
                <div className="bg-white p-10 rounded-2xl shadow-sm max-w-md w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                    </div>
                    <h2 className="font-playfair text-2xl font-medium text-gray-800 mb-3">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">Looks like you haven't added any elegant jewellery pieces to your cart yet.</p>
                    <Link to="/collections" className="inline-block bg-[#2D3748] text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors shadow-md">
                        Explore Collections
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-36 pb-20 bg-[#F6F5F2] min-h-screen font-poppins text-gray-800">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <header className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-[#1A202C] mb-2 tracking-tight">Your Selection</h1>
                        <p className="text-gray-500 text-sm">Review the pieces you've chosen</p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-red-200 hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Clear Cart
                    </button>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="hidden sm:grid grid-cols-12 gap-4 p-5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-3 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Price</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {cartItems.map(item => (
                                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 p-5 sm:p-6 items-center">
                                    {/* Product Info */}
                                    <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FFFBF4] rounded-lg border border-gray-100 flex items-center justify-center p-2 shrink-0">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            ) : (
                                                <span className="text-gray-300 text-xs text-center leading-none">No<br />Image</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-playfair text-[#2D3748] text-[16px] font-medium mb-1 line-clamp-2">
                                                <Link to={`/product/${item.id}`} className="hover:text-[#D4AF37] transition-colors">{item.name}</Link>
                                            </h3>
                                            <p className="text-[#A0AEC0] text-sm hidden sm:block">Category: {item.category}</p>
                                            {/* Mobile Price */}
                                            <div className="sm:hidden mt-2 font-medium text-[#D4AF37]">
                                                ₹{Number(item.price || 0).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity Control */}
                                    <div className="col-span-1 sm:col-span-3 flex justify-start sm:justify-center items-center mt-3 sm:mt-0">
                                        <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center text-sm font-medium text-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal Price */}
                                    <div className="col-span-1 sm:col-span-2 text-right hidden sm:block">
                                        <span className="text-[#2D3748] font-medium text-[16px]">
                                            ₹{((Number(item.price) || 0) * item.quantity).toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    {/* Remove Button */}
                                    <div className="col-span-1 sm:col-span-1 flex justify-end sm:justify-center absolute sm:relative top-5 sm:top-auto right-5 sm:right-auto">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary & WhatsApp Checkout */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="font-playfair text-xl font-medium text-gray-800 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6 text-sm">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium text-gray-800">₹{getCartTotal().toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-gray-400 italic">Determined during Inquiry</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-5 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800">Estimated Total</span>
                                    <span className="font-playfair text-2xl font-semibold text-[#D4AF37]">₹{getCartTotal().toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-2">No payment is required right now</p>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-full bg-[#2D3748] hover:bg-[#1a202c] text-white font-medium text-[15px] transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                            >
                                Proceed to Checkout
                                <ChevronRight size={18} />
                            </Link>

                            <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                                You will fill in your delivery details and send us an enquiry via WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
