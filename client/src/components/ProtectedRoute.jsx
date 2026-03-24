import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { verifyAdminToken } from '../services/api';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const [isAuthed, setIsAuthed] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setIsAuthed(false);
                return;
            }
            try {
                await verifyAdminToken();
                setIsAuthed(true);
            } catch (error) {
                setIsAuthed(false);
            }
        };
        checkAuth();
    }, [location.pathname]);

    if (isAuthed === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                <p className="mt-4 text-gray-500 font-medium">Verifying access...</p>
            </div>
        );
    }

    if (!isAuthed) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
