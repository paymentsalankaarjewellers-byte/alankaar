import { useState, useEffect } from 'react';
import { fetchCoupons, createCoupon, toggleCouponStatus, deleteCoupon, fetchSetting, uploadSetting } from '../services/api';
import { Tag, Truck, Plus, Trash2, Check, X, Loader2, Save } from 'lucide-react';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [deliveryCharge, setDeliveryCharge] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingDelivery, setSavingDelivery] = useState(false);
    
    // New Coupon Form
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount_type: 'flat',
        discount_value: '',
        min_cart_value: ''
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [couponsRes, deliveryRes] = await Promise.all([
                fetchCoupons(),
                fetchSetting('delivery_charge').catch(() => ({ value: '0' }))
            ]);
            setCoupons(couponsRes);
            setDeliveryCharge(deliveryRes.value || '0');
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDelivery = async () => {
        setSavingDelivery(true);
        try {
            const formData = new FormData();
            formData.append('value', deliveryCharge);
            await uploadSetting('delivery_charge', formData);
            alert("Delivery charge updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update delivery charge");
        } finally {
            setSavingDelivery(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const coupon = await createCoupon(newCoupon);
            setCoupons([coupon, ...coupons]);
            setNewCoupon({ code: '', discount_type: 'flat', discount_value: '', min_cart_value: '' });
        } catch (err) {
            alert(err.response?.data?.error || "Failed to create coupon");
        } finally {
            setCreating(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const updated = await toggleCouponStatus(id, !currentStatus);
            setCoupons(coupons.map(c => c.id === id ? updated : c));
        } catch (err) {
            alert("Failed to toggle status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this coupon permanently?")) return;
        try {
            await deleteCoupon(id);
            setCoupons(coupons.filter(c => c.id !== id));
        } catch (err) {
            alert("Failed to delete coupon");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 animate-fade-in">
            {/* Delivery Charge Block */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                        <Truck size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Standard Delivery Charge</h2>
                        <p className="text-sm text-gray-500">This flat rate will be added to all orders at checkout globally.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cost (₹)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={deliveryCharge}
                            onChange={(e) => setDeliveryCharge(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                            placeholder="e.g. 150"
                        />
                    </div>
                    <button 
                        onClick={handleSaveDelivery}
                        disabled={savingDelivery}
                        className="w-full sm:w-auto px-8 py-3 bg-[#1A202C] hover:bg-black text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {savingDelivery ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Setting
                    </button>
                </div>
            </div>

            {/* Coupons Block */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <Tag size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Discount Coupons</h2>
                        <p className="text-sm text-gray-500">Create promo codes to share with customers.</p>
                    </div>
                </div>

                {/* Create Form */}
                <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Promo Code</label>
                        <input required type="text" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} placeholder="e.g. DIWALI10" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm uppercase" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Type</label>
                        <select value={newCoupon.discount_type} onChange={e => setNewCoupon({...newCoupon, discount_type: e.target.value})} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm">
                            <option value="flat">Flat (₹)</option>
                            <option value="percentage">Percentage (%)</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Discount Value</label>
                        <input required type="number" min="1" value={newCoupon.discount_value} onChange={e => setNewCoupon({...newCoupon, discount_value: e.target.value})} placeholder="e.g. 500" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Min Cart (₹)</label>
                        <input type="number" min="0" value={newCoupon.min_cart_value} onChange={e => setNewCoupon({...newCoupon, min_cart_value: e.target.value})} placeholder="0 for any" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div className="md:col-span-1">
                        <button disabled={creating} type="submit" className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#C5A030] text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                            {creating ? <Loader2 size={16} className="animate-spin"/> : <Plus size={16}/>} Create
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Code</th>
                                <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Discount</th>
                                <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Min. Cart</th>
                                <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(coupon => (
                                <tr key={coupon.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-gray-800 text-xs font-bold font-mono tracking-wider">
                                            {coupon.code}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                        {coupon.discount_type === 'flat' ? `₹${coupon.discount_value}` : `${coupon.discount_value}%`}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500">
                                        {coupon.min_cart_value > 0 ? `₹${coupon.min_cart_value}` : 'None'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <button 
                                            onClick={() => handleToggleStatus(coupon.id, coupon.is_active)}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {coupon.is_active ? <Check size={12}/> : <X size={12}/>}
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button onClick={() => handleDelete(coupon.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400 text-sm">
                                        No discount coupons have been created yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AdminCoupons;
