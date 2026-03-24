import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import { ShoppingBag, Lock, User, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loginAdmin({ username, password });
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4">
            <div className="max-w-md w-full">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-gold-200/30 mb-4 transition-transform hover:scale-105 duration-300">
                        <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Alankaar</h1>
                    <p className="text-gray-500 mt-2 font-medium">Administrative Access Only</p>
                </div>

                {/* Form Card */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gold-900/5 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-shake">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-400"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-400"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer link */}
                <p className="text-center mt-8 text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Alankaar Jewellers. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
