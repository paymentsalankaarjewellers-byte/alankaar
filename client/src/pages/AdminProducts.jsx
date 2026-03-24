import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../services/api';
import {
    Edit, Trash2, Plus, Package, IndianRupee, Tag, Search,
    Eye, AlertCircle, CheckCircle2, ChevronDown
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
            <Icon size={22} className={color} />
        </div>
        <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</p>
            <p className="text-[#1A202C] font-bold text-xl mt-0.5">{value}</p>
        </div>
    </div>
);

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            await deleteProduct(id);
            setDeleteConfirmId(null);
            loadProducts();
        } catch (err) {
            console.error("Failed to delete product", err);
        } finally {
            setDeleting(false);
        }
    };

    const filtered = products.filter(p => {
        const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
        return matchSearch && matchCat;
    });

    const totalRevenue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const inStock = products.filter(p => (Number(p.stock_quantity) || 0) > 0).length;
    const outOfStock = products.filter(p => (Number(p.stock_quantity) || 0) <= 0).length;
    
    // Extract unique categories from products
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <div className="p-4 md:p-8">
            
            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={28} className="text-red-500" />
                        </div>
                        <h3 className="font-playfair text-xl font-semibold text-gray-800 mb-2">Delete Product?</h3>
                        <p className="text-gray-500 text-sm mb-6">This action is permanent and cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirmId)} disabled={deleting}
                                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-60">
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-playfair text-2xl font-bold text-[#1A202C]">Inventory Management</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Track and manage your jewellery collection</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Package} label="Total Products" value={products.length} color="text-[#D4AF37]" bg="bg-[#D4AF37]/10" />
                <StatCard icon={IndianRupee} label="Catalogue Value" value={`₹${totalRevenue.toLocaleString('en-IN')}`} color="text-blue-500" bg="bg-blue-50" />
                <StatCard icon={CheckCircle2} label="In Stock" value={inStock} color="text-green-500" bg="bg-green-50" />
                <StatCard icon={AlertCircle} label="Out of Stock" value={outOfStock} color="text-red-400" bg="bg-red-50" />
            </div>

            {/* Products Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 border-b border-gray-100">
                    <div className="relative w-full sm:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search products..." value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#D4AF37] bg-gray-50 transition-all" />
                    </div>
                    <div className="relative">
                        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#D4AF37] bg-gray-50 cursor-pointer transition-all min-w-[140px]">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-gray-400 text-sm sm:ml-auto font-medium">
                        Showing <span className="text-[#1A202C]">{filtered.length}</span> of <span className="text-[#1A202C]">{products.length}</span> items
                    </p>
                </div>

                {loading ? (
                    <div className="py-24 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 text-sm font-medium">Loading products...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4 hidden sm:table-cell">Category</th>
                                    <th className="px-6 py-4 hidden md:table-cell">Price</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">Stock</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((product) => {
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-[#FEF9EE] border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-200">
                                                        {product.image_url
                                                            ? <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                                                            : <Tag size={18} className="text-gray-300" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-[#1A202C] text-[14px] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{product.name}</p>
                                                        <p className="text-gray-400 text-[11px] font-bold mt-0.5 tracking-wider uppercase">ALN-{String(product.id).padStart(4, '0')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight">
                                                    {product.category || '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="font-bold text-[#1A202C] text-[14px]">
                                                    {product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className={`font-medium text-[14px] ${Number(product.stock_quantity) <= 0 ? 'text-red-500' : 'text-gray-600'}`}>
                                                    {product.stock_quantity || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                {(Number(product.stock_quantity) || 0) <= 0 ? (
                                                    <span className="flex items-center gap-1.5 text-red-500 text-[11px] font-bold uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Out of Stock
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-green-600 text-[11px] font-bold uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> In Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link to={`/product/${product.id}`}
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all" title="View">
                                                        <Eye size={17} />
                                                    </Link>
                                                    <Link to={`/admin/edit/${product.id}`}
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-[#D4AF37] transition-all" title="Edit">
                                                        <Edit size={17} />
                                                    </Link>
                                                    <button onClick={() => setDeleteConfirmId(product.id)}
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all" title="Delete">
                                                        <Trash2 size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && !loading && (
                                    <tr><td colSpan="5" className="py-20 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package size={32} className="text-gray-200" />
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium">
                                            {search || categoryFilter !== 'All' ? 'No products match your filters.' : 'Your inventory is empty.'}
                                        </p>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
