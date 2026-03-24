import { useState, useEffect } from 'react';
import { fetchFilterOptions, createFilterOption, deleteFilterOption } from '../services/api';
import { SlidersHorizontal, Plus, X, Loader2, AlertCircle } from 'lucide-react';

const FILTER_SECTIONS = [
    { id: 'design', label: 'Design Options' },
    { id: 'jewel_type', label: 'Jewel Types' },
    { id: 'style', label: 'Styles' },
    { id: 'wedding', label: 'The Wedding Collection' },
    { id: 'occasions', label: 'Occasions' },
    { id: 'color', label: 'Colors' }
];

const FilterSectionCard = ({ section, options, onAdd, onDelete }) => {
    const [newValue, setNewValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newValue.trim()) return;
        setIsSubmitting(true);
        try {
            await onAdd(section.id, newValue);
            setNewValue('');
        } catch (err) {
            alert('Failed to add filter option. It might already exist.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h3 className="font-playfair text-[17px] font-semibold text-[#1A202C] mb-4">
                {section.label}
            </h3>
            
            <div className="flex-grow">
                {options.length === 0 ? (
                    <div className="text-sm text-gray-400 italic mb-4">No options defined yet.</div>
                ) : (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {options.map((opt) => (
                            <div key={opt.id} className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-sm text-gray-700 px-3 py-1.5 rounded-lg shadow-sm">
                                <span>{opt.name}</span>
                                <button
                                    onClick={() => onDelete(opt.id, opt.name)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete option"
                                >
                                    <X size={14} strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-auto relative">
                <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={`Add new ${section.label.toLowerCase()}...`}
                    disabled={isSubmitting}
                    className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!newValue.trim() || isSubmitting}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#D4AF37] text-white rounded-lg hover:bg-[#c59b27] disabled:opacity-50 disabled:hover:bg-[#D4AF37] transition-colors"
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                </button>
            </form>
        </div>
    );
};

const AdminFilters = () => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOptions = async () => {
        try {
            const data = await fetchFilterOptions();
            setOptions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOptions();
    }, []);

    const handleAdd = async (filterType, name) => {
        await createFilterOption(filterType, name);
        await loadOptions();
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete the option "${name}"? It will be removed from products using it.`)) return;
        try {
            await deleteFilterOption(id);
            setOptions(prev => prev.filter(o => o.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete option');
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh] text-gray-400">
                <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    // Group options by filter_type
    const groupedOptions = FILTER_SECTIONS.reduce((acc, section) => {
        acc[section.id] = options.filter(opt => opt.filter_type === section.id);
        return acc;
    }, {});

    return (
        <div className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-playfair text-3xl font-bold text-[#1A202C] flex items-center gap-3">
                        <SlidersHorizontal size={26} className="text-[#D4AF37]" />
                        Manage Filter Lists
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 max-w-2xl bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <AlertCircle size={16} className="inline mr-1 text-amber-500 -mt-0.5" />
                        Options defined here populate the strict dropdowns when adding products and control exactly what appears on the Collections filter sidebar.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FILTER_SECTIONS.map(section => (
                    <FilterSectionCard
                        key={section.id}
                        section={section}
                        options={groupedOptions[section.id] || []}
                        onAdd={handleAdd}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminFilters;
