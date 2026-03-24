import { useState, useEffect, useRef } from 'react';
import { fetchSetting, uploadSetting } from '../services/api';
import { Settings, ImagePlus, Loader2, Save, Info, Sparkles, Layout } from 'lucide-react';

const AdminSettings = () => {
    const [slides, setSlides] = useState([
        { id: 1, imageUrl: '', title: '', subtitle: '', file: null, preview: null, uploading: false },
        { id: 2, imageUrl: '', title: '', subtitle: '', file: null, preview: null, uploading: false },
        { id: 3, imageUrl: '', title: '', subtitle: '', file: null, preview: null, uploading: false }
    ]);
    const [loading, setLoading] = useState(true);
    const fileInputRefs = useRef([useRef(), useRef(), useRef()]);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const updatedSlides = [...slides];
            for (let i = 1; i <= 3; i++) {
                const [img, title, sub] = await Promise.all([
                    fetchSetting(`hero_image_${i}`).catch(() => ({ value: '' })),
                    fetchSetting(`hero_title_${i}`).catch(() => ({ value: '' })),
                    fetchSetting(`hero_subtitle_${i}`).catch(() => ({ value: '' }))
                ]);
                updatedSlides[i - 1] = {
                    ...updatedSlides[i - 1],
                    imageUrl: img.value || '',
                    title: title.value || '',
                    subtitle: sub.value || ''
                };
            }
            setSlides(updatedSlides);
        } catch (err) {
            console.error("Failed to load settings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const newSlides = [...slides];
        newSlides[index].file = file;
        newSlides[index].preview = URL.createObjectURL(file);
        setSlides(newSlides);
    };

    const handleTextChange = (index, field, value) => {
        const newSlides = [...slides];
        newSlides[index][field] = value;
        setSlides(newSlides);
    };

    const handleSaveSlide = async (index) => {
        const slide = slides[index];
        const newSlides = [...slides];
        newSlides[index].uploading = true;
        setSlides(newSlides);

        try {
            // Save title and subtitle
            await Promise.all([
                uploadSetting(`hero_title_${index + 1}`, { value: slide.title }),
                uploadSetting(`hero_subtitle_${index + 1}`, { value: slide.subtitle })
            ]);

            // Save image if new file selected
            if (slide.file) {
                const fd = new FormData();
                fd.append('image', slide.file);
                const res = await uploadSetting(`hero_image_${index + 1}`, fd);
                newSlides[index].imageUrl = res.value;
            }

            newSlides[index].preview = null;
            newSlides[index].file = null;
            alert(`Slide ${index + 1} saved successfully!`);
        } catch (err) {
            alert(`Failed to save slide ${index + 1}`);
        } finally {
            newSlides[index].uploading = false;
            setSlides([...newSlides]);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-gold" size={40} />
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <div className="mb-10">
                <h1 className="font-playfair text-3xl font-bold text-[#1A202C]">Store Customization</h1>
                <p className="text-gray-400 text-sm mt-1">Manage your homepage hero carousel slides (Up to 3)</p>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {slides.map((slide, idx) => (
                    <div key={slide.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Preview Area */}
                        <div className="relative aspect-[4/5] lg:aspect-auto bg-gray-50 border-r border-gray-50 overflow-hidden group">
                            {(slide.preview || slide.imageUrl) ? (
                                <img 
                                    src={slide.preview || slide.imageUrl} 
                                    className={`w-full h-full object-cover transition-transform duration-700 ${slide.uploading ? 'blur-sm grayscale' : 'group-hover:scale-105'}`}
                                    alt={`Slide ${slide.id}`}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 p-12 text-center">
                                    <ImagePlus size={48} className="mb-4 opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest leading-loose">No Image for Slide {slide.id}<br/>Click upload below</p>
                                </div>
                            )}
                            
                            {slide.uploading && (
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mb-4"></div>
                                    <p className="text-xs font-bold text-gold uppercase tracking-widest">Saving Slide...</p>
                                </div>
                            )}

                            <div className="absolute top-6 left-6">
                                <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border border-gray-100">Slide 0{slide.id}</span>
                            </div>
                        </div>

                        {/* Slide Content Management */}
                        <div className="p-8 flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                                    <Sparkles size={20} />
                                </div>
                                <h2 className="font-playfair text-xl font-bold text-[#1A202C]">Slide {slide.id} Details</h2>
                            </div>

                            <div className="space-y-6 flex-grow">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Title</label>
                                    <input 
                                        type="text"
                                        value={slide.title}
                                        onChange={(e) => handleTextChange(idx, 'title', e.target.value)}
                                        placeholder="e.g. Elegance in Every Detail"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subtitle / Description</label>
                                    <textarea 
                                        value={slide.subtitle}
                                        onChange={(e) => handleTextChange(idx, 'subtitle', e.target.value)}
                                        placeholder="e.g. Discover our curated collection of timeless gold..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-sm resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hero Image</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden"
                                        ref={el => fileInputRefs.current[idx] = el}
                                        onChange={(e) => handleFileSelect(idx, e)}
                                    />
                                    <button 
                                        onClick={() => fileInputRefs.current[idx]?.click()}
                                        className="w-full py-4 border-2 border-dashed border-gray-100 hover:border-gold text-gray-400 hover:text-gold text-xs font-bold rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2 group"
                                    >
                                        <ImagePlus size={18} className="group-hover:scale-110 transition-transform" />
                                        {slide.preview || slide.imageUrl ? 'Change Slide Image' : 'Choose Slide Image'}
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleSaveSlide(idx)}
                                disabled={slide.uploading}
                                className="mt-8 w-full py-4 bg-[#1A202C] hover:bg-gold text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 group"
                            >
                                <Save size={18} className="group-hover:rotate-12 transition-transform" />
                                Save Slide 0{slide.id}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gold shrink-0">
                    <Info size={32} />
                </div>
                <div>
                    <h3 className="font-playfair text-lg font-bold text-[#1A202C]">Carousel Optimization Tips</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        For the best split-screen look, use <span className="font-bold text-[#1A202C]">Vertical / Portrait</span> oriented images (2:3 or 3:4 aspect ratio). 
                        The layout will automatically place text on the left and images on the right for desktop, and stack them for mobile.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
