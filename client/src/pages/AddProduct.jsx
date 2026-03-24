import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct, fetchCategories, fetchSubcategories, fetchFilterOptions } from '../services/api';
import {
    ChevronLeft, Package, Tag, IndianRupee,
    FileText, ImagePlus, Loader2, CheckCircle2, X, Images
} from 'lucide-react';

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

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const [formData, setFormData] = useState({ 
        name: '', category: '', subcategory: '', price: '', description: '', stock_quantity: 0,
        design: '', jewel_type: '', style: '', occasions: '', color: '' 
    });
    const [images, setImages] = useState([]); // [{file, preview}]
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [cats, filters] = await Promise.all([
                    fetchCategories(),
                    fetchFilterOptions()
                ]);
                setCategories(cats);
                if (cats.length > 0) setFormData(f => ({ ...f, category: cats[0].name }));
                
                // Group filters
                const grouped = filters.reduce((acc, opt) => {
                    if (!acc[opt.filter_type]) acc[opt.filter_type] = [];
                    acc[opt.filter_type].push(opt);
                    return acc;
                }, {});
                setFilterOptions(grouped);
            } catch (err) {
                console.error(err);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (formData.category) {
            fetchSubcategories(formData.category)
                .then(data => {
                    setSubcategories(data);
                    setFormData(f => ({ ...f, subcategory: data.length > 0 ? data[0].name : '' }));
                })
                .catch(console.error);
        } else {
            setSubcategories([]);
            setFormData(f => ({ ...f, subcategory: '' }));
        }
    }, [formData.category]);

    const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages].slice(0, 8)); // cap at 8
        e.target.value = ''; // reset so same file can be re-selected
    };

    const removeImage = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const moveToFirst = (idx) => {
        setImages(prev => {
            const newArr = [...prev];
            const [item] = newArr.splice(idx, 1);
            newArr.unshift(item);
            return newArr;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) { alert('Please upload at least one product image.'); return; }
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            images.forEach(img => data.append('images', img.file));
            await createProduct(data);
            setSuccess(true);
            setTimeout(() => navigate('/admin/products'), 1200);
        } catch (err) {
            console.error(err);
            alert('Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 min-h-screen font-poppins">
            <div className="container mx-auto max-w-[1100px]">
                <div className="mb-8">
                    <h1 className="font-playfair text-2xl font-bold text-[#1A202C]">Add New Product</h1>
                    <p className="text-gray-400 text-sm mt-0.5">List a new piece in your jewellery catalogue</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Left: Form */}
                    <div className="w-full lg:flex-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                                <div className="w-9 h-9 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                                    <Package size={18} className="text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h2 className="font-playfair text-[17px] font-semibold text-[#1A202C]">Product Details</h2>
                                    <p className="text-gray-400 text-xs">Fill in all the product information below</p>
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
                                        {categories.length === 0 && <option value="">Loading categories...</option>}
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
                                        <textarea rows={4} placeholder="Describe the product's design, material, and occasion use..."
                                            className={`${inputCls} pl-10 resize-none`}
                                            value={formData.description} onChange={handleChange('description')} />
                                    </div>
                                </FormField>

                                <button type="submit" disabled={loading || success}
                                    className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-[15px] transition-all shadow-sm ${success ? 'bg-green-500 text-white' : 'bg-[#D4AF37] hover:bg-[#c59b27] text-white hover:shadow-md'
                                        } disabled:opacity-70`}>
                                    {loading ? <><Loader2 size={18} className="animate-spin" /> Adding...</>
                                        : success ? <><CheckCircle2 size={18} /> Product Added!</>
                                            : <><Package size={18} /> Add Product</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Multi-Image Upload */}
                    <div className="w-full lg:w-[340px] shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-1.5">
                                <h3 className="font-playfair text-[15px] font-semibold text-[#1A202C] flex items-center gap-2">
                                    <Images size={16} className="text-[#D4AF37]" />
                                    Product Images <span className="text-red-400 text-xs font-normal">*</span>
                                </h3>
                                <span className="text-xs text-gray-400">{images.length}/8</span>
                            </div>
                            <p className="text-gray-400 text-xs mb-4">First image = primary. Click thumbnail to set as primary.</p>

                            {/* Preview Grid */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className={`relative rounded-xl overflow-hidden aspect-square border-2 cursor-pointer group transition-all ${idx === 0 ? 'border-[#D4AF37]' : 'border-gray-100 hover:border-[#D4AF37]/50'
                                            }`} onClick={() => moveToFirst(idx)}>
                                            <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                            {idx === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-[#D4AF37] text-white text-[9px] text-center py-0.5 font-semibold">PRIMARY</div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={e => { e.stopPropagation(); removeImage(idx); }}
                                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                    {/* Add more slot */}
                                    {images.length < 8 && (
                                        <button type="button" onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#D4AF37] flex items-center justify-center text-gray-300 hover:text-[#D4AF37] transition-colors">
                                            <Plus size={22} />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Upload Zone */}
                            {images.length === 0 && (
                                <label className="block cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-200 hover:border-[#D4AF37] rounded-xl p-8 text-center transition-colors bg-gray-50 hover:bg-[#D4AF37]/5">
                                        <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-3">
                                            <ImagePlus size={24} className="text-[#D4AF37]" />
                                        </div>
                                        <p className="text-[13px] font-medium text-gray-600">Click to upload images</p>
                                        <p className="text-xs text-gray-400 mt-1">Select multiple — up to 8 images</p>
                                        <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP</p>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                                </label>
                            )}

                            {images.length > 0 && (
                                <>
                                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                                    {images.length < 8 && (
                                        <button type="button" onClick={() => fileInputRef.current?.click()}
                                            className="w-full mt-1 py-2 text-sm text-[#D4AF37] hover:text-[#c59b27] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl transition-colors font-medium">
                                            + Add More Images
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl p-5 mt-4">
                            <h4 className="text-[13px] font-semibold text-[#c59b27] mb-3">💡 Photo Tips</h4>
                            <ul className="space-y-1.5 text-[12px] text-gray-500">
                                <li>• First image = main display image</li>
                                <li>• Click a thumbnail to make it primary</li>
                                <li>• Use plain/light background</li>
                                <li>• Min 800×800px for best quality</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Tiny inline Plus icon to avoid import conflict
const Plus = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

export default AddProduct;
