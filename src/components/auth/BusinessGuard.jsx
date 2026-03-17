import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import {
    LayoutDashboard,
    Store,
    PlusCircle,
    ArrowRight,
    Building2,
    ShieldAlert,
    MapPin
} from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const BusinessGuard = ({ children }) => {
    const user = useAuthStore((state) => state.user);

    // Check if user has a store or branch. 
    // Super admins can manage all.
    // Store admins and managers MUST have a storeId.
    const isSuperAdmin = user?.role === 'ROLE_SUPER_ADMIN';
    const hasStore = user?.storeId;
    const hasBranch = user?.branchId;
    
    // If it's a store admin, they might have a store but no branch yet.
    // They should still be allowed into the dashboard to manage stores/branches.
    const isStoreAdmin = user?.role === 'ROLE_STORE_ADMIN';
    
    const hasBasicBusinessAccess = hasStore || isSuperAdmin || isStoreAdmin;

    if (!hasBasicBusinessAccess) {
        return (
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8 animate-in fade-in zoom-in duration-700">
                <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-100 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                    <div className="p-8 lg:p-12 relative flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Building2 className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Build Your <span className="text-indigo-600">Retail Empire</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-md leading-relaxed">
                            It looks like you haven't set up a business yet. To start managing your inventory and sales, you'll need to create or join a store.
                        </p>

                        <div className="grid gap-4 mt-10 w-full max-w-sm">
                            <Link to="/dashboard/stores">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 group">
                                    <PlusCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                    Setup My Business
                                    <ArrowRight className="w-5 h-5 ml-auto opacity-50" />
                                </Button>
                            </Link>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-left border border-slate-100 dark:border-slate-800">
                                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                    If you were invited to a branch, please contact your administrator to ensure your account is correctly linked.
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-8 opacity-40">
                            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-widest font-black">Dashboards</span>
                            </div>
                            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
                                <Store className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-widest font-black">Multi-Store</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If they have a store but no branch, and they are trying to access features that REQUIRE a branch (like Inventory or POS)
    const requiresBranch = ['/dashboard/inventory', '/dashboard', '/pos'].some(path => window.location.pathname.startsWith(path));
    const isDashboardRoot = window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/';
    
    if (!hasBranch && !isSuperAdmin && requiresBranch && !isDashboardRoot) {
        return (
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8 animate-in fade-in zoom-in duration-500">
                <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden text-center p-8 lg:p-12">
                    <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Branch Required</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        To access this feature, you need to be assigned to a branch or create one for your store.
                    </p>
                    <Link to="/dashboard/stores">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold">
                            Manage Branches
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return children;
};

export default BusinessGuard;
