import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';
import PosLayout from '../components/layout/PosLayout';
import AuthLayout from '../components/layout/AuthLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import DashboardOverview from '../pages/dashboard/DashboardOverview';
import PosTerminal from '../pages/pos/PosTerminal';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <AuthLayout>
                <LoginPage />
            </AuthLayout>
        ),
    },
    {
        path: '/',
        element: <ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardOverview />,
            },
            // Add more nested dashboard routes here: /products, /orders, /settings
        ],
    },
    {
        path: '/pos',
        element: (
            <ProtectedRoute>
                <PosLayout>
                    <PosTerminal />
                </PosLayout>
            </ProtectedRoute>
        ),
    },
]);
