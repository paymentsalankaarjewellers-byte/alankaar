import { useState, useEffect, useRef } from 'react';
import { 
    fetchCategories, createCategory, deleteCategory, updateCategory,
    fetchSubcategories, createSubcategory, deleteSubcategory
} from '../services/api';
import { 
    Plus, Trash2, FolderOpen, Loader2, ImagePlus, 
    X, Edit2, Check, LayoutGrid, Info, Sparkles, List
} from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Create Mode State
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [newImagePreview, setNewImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Edit Mode State
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const editFileInputRef = useRef(null);

    // Subcategories State
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [subcatLoading, setSubcatLoading] = useState(false);
    const [newSubcatName, setNewSubcatName] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const preview = URL.createObjectURL(file);
        if (isEdit) {
            setEditImage(file);
            setEditImagePreview(preview);
        } else {
            setNewImage(file);
            setNewImagePreview(preview);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setActionLoading(true);
        try {
            const fd = new FormData();
            fd.append('name', newName.trim());
            if (newImage) fd.append('image', newImage);
            
            await createCategory(fd);
            setNewName('');
            setNewImage(null);
            setNewImagePreview(null);
            loadCategories();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create category');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (id) => {
        setActionLoading(true);
        try {
            const fd = new FormData();
            if (editName.trim()) fd.append('name', editName.trim());
            if (editImage) fd.append('image', editImage);
            
            await updateCategory(id, fd);
            setEditingId(null);
            setEditImage(null);
            setEditImagePreview(null);
            loadCategories();
        } catch (err) {
            alert('Failed to update category');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? Products in this category will remain, but their category label will be outdated.')) return;
        try {
            await deleteCategory(id);
            if (expandedCategory?.id === id) setExpandedCategory(null);
            loadCategories();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setEditName(cat.name);
        setEditImagePreview(cat.image_url);
        setEditImage(null);
    };

    // Subcategories Logic
    const toggleSubcategories = async (cat) => {
        if (expandedCategory?.id === cat.id) {
            setExpandedCategory(null);
            setSubcategories([]);
            return;
        }
        setExpandedCategory(cat);
        setSubcatLoading(true);
        try {
            const data = await fetchSubcategories(cat.name);
            setSubcategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setSubcatLoading(false);
        }
    };

    const handleAddSubcategory = async (e) => {
        e.preventDefault();
        if (!newSubcatName.trim() || !expandedCategory) return;
        try {
            await createSubcategory(expandedCategory.name, { name: newSubcatName });
            setNewSubcatName('');
            // Reload
            const data = await fetchSubcategories(expandedCategory.name);
            setSubcategories(data);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add subcategory');
        }
    };

    const handleDeleteSubcategory = async (subCatId) => {
        if (!window.confirm('Delete this subcategory?')) return;
        try {
            await deleteSubcategory(subCatId);
            const data = await fetchSubcategories(expandedCategory.name);
            setSubcategories(data);
        } catch(err) {
            alert('Failed to delete subcategory');
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="mb-10">
                <h1 className="font-playfair text-3xl font-bold text-[#1A202C]">Category Manager</h1>
                <p className="text-gray-400 text-sm mt-1">Organize your jewellery collection into beautiful clusters</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left: Add New Category Form */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                                <Plus size={20} />
                            </div>
                            <h2 className="font-bold text-[16px] text-[#1A202C]">Create Category</h2>
                        </div>
                        
                        <form onSubmit={handleCreate} className="p-6 space-y-6">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Bridal Necklaces"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#D4AF37] outline-none transition-all text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category Thumbnail</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative group cursor-pointer aspect-video rounded-2xl border-2 border-dashed border-gray-100 hover:border-[#D4AF37] bg-gray-50 overflow-hidden transition-all flex flex-col items-center justify-center gap-2"
                                >
                                    {newImagePreview ? (
                                        <>
                                            <img src={newImagePreview} className="w-full h-full object-cover" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change Image</p>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setNewImage(null); setNewImagePreview(null); }}
                                                className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-red-500 shadow-lg hover:scale-110 transition-transform"
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm">
                                                <ImagePlus size={20} />
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Cover</p>
                                        </>
                                    )}
                                </div>
                                <input 
                                    ref={fileInputRef} 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => handleFileSelect(e)} 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={actionLoading || !newName.trim()}
                                className="w-full py-4 bg-[#D4AF37] hover:bg-[#c59b27] text-white text-[13px] font-bold rounded-2xl shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                            >
                                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                Add to Catalogue
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-3 text-[#D4AF37]">
                            <Sparkles size={18} />
                            <h3 className="font-bold text-[13px] uppercase tracking-widest">Growth Hack</h3>
                        </div>
                        <p className="text-[12px] text-gray-500 leading-relaxed">
                            Categories with high-quality thumbnails get <span className="text-[#c59b27] font-bold">40% more engagement</span> from customers on the homepage.
                        </p>
                    </div>
                </div>

                {/* Right: Active Categories List */}
                <div className="lg:col-span-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="font-bold text-[14px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             Active Clusters <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px]">{categories.length}</span>
                        </h3>
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center text-gray-300">
                            <Loader2 className="animate-spin mb-3" size={32} />
                            <p className="text-xs font-bold uppercase tracking-widest">Loading clusters...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.isArray(categories) && categories.map(cat => (
                                <div key={cat.id} className="flex flex-col group bg-white rounded-3xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition-all overflow-hidden">
                                    <div className="flex gap-4 items-center mb-2">
                                        <div className="relative w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0">
                                            {editingId === cat.id ? (
                                                <div onClick={() => editFileInputRef.current?.click()} className="cursor-pointer w-full h-full relative group/edit">
                                                    {editImagePreview ? (
                                                        <img src={editImagePreview} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <ImagePlus size={20} />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/edit:opacity-100 transition-opacity">
                                                        <Edit2 size={12} className="text-white" />
                                                    </div>
                                                </div>
                                            ) : (
                                                cat.image_url ? (
                                                    <img src={cat.image_url} className="w-full h-full object-cover" alt={cat.name} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                        <LayoutGrid size={24} />
                                                    </div>
                                                )
                                            )}
                                            {/* Hidden edit file input */}
                                            <input 
                                                ref={editFileInputRef}
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleFileSelect(e, true)}
                                            />
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            {editingId === cat.id ? (
                                                <input 
                                                    autoFocus
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full bg-gray-50 border-b border-[#D4AF37] outline-none text-[15px] font-bold text-[#1A202C] py-1"
                                                />
                                            ) : (
                                                <h4 className="font-bold text-[15px] text-[#1A202C] truncate">{cat.name}</h4>
                                            )}
                                            <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
                                                {editingId === cat.id ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdate(cat.id)}
                                                            disabled={actionLoading}
                                                            className="text-[11px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1 hover:text-green-700"
                                                        >
                                                            {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                                            Save
                                                        </button>
                                                        <button 
                                                            onClick={() => setEditingId(null)}
                                                            className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => toggleSubcategories(cat)}
                                                            className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1 hover:text-[#c59b27]"
                                                        >
                                                            <List size={12} />
                                                            Subcategories
                                                        </button>
                                                        <button 
                                                            onClick={() => startEdit(cat)}
                                                            className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 hover:text-[#c59b27]"
                                                        >
                                                            <Edit2 size={12} />
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(cat.id)}
                                                            className="text-[11px] font-bold text-gray-200 uppercase tracking-widest flex items-center gap-1 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={12} />
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Subcategories Viewer */}
                                    {expandedCategory?.id === cat.id && (
                                        <div className="mt-2 pt-3 border-t border-gray-100 bg-gray-50/50 -mx-3 -mb-3 p-3">
                                            <div className="mb-3 flex justify-between items-center">
                                                <h5 className="text-[12px] font-bold text-gray-600 uppercase tracking-widest">Subcategories</h5>
                                                {subcatLoading && <Loader2 size={14} className="animate-spin text-[#D4AF37]" />}
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {Array.isArray(subcategories) && subcategories.map(sc => (
                                                    <span key={sc.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-[13px] text-gray-700 shadow-sm">
                                                        {sc.name}
                                                        <button onClick={() => handleDeleteSubcategory(sc.id)} className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all">
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                                {subcategories.length === 0 && !subcatLoading && (
                                                    <span className="text-[12px] text-gray-400">No subcategories yet.</span>
                                                )}
                                            </div>

                                            <form onSubmit={handleAddSubcategory} className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Add new (e.g. Gold)" 
                                                    value={newSubcatName}
                                                    onChange={e => setNewSubcatName(e.target.value)}
                                                    className="flex-grow text-[13px] px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37]"
                                                />
                                                <button type="submit" disabled={!newSubcatName.trim()} className="bg-[#D4AF37] disabled:bg-gray-300 text-white px-3 py-1.5 rounded-lg text-[12px] font-bold">
                                                    Add
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {categories.length === 0 && (
                                <div className="col-span-2 py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
                                    <FolderOpen size={40} className="mb-3 opacity-20" />
                                    <p className="text-[11px] font-bold uppercase tracking-widest">No categories yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
