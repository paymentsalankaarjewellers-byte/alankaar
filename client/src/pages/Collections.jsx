import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProducts, fetchFilterOptions, fetchCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

const FilterAccordion = ({ title, options, selectedOptions, onChange, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-[#EADCCC]/40 py-4">
            <button 
                className="flex items-center justify-between w-full text-left outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-[12px] font-normal text-gray-800 uppercase tracking-[0.2em]">{title}</span>
                {isOpen ? <ChevronUp size={16} className="text-gray-500" strokeWidth={1} /> : <ChevronDown size={16} className="text-gray-500" strokeWidth={1} />}
            </button>
            
            {isOpen && (
                <div className="mt-4 space-y-3">
                    {options.map(option => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${selectedOptions.includes(option) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-300 group-hover:border-[#D4AF37]'}`}>
                                {selectedOptions.includes(option) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={selectedOptions.includes(option)}
                                onChange={() => onChange(option)} 
                            />
                            <span className="text-[13px] text-gray-600 group-hover:text-gray-900">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const Collections = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const [shopByCollections, setShopByCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // active states from URL
    const queryParams = new URLSearchParams(location.search);
    const activeCategory = queryParams.get('category') || 'All';
    const activeSubcategoryFromUrl = queryParams.get('subcategory') || '';

    const [searchQuery, setSearchQuery] = useState('');

    // Filter Arrays
    const [selectedAvailability, setSelectedAvailability] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedDesigns, setSelectedDesigns] = useState([]);
    const [selectedJewelTypes, setSelectedJewelTypes] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedWedding, setSelectedWedding] = useState([]);
    const [selectedOccasions, setSelectedOccasions] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState(activeSubcategoryFromUrl ? [activeSubcategoryFromUrl] : []);

    const [sortBy, setSortBy] = useState('Best selling');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [productData, filtersData, categoriesData] = await Promise.all([
                    fetchProducts(activeCategory),
                    fetchFilterOptions(),
                    fetchCategories()
                ]);
                setProducts(productData);

                // Group filter options by type
                const grouped = filtersData.reduce((acc, opt) => {
                    if (!acc[opt.filter_type]) acc[opt.filter_type] = [];
                    acc[opt.filter_type].push(opt.name);
                    return acc;
                }, {});
                setFilterOptions(grouped);

                // Use actual categories for "Shop by collections"
                setShopByCollections(Array.isArray(categoriesData) ? categoriesData.map(c => c.name) : []);

                setLoading(false);
            } catch (err) {
                console.error("Failed to load collection data", err);
                setLoading(false);
            }
        };
        loadData();
    }, [activeCategory]);

    // Apply Filters & Sorting
    useEffect(() => {
        let result = [...products];

        // Search Query
        if (searchQuery) {
            result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Accordion Checkboxes logic (OR within category, AND across categories)
        const applyArrayFilter = (arr, selector) => {
            if (arr.length > 0) {
                result = result.filter(p => arr.includes(selector(p)));
            }
        };

        applyArrayFilter(selectedDesigns, p => p.design);
        applyArrayFilter(selectedJewelTypes, p => p.jewel_type);
        applyArrayFilter(selectedStyles, p => p.style);
        applyArrayFilter(selectedOccasions, p => p.occasions);
        applyArrayFilter(selectedColors, p => p.color);
        applyArrayFilter(selectedSubcategories, p => p.subcategory);
        applyArrayFilter(selectedCollections, p => p.category); // Example proxy for "Shop by collections"

        // Availability Filter (Mock based on stock_quantity > 0)
        if (selectedAvailability.length > 0) {
            result = result.filter(p => {
                const isInStock = p.stock_quantity > 0;
                if (selectedAvailability.includes('In Stock') && isInStock) return true;
                if (selectedAvailability.includes('Out of Stock') && !isInStock) return true;
                return false;
            });
        }

        // Price Filter
        if (selectedPrices.length > 0) {
            result = result.filter(p => {
                const price = Number(p.price) || 0;
                return selectedPrices.some(range => {
                    if (range === 'Under ₹5,000') return price < 5000;
                    if (range === '₹5,000 - ₹20,000') return price >= 5000 && price <= 20000;
                    if (range === 'Above ₹20,000') return price > 20000;
                    return false;
                });
            });
        }

        // Sorting
        switch(sortBy) {
            case 'Best selling':
                // Proxy: sort by lowest stock remaining as "best selling"
                result.sort((a, b) => a.stock_quantity - b.stock_quantity);
                break;
            case 'Alphabetically, A-Z':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'Alphabetically, Z-A':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'Price, low to high':
                result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
                break;
            case 'Price, high to low':
                result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
                break;
            case 'Date, old to new':
                result.sort((a, b) => a.id - b.id);
                break;
            case 'Date, new to old':
                result.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    }, [
        products, searchQuery, sortBy, 
        selectedDesigns, selectedJewelTypes, selectedStyles, 
        selectedOccasions, selectedColors, selectedSubcategories,
        selectedAvailability, selectedPrices, selectedCollections
    ]);

    const toggleFilter = (setter) => (val) => {
        setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    };

    return (
        <div className="pt-32 pb-20 bg-[#F8F6F0] min-h-screen font-poppins text-gray-800">
            {/* Page Header */}
            <div className="text-center py-6 mb-4">
                <h1 className="text-3xl md:text-5xl font-playfair font-medium text-[#1A202C] mb-4">
                    {activeCategory === 'All' ? 'All Collections' : activeCategory}
                </h1>

                {/* Search Bar */}
                <div className="mt-8 max-w-xl mx-auto px-4">
                    <div className="relative flex items-center bg-white rounded-full border border-gray-200 overflow-hidden shadow-sm">
                        <div className="pl-4 pr-2 text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for jewellery..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-3 pr-4 outline-none text-sm text-gray-700 bg-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-[1500px]">
                {/* Mobile Filter & Sort */}
                <div className="lg:hidden mb-6 flex items-center gap-2 lg:gap-4">
                    <button 
                        onClick={() => setIsFilterOpen(true)}
                        className="flex-1 flex items-center justify-start pl-4 gap-3 bg-white py-3 border border-gray-200 outline-none"
                    >
                        <SlidersHorizontal size={16} className="text-gray-600" />
                        <span className="text-[14px] text-gray-800 tracking-wide">Filter</span>
                    </button>
                    
                    <div className="flex-1 relative h-full">
                        <select
                            className="w-full appearance-none bg-white py-3 pl-4 pr-10 border border-gray-200 text-[14px] text-gray-800 outline-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {[
                                'Best selling',
                                'Alphabetically, A-Z',
                                'Alphabetically, Z-A',
                                'Price, low to high',
                                'Price, high to low',
                                'Date, old to new',
                                'Date, new to old'
                            ].map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                    
                    {/* Mobile Filter Overlay/Backdrop */}
                    {isFilterOpen && (
                        <div 
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
                            onClick={() => setIsFilterOpen(false)}
                        />
                    )}

                    {/* Sidebar Filters */}
                    <div className={`
                        fixed lg:sticky lg:top-32 inset-y-0 left-0 z-[70] lg:z-0
                        w-[280px] lg:w-[260px] h-full lg:h-[calc(100vh-140px)]
                        bg-white lg:bg-transparent
                        shadow-2xl lg:shadow-none
                        transform transition-transform duration-300 ease-in-out
                        ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        overflow-y-auto lg:overflow-y-auto hidden-scrollbar
                        p-6 lg:p-0 border-r border-gray-100 lg:border-none
                    `}>
                        {/* Mobile Sidebar Header */}
                        <div className="flex justify-between items-center mb-6 lg:hidden border-b border-gray-100 pb-4">
                            <h3 className="font-playfair text-xl font-bold text-gray-900">Filters</h3>
                            <button 
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="bg-transparent pb-10">
                            {/* Clear All button */}
                            <div className="flex justify-between items-center mb-4 hidden lg:flex">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#7E8B9A]">Filters</span>
                                <button
                                    className="text-[10px] uppercase font-bold text-[#D4AF37] hover:underline"
                                    onClick={() => {
                                        setSearchQuery(''); setSelectedAvailability([]); setSelectedPrices([]);
                                        setSelectedDesigns([]); setSelectedJewelTypes([]); setSelectedStyles([]);
                                        setSelectedOccasions([]); setSelectedColors([]); setSelectedSubcategories([]);
                                        setSelectedCollections([]);
                                    }}
                                >
                                    Clear all
                                </button>
                            </div>

                            <FilterAccordion 
                                title="AVAILABILITY" 
                                options={['In Stock', 'Out of Stock']} 
                                selectedOptions={selectedAvailability} 
                                onChange={toggleFilter(setSelectedAvailability)} 
                                defaultOpen={false}
                            />
                            
                            <FilterAccordion 
                                title="PRICE" 
                                options={['Under ₹5,000', '₹5,000 - ₹20,000', 'Above ₹20,000']} 
                                selectedOptions={selectedPrices} 
                                onChange={toggleFilter(setSelectedPrices)} 
                            />

                            <FilterAccordion title="DESIGN" options={filterOptions['design'] || []} selectedOptions={selectedDesigns} onChange={toggleFilter(setSelectedDesigns)} />
                            <FilterAccordion title="JEWEL TYPE" options={filterOptions['jewel_type'] || []} selectedOptions={selectedJewelTypes} onChange={toggleFilter(setSelectedJewelTypes)} />
                            <FilterAccordion title="STYLE" options={filterOptions['style'] || []} selectedOptions={selectedStyles} onChange={toggleFilter(setSelectedStyles)} />
                            <FilterAccordion title="SHOP BY COLLECTIONS" options={shopByCollections} selectedOptions={selectedCollections} onChange={toggleFilter(setSelectedCollections)} />
                            <FilterAccordion title="THE WEDDING COLLECTION" options={filterOptions['wedding'] || []} selectedOptions={selectedWedding} onChange={toggleFilter(setSelectedWedding)} />
                            <FilterAccordion title="OCASSIONS" options={filterOptions['occasions'] || []} selectedOptions={selectedOccasions} onChange={toggleFilter(setSelectedOccasions)} />
                            <FilterAccordion title="COLOR" options={filterOptions['color'] || []} selectedOptions={selectedColors} onChange={toggleFilter(setSelectedColors)} />

                        </div>
                    </div>

                    {/* Product Grid Area */}
                    <div className="flex-grow w-full min-w-0">
                        
                        {/* Top Action Bar (Sorting) */}
                        <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                            <div className="text-[13px] text-gray-500 font-medium">
                                {filteredProducts.length} products
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[12px] uppercase tracking-widest font-semibold text-gray-500">Sort By</span>
                                <select
                                    className="p-2 border border-gray-200 rounded text-[13px] text-[#2D3748] outline-none focus:border-[#D4AF37] bg-white transition-colors cursor-pointer min-w-[180px]"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    {[
                                        'Best selling',
                                        'Alphabetically, A-Z',
                                        'Alphabetically, Z-A',
                                        'Price, low to high',
                                        'Price, high to low',
                                        'Date, old to new',
                                        'Date, new to old'
                                    ].map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Loading exotic jewels...</p>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white border border-gray-100 rounded-2xl shadow-sm px-4">
                                <p className="text-gray-500 text-sm font-medium">No products match the selected filters.</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery(''); setSelectedAvailability([]); setSelectedPrices([]);
                                        setSelectedDesigns([]); setSelectedJewelTypes([]); setSelectedStyles([]);
                                        setSelectedOccasions([]); setSelectedColors([]); setSelectedSubcategories([]);
                                        setSelectedCollections([]);
                                    }}
                                    className="mt-4 px-6 py-2.5 bg-[#D4AF37] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#c59b27] transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collections;
