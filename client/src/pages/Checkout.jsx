import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, fetchSetting, validateCoupon } from '../services/api';
import { User, Phone, Mail, Building2, Hash, Map, MapPin, MessageCircle, ChevronRight, ShoppingBag, Loader2, Tag, Check, X } from 'lucide-react';

const InputField = ({ icon: Icon, placeholder, value, onChange, type = 'text', required, textarea }) => (
    <div className="relative flex items-start gap-3 bg-white border border-[#EDE0D4] rounded-xl px-4 py-3.5 focus-within:border-[#D4AF37] transition-colors">
        <Icon size={18} className="text-[#B59A8A] mt-0.5 shrink-0" />
        {textarea ? (
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                rows={4}
                className="w-full bg-transparent outline-none text-[15px] text-[#3D2B1F] placeholder-[#B59A8A] resize-none"
            />
        ) : (
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full bg-transparent outline-none text-[15px] text-[#3D2B1F] placeholder-[#B59A8A]"
            />
        )}
    </div>
);

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        pincode: '',
        state: '',
        address: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // New Pricing States
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetchSetting('delivery_charge');
                if (res?.value) setDeliveryCharge(Number(res.value));
            } catch (err) {
                console.error("Failed to load delivery charge", err);
            }
        };
        loadSettings();
    }, []);

    const handleApplyCoupon = async () => {
        setCouponError('');
        if (!couponCode.trim()) return;
        setValidatingCoupon(true);
        try {
            const coupon = await validateCoupon(couponCode, getCartTotal());
            setAppliedCoupon(coupon);
            setCouponCode('');
        } catch (err) {
            setCouponError(err.response?.data?.error || "Invalid coupon code");
            setAppliedCoupon(null);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const getDiscountAmount = () => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.discount_type === 'percentage') {
            return (getCartTotal() * Number(appliedCoupon.discount_value)) / 100;
        }
        return Number(appliedCoupon.discount_value);
    };

    const getFinalTotal = () => {
        return getCartTotal() + deliveryCharge - getDiscountAmount();
    };

    const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitting(true);

        try {
            // 1. Save order to our backend database
            const orderData = {
                customerDetails: {
                    name: form.name,
                    phone: form.phone,
                    email: form.email,
                    city: form.city,
                    pincode: form.pincode,
                    state: form.state,
                    address: form.address
                },
                items: cartItems,
                totalAmount: getFinalTotal(),
                couponCode: appliedCoupon?.code || null,
                discountAmount: getDiscountAmount(),
                deliveryCharge: deliveryCharge
            };
            
            await createOrder(orderData);
            
            // 2. Prepare and send WhatsApp Message
            const adminPhone = "916281282284";

            let message = `Hello Alankaar Jewellers! 🛍️\n\nI would like to place an enquiry for the following items:\n\n`;
            cartItems.forEach(item => {
                const price = item.price ? `₹${Number(item.price).toLocaleString('en-IN')}` : 'Price on request';
                message += `▪ ${item.quantity}x ${item.name} (${price})\n`;
            });

            message += `\n*Order Summary:*`;
            message += `\nSubtotal: ₹${getCartTotal().toLocaleString('en-IN')}`;
            if (deliveryCharge > 0) message += `\nDelivery: +₹${deliveryCharge.toLocaleString('en-IN')}`;
            if (appliedCoupon) message += `\nDiscount (${appliedCoupon.code}): -₹${getDiscountAmount().toLocaleString('en-IN')}`;
            message += `\n*Estimated Total: ₹${getFinalTotal().toLocaleString('en-IN')}*`;

            message += `\n\n📦 *Delivery Details:*`;
            message += `\nName: ${form.name}`;
            message += `\nPhone: ${form.phone}`;
            message += `\nEmail: ${form.email}`;
            message += `\nCity: ${form.city}`;
            message += `\nPincode: ${form.pincode}`;
            message += `\nState: ${form.state}`;
            message += `\nAddress: ${form.address}`;

            message += `\n\nPlease confirm availability and share payment details. Thank you!`;

            const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            setSubmitted(true);
        } catch (error) {
            console.error("Failed to place order:", error);
            alert("There was an error saving your order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0 && !submitted) {
        return (
            <div className="pt-40 pb-20 min-h-[70vh] flex flex-col items-center justify-center bg-[#FDF6F0] px-4">
                <ShoppingBag size={48} className="text-[#D4AF37] mb-4" />
                <h2 className="font-playfair text-2xl text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6 text-sm">Add some jewellery to your cart first</p>
                <Link to="/collections" className="bg-[#D4AF37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#c59b27] transition-colors">
                    Explore Collections
                </Link>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="pt-40 pb-20 min-h-[70vh] flex flex-col items-center justify-center bg-[#FDF6F0] px-4">
                <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center border border-[#EDE0D4]">
                    <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-5">
                        <MessageCircle size={32} className="text-[#25D366]" />
                    </div>
                    <h2 className="font-playfair text-2xl font-semibold text-gray-800 mb-2">Enquiry Sent!</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Your cart and delivery details have been sent to Alankaar Jewellers on WhatsApp. We'll get back to you shortly!
                    </p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => { clearCart(); navigate('/collections'); }}
                            className="w-full py-3 bg-[#D4AF37] hover:bg-[#c59b27] text-white rounded-full font-medium transition-colors">
                            Continue Shopping
                        </button>
                        <Link to="/cart" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-36 pb-20 min-h-screen bg-[#FDF6F0] font-poppins">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                    <Link to="/cart" className="hover:text-[#D4AF37] transition-colors">Cart</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-700 font-medium">Checkout</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left: Delivery Form */}
                    <div className="w-full lg:w-3/5">
                        <form onSubmit={handleSubmit}>
                            {/* Delivery Information */}
                            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#EDE0D4] mb-6">
                                <h2 className="font-playfair text-xl font-semibold text-[#3D2B1F] flex items-center gap-2 mb-6">
                                    <MapPin size={20} className="text-[#D4AF37]" />
                                    Delivery Information
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField icon={User} placeholder="Full Name" value={form.name} onChange={handleChange('name')} required />
                                    <InputField icon={Phone} placeholder="Phone Number" value={form.phone} onChange={handleChange('phone')} type="tel" required />
                                    <div className="sm:col-span-2">
                                        <InputField icon={Mail} placeholder="Email Address" value={form.email} onChange={handleChange('email')} type="email" required />
                                    </div>
                                    <InputField icon={Building2} placeholder="City" value={form.city} onChange={handleChange('city')} required />
                                    <InputField icon={Hash} placeholder="Pincode" value={form.pincode} onChange={handleChange('pincode')} type="number" required />
                                    <div className="sm:col-span-2">
                                        <InputField icon={Map} placeholder="State" value={form.state} onChange={handleChange('state')} required />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <InputField icon={MapPin} placeholder="Full Address" value={form.address} onChange={handleChange('address')} textarea required />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white font-medium text-[16px] transition-all transform hover:scale-[1.01] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 size={22} className="animate-spin" /> : <MessageCircle size={22} />}
                                {isSubmitting ? 'Processing...' : 'Send Enquiry via WhatsApp'}
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-3">
                                You'll be redirected to WhatsApp with your cart and delivery details pre-filled.
                            </p>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-2/5 sticky top-24">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#EDE0D4]">
                            <h2 className="font-playfair text-xl font-semibold text-[#3D2B1F] mb-6 border-b border-[#EDE0D4] pb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-lg bg-[#FDF8EE] border border-[#EDE0D4] flex items-center justify-center shrink-0 overflow-hidden">
                                            {item.image_url
                                                ? <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                                                : <ShoppingBag size={20} className="text-gray-300" />
                                            }
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-[14px] font-medium text-[#3D2B1F] line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-[14px] font-semibold text-[#D4AF37] shrink-0">
                                            ₹{((Number(item.price) || 0) * item.quantity).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Promo Code Section */}
                            <div className="py-5 border-t border-[#EDE0D4]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Tag size={16} className="text-[#D4AF37]" />
                                    <span className="text-sm font-semibold text-[#3D2B1F]">Have a Promo Code?</span>
                                </div>
                                
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xl mb-2">
                                        <div className="flex items-center gap-2">
                                            <Check size={16} className="text-green-600" />
                                            <div>
                                                <p className="text-sm font-bold text-green-700 font-mono">{appliedCoupon.code}</p>
                                                <p className="text-xs text-green-600">Successfully applied!</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setAppliedCoupon(null)}
                                            className="text-green-600 hover:text-green-800 p-1 bg-green-100 rounded-lg transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter Code" 
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            className="flex-grow px-4 py-2.5 bg-gray-50 border border-[#EDE0D4] rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-[#D4AF37]"
                                        />
                                        <button 
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={!couponCode || validatingCoupon}
                                            className="px-5 py-2.5 bg-[#3D2B1F] text-white rounded-xl text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center min-w-[90px]"
                                        >
                                            {validatingCoupon ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
                            </div>

                            <div className="border-t border-[#EDE0D4] pt-4 space-y-3 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="text-gray-700 font-medium">₹{getCartTotal().toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Delivery Charge</span>
                                    {deliveryCharge > 0 ? (
                                        <span className="text-gray-700 font-medium">+₹{deliveryCharge.toLocaleString('en-IN')}</span>
                                    ) : (
                                        <span className="text-green-600 font-medium">Free</span>
                                    )}
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span className="font-medium">-₹{getDiscountAmount().toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-3 border-t border-[#EDE0D4]">
                                    <span className="font-semibold text-[#3D2B1F]">Estimated Total</span>
                                    <span className="font-playfair text-2xl font-semibold text-[#D4AF37]">
                                        ₹{getFinalTotal().toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <p className="text-xs text-center text-gray-400 pt-1">No payment required right now</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
