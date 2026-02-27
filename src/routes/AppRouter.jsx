import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';
import PosLayout from '../components/layout/PosLayout';
import AuthLayout from '../components/layout/AuthLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardOverview from '../pages/dashboard/DashboardOverview';
import ProductsPage from '../pages/dashboard/ProductsPage';
import StoresPage from '../pages/dashboard/StoresPage';
import PosTerminal from '../pages/pos/PosTerminal';
import LandingPage from '../pages/LandingPage';

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
        path: '/register',
        element: (
            <AuthLayout>
                <RegisterPage />
            </AuthLayout>
        ),
    },
    {
        path: '/',
        element: <LandingPage />,
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
            {
                path: 'products',
                element: <ProductsPage />,
            },
            {
                path: 'stores',
                element: <StoresPage />,
            },
            // Add more nested dashboard routes here: /orders, /settings
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
