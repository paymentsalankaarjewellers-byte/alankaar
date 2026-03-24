import { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '../services/api';
import { 
    ShoppingBag, MessageCircle, MapPin, Search, Phone,
    ChevronDown, ChevronUp, Loader2, Calendar, User, CheckCircle2, AlertCircle, Package
} from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            // Quick local update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Failed to change status:", error);
            alert("Could not update order status.");
        }
    };

    const toggleExpand = (id) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    const filteredOrders = orders.filter(order => 
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone.includes(searchTerm) ||
        order.id.toString().includes(searchTerm)
    );

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#D4AF37]" />
                <p>Loading CRM Orders...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <ShoppingBag className="text-[#D4AF37]" />
                        Order Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View and manage WhatsApp enquiries and customer orders
                    </p>
                </div>
                
                <div className="relative w-full sm:w-72">
                    <input 
                        type="text" 
                        placeholder="Search by name, phone or ID..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="text-gray-500 mt-2">Any placed orders will appear right here.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                            
                            {/* Order Header / Summary Row */}
                            <div 
                                className="p-5 sm:p-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleExpand(order.id)}
                            >
                                <div className="flex items-center gap-4 w-full lg:w-auto min-w-[200px]">
                                    <div className="bg-[#FDF8EE] text-[#D4AF37] w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold border border-[#EDE0D4]">
                                        #{order.id}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            {order.customer_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                            <Calendar size={13} />
                                            {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 w-full lg:w-auto lg:ml-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</span>
                                        <span className="font-semibold text-gray-900">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</span>
                                        <span onClick={(e) => e.stopPropagation()}>
                                            <select 
                                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer outline-none ring-1 ring-inset ring-gray-200 ${getStatusColor(order.status)}`}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </span>
                                    </div>

                                    <div className="shrink-0 text-gray-400">
                                        {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-gray-100 bg-gray-50/50 p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                                    
                                    {/* Customer Detail Card */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                            <User size={16} /> Customer Details
                                        </h4>
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone size={15} className="text-gray-400 shrink-0" />
                                                <span className="text-gray-900">{order.customer_phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <MessageCircle size={15} className="text-gray-400 shrink-0" />
                                                <span className="text-gray-600 truncate">{order.customer_email || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start gap-3 text-sm">
                                                <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                                                <span className="text-gray-600 leading-relaxed">
                                                    {order.customer_address}<br/>
                                                    {order.customer_city}, {order.customer_state} - {order.customer_pincode}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items & Billing Card */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                            <Package size={16} /> Items & Billing Breakdown
                                        </h4>
                                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                            <div className="divide-y divide-gray-50 max-h-[250px] overflow-y-auto">
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map(item => (
                                                        <div key={item.id} className="p-3 flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                                                {item.product_image_url ? 
                                                                    <img src={item.product_image_url} alt="" className="w-10 h-10 object-contain mix-blend-multiply" /> :
                                                                    <ShoppingBag size={16} className="text-gray-300" />
                                                                }
                                                            </div>
                                                            <div className="flex-grow min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product_name}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{Number(item.price || 0).toLocaleString('en-IN')}</p>
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-900 shrink-0">
                                                                ₹{(Number(item.price || 0) * item.quantity).toLocaleString('en-IN')}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-sm text-gray-400 text-center">No items recorded</div>
                                                )}
                                            </div>

                                            {/* Billing Details Footer */}
                                            <div className="bg-gray-50/80 p-4 border-t border-gray-100 space-y-2">
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Subtotal:</span>
                                                    <span>₹{(Number(order.total_amount) - Number(order.delivery_charge || 0) + Number(order.discount_amount || 0)).toLocaleString('en-IN')}</span>
                                                </div>
                                                {Number(order.delivery_charge) > 0 && (
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>Delivery:</span>
                                                        <span className="text-gray-700">+₹{Number(order.delivery_charge).toLocaleString('en-IN')}</span>
                                                    </div>
                                                )}
                                                {order.coupon_code && (
                                                    <div className="flex justify-between text-xs text-green-600">
                                                        <span>Discount ({order.coupon_code}):</span>
                                                        <span>-₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200/60">
                                                    <span>Final Total:</span>
                                                    <span className="text-[#D4AF37]">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
