import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Package, Layers, Settings, 
    ArrowLeft, LogOut, Menu, X, ExternalLink, Plus, SlidersHorizontal, ShoppingBag, Tag, User
} from 'lucide-react';
import { logoutAdmin } from '../services/api';
import { useState, useEffect } from 'react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/');
    };

    // Responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        { icon: Package, label: 'Inventory', path: '/admin/products' },
        { icon: Layers, label: 'Categories', path: '/admin/categories' },
        { icon: SlidersHorizontal, label: 'Filters', path: '/admin/filters' },
        { icon: Plus, label: 'Add Product', path: '/admin/add' },
        { icon: Tag, label: 'Checkout Config', path: '/admin/coupons' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-poppins flex">
            
            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && (
                <button 
                    onClick={toggleSidebar}
                    className="lg:hidden fixed top-4 left-4 z-[60] w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center text-gray-600 border border-gray-100"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 transform lg:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6 flex items-center justify-between">
                        <Link to="/admin" className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#D4AF37] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#D4AF37]/20">
                                <LayoutDashboard size={20} />
                            </div>
                            <span className="font-playfair font-bold text-xl text-[#1A202C]">Admin Panel</span>
                        </Link>
                        <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                        <div className="px-3 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Main Menu</div>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => 
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                        isActive 
                                        ? 'bg-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/20' 
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                                onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                            >
                                <item.icon size={19} className="shrink-0" />
                                <span className="font-medium text-[15px]">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-50">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium text-[15px]"
                        >
                            <LogOut size={19} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
                <div className="min-h-screen">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
