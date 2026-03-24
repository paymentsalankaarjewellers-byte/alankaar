import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchProductById, updateProduct, fetchCategories, deleteProductImage, fetchSubcategories, fetchFilterOptions } from '../services/api';
import {
    ChevronLeft, Package, Tag, IndianRupee,
    FileText, ImagePlus, Loader2, CheckCircle2, X, Images, Trash2
} from 'lucide-react';

const Plus = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

const FormField = ({ label, required, hint, children }) => (
    <div>
        <label className="block text-[13px] font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            {label} {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
        {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
);

const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[15px] text-gray-800 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 transition-all bg-gray-50 placeholder-gray-400";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const [formData, setFormData] = useState({ 
        name: '', category: '', subcategory: '', price: '', description: '', stock_quantity: 0,
        design: '', jewel_type: '', style: '', occasions: '', color: ''
    });

    // Existing saved images (from DB)
    const [existingImages, setExistingImages] = useState([]); // [{id, image_url}]
    const [primaryUrl, setPrimaryUrl] = useState('');

    // New images to add
    const [newImages, setNewImages] = useState([]); // [{file, preview}]
    const fileInputRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [product, cats, filters] = await Promise.all([
                    fetchProductById(id), 
                    fetchCategories(),
                    fetchFilterOptions()
                ]);
                
                // Group filters
                const grouped = filters.reduce((acc, opt) => {
                    if (!acc[opt.filter_type]) acc[opt.filter_type] = [];
                    acc[opt.filter_type].push(opt);
                    return acc;
                }, {});
                setFilterOptions(grouped);

                setCategories(cats);
                const catName = product.category || (cats[0]?.name || '');
                if (catName) {
                    const subcats = await fetchSubcategories(catName);
                    setSubcategories(subcats);
                }

                setFormData({
                    name: product.name || '',
                    category: catName,
                    subcategory: product.subcategory || '',
                    price: product.price || '',
                    description: product.description || '',
                    stock_quantity: product.stock_quantity || 0,
                    design: product.design || '',
                    jewel_type: product.jewel_type || '',
                    style: product.style || '',
                    occasions: product.occasions || '',
                    color: product.color || ''
                });
                setPrimaryUrl(product.image_url || '');
                setExistingImages(product.images || []);
            } catch (err) {
                console.error(err);
                alert('Failed to load product details');
            } finally {
                setInitialLoading(false);
            }
        };
        load();
    }, [id]);

    useEffect(() => {
        if (!initialLoading && formData.category) {
            fetchSubcategories(formData.category)
                .then(data => {
                    setSubcategories(data);
                    // Reset subcategory if it's not valid for new category
                    setFormData(f => {
                        if (!data.find(s => s.name === f.subcategory)) {
                            return { ...f, subcategory: data.length > 0 ? data[0].name : '' };
                        }
                        return f;
                    });
                })
                .catch(console.error);
        }
    }, [formData.category, initialLoading]);

    const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

    const handleNewImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const total = existingImages.length + newImages.length + 1; // +1 for primary
        const remaining = Math.max(0, 8 - total);
        const toAdd = files.slice(0, remaining).map(f => ({ file: f, preview: URL.createObjectURL(f) }));
        setNewImages(prev => [...prev, ...toAdd]);
        e.target.value = '';
    };

    const removeNewImage = (idx) => setNewImages(prev => prev.filter((_, i) => i !== idx));

    const handleDeleteExisting = async (imgId) => {
        if (!window.confirm('Remove this image?')) return;
        try {
            await deleteProductImage(imgId);
            setExistingImages(prev => prev.filter(img => img.id !== imgId));
        } catch (err) {
            alert('Failed to delete image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            newImages.forEach(img => data.append('images', img.file));
            await updateProduct(id, data);
            setSuccess(true);
            setTimeout(() => navigate('/admin/products'), 1200);
        } catch (err) {
            console.error(err);
            alert('Failed to update product.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return (
        <div className="p-8 text-center text-gray-400 font-poppins min-h-screen flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-widest">Loading details...</p>
        </div>
    );

    const totalImages = 1 + existingImages.length + newImages.length;

    return (
        <div className="p-4 md:p-8 min-h-screen font-poppins">
            <div className="container mx-auto max-w-[1100px]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-playfair text-2xl font-bold text-[#1A202C]">Edit Product</h1>
                        <p className="text-gray-400 text-sm mt-0.5">Modify details for this catalogue item</p>
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm uppercase tracking-widest">
                        ALN-{String(id).padStart(4, '0')}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Left: Form */}
                    <div className="w-full lg:flex-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <Package size={18} className="text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h2 className="font-playfair text-[17px] font-semibold text-[#1A202C]">Edit Product Details</h2>
                                    <p className="text-gray-400 text-xs">Update the product information below</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <FormField label="Product Name" required>
                                    <div className="relative">
                                        <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input required type="text" placeholder="e.g. Temple Lakshmi Necklace"
                                            className={`${inputCls} pl-10`} value={formData.name} onChange={handleChange('name')} />
                                    </div>
                                </FormField>

                                <FormField label="Category" required>
                                    <select className={inputCls} value={formData.category} onChange={handleChange('category')}>
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </FormField>

                                {subcategories.length > 0 && (
                                    <FormField label="Subcategory">
                                        <select className={inputCls} value={formData.subcategory} onChange={handleChange('subcategory')}>
                                            <option value="">Select a subcategory...</option>
                                            {subcategories.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </FormField>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Design">
                                        <select className={inputCls} value={formData.design} onChange={handleChange('design')}>
                                            <option value="">Select Design...</option>
                                            {(filterOptions['design'] || []).map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                                        </select>
                                    </FormField>
                                    <FormField label="Jewel Type">
                                        <select className={inputCls} value={formData.jewel_type} onChange={handleChange('jewel_type')}>
                                            <option value="">Select Jewel Type...</option>
                                            {(filterOptions['jewel_type'] || []).map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                                        </select>
                                    </FormField>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Style">
                                        <select className={inputCls} value={formData.style} onChange={handleChange('style')}>
                                            <option value="">Select Style...</option>
                                            {(filterOptions['style'] || []).map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                                        </select>
                                    </FormField>
                                    <FormField label="Color">
                                        <select className={inputCls} value={formData.color} onChange={handleChange('color')}>
                                            <option value="">Select Color...</option>
                                            {(filterOptions['color'] || []).map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                                        </select>
                                    </FormField>
                                </div>
                                <FormField label="Occasions">
                                    <select className={inputCls} value={formData.occasions} onChange={handleChange('occasions')}>
                                        <option value="">Select Occasion...</option>
                                        {(filterOptions['occasions'] || []).map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                                    </select>
                                </FormField>

                                <FormField label="Price" hint="Leave blank if price is on request">
                                    <div className="relative">
                                        <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="number" placeholder="9900"
                                            className={`${inputCls} pl-10`} value={formData.price} onChange={handleChange('price')} />
                                    </div>
                                </FormField>

                                <FormField label="Stock Quantity" required>
                                    <div className="relative">
                                        <Package size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input required type="number" placeholder="10"
                                            className={`${inputCls} pl-10`} value={formData.stock_quantity} onChange={handleChange('stock_quantity')} />
                                    </div>
                                </FormField>

                                <FormField label="Description">
                                    <div className="relative">
                                        <FileText size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                                        <textarea rows={4} placeholder="Describe the product..."
                                            className={`${inputCls} pl-10 resize-none`}
                                            value={formData.description} onChange={handleChange('description')} />
                                    </div>
                                </FormField>

                                <button type="submit" disabled={loading || success}
                                    className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-[15px] transition-all shadow-sm ${success ? 'bg-green-500 text-white' : 'bg-[#D4AF37] hover:bg-[#c59b27] text-white hover:shadow-md'
                                        } disabled:opacity-70`}>
                                    {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                        : success ? <><CheckCircle2 size={18} /> Saved!</>
                                            : <><Package size={18} /> Save Changes</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Image Manager */}
                    <div className="w-full lg:w-[340px] shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-1.5">
                                <h3 className="font-playfair text-[15px] font-semibold text-[#1A202C] flex items-center gap-2">
                                    <Images size={16} className="text-[#D4AF37]" />
                                    Product Images
                                </h3>
                                <span className="text-xs text-gray-400">{totalImages}/8</span>
                            </div>
                            <p className="text-gray-400 text-xs mb-4">Manage existing images or upload new ones</p>

                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {/* Primary image */}
                                {primaryUrl && (
                                    <div className="relative rounded-xl overflow-hidden aspect-square border-2 border-[#D4AF37]">
                                        <img src={primaryUrl} alt="Primary" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-[#D4AF37] text-white text-[9px] text-center py-0.5 font-semibold">PRIMARY</div>
                                    </div>
                                )}

                                {/* Existing gallery images */}
                                {existingImages.map(img => (
                                    <div key={img.id} className="relative rounded-xl overflow-hidden aspect-square border-2 border-gray-100 group">
                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteExisting(img.id)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}

                                {/* New images pending upload */}
                                {newImages.map((img, idx) => (
                                    <div key={`new-${idx}`} className="relative rounded-xl overflow-hidden aspect-square border-2 border-blue-200 group">
                                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[9px] text-center py-0.5 font-semibold">NEW</div>
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(idx)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}

                                {/* Add slot */}
                                {totalImages < 8 && (
                                    <button type="button" onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#D4AF37] flex items-center justify-center text-gray-300 hover:text-[#D4AF37] transition-colors">
                                        <Plus size={22} />
                                    </button>
                                )}
                            </div>

                            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleNewImageSelect} />

                            {totalImages < 8 && (
                                <button type="button" onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-2 text-sm text-[#D4AF37] hover:text-[#c59b27] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl transition-colors font-medium">
                                    + Add More Images
                                </button>
                            )}

                            <p className="text-[11px] text-gray-400 mt-3 text-center">
                                🔵 NEW = pending upload on save &nbsp;|&nbsp; hover images to remove
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
