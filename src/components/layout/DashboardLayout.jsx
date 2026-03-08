import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { useTranslation } from 'react-i18next';
import BusinessGuard from '../auth/BusinessGuard';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Settings,
    LogOut,
    Store,
    Menu,
    Bell,
    ListFilter,
    Moon,
    Sun,
    Globe,
    Languages
} from 'lucide-react';
import { Button } from '../ui/button';

const DashboardLayout = ({ children }) => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUIStore();
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

    const allNavItems = [
        { name: t('common.dashboard'), path: '/dashboard', icon: LayoutDashboard, roles: ['ROLE_STORE_ADMIN', 'ROLE_STORE_MANAGER', 'ROLE_BRANCH_MANAGER'] },
        { name: t('common.posTerminal'), path: '/pos', icon: ShoppingCart, roles: ['ROLE_STORE_ADMIN', 'ROLE_BRANCH_CASHIER'] },
        { name: t('common.orders'), path: '/dashboard/orders', icon: ListFilter, roles: ['ROLE_STORE_ADMIN', 'ROLE_STORE_MANAGER', 'ROLE_BRANCH_MANAGER'] },
        { name: t('common.inventory'), path: '/dashboard/inventory', icon: Package, roles: ['ROLE_STORE_ADMIN', 'ROLE_STORE_MANAGER', 'ROLE_BRANCH_MANAGER'] },
        { name: t('common.products'), path: '/dashboard/products', icon: Package, roles: ['ROLE_SUPER_ADMIN', 'ROLE_STORE_ADMIN', 'ROLE_STORE_MANAGER'] },
        { name: t('common.storesAndBranches'), path: '/dashboard/stores', icon: Store, roles: ['ROLE_SUPER_ADMIN', 'ROLE_STORE_ADMIN', 'ROLE_STORE_MANAGER'] },
        { name: t('common.settings'), path: '/dashboard/settings', icon: Settings, roles: ['ROLE_STORE_ADMIN'] },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        logout();
    };

    const navItems = allNavItems.filter(item =>
        !item.roles ||
        item.roles.includes(user?.role) ||
        user?.role === 'ROLE_SUPER_ADMIN'
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 shrink-0">
                    {sidebarOpen ? (
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            TenantPOS
                        </span>
                    ) : (
                        <span className="text-xl font-bold text-indigo-600">TP</span>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} ${!sidebarOpen ? 'mx-auto' : 'mr-3'}`} />
                                {sidebarOpen && <span className="font-medium">{item.name}</span>}
                            </Link>
                        )
                    })}
                </div>

                {/* User / Logout */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center w-full px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors group"
                    >
                        <LogOut className={`w-5 h-5 shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-red-500 ${!sidebarOpen ? 'mx-auto' : 'mr-3'}`} />
                        {sidebarOpen && <span className="font-medium">{t('common.logout')}</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                {/* Top Header */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500">
                            <Menu className="w-5 h-5" />
                        </Button>
                        {/* Context Picker could go here (e.g. Current Branch) */}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <div className="relative group">
                            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold px-2 py-1 rounded-lg">
                                <Languages className="w-4 h-4" />
                                <span className="uppercase text-xs">{i18n.language.split('-')[0]}</span>
                            </Button>
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0 z-50">
                                <div className="p-2 space-y-1">
                                    <button onClick={() => changeLanguage('en')} className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">English</button>
                                    <button onClick={() => changeLanguage('fr')} className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Français</button>
                                    <button onClick={() => changeLanguage('rw')} className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Kinyarwanda</button>
                                </div>
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                        <Link to="/dashboard/settings">
                            <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Settings className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-800">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <BusinessGuard>
                        {children || <Outlet />}
                    </BusinessGuard>
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-6 border border-red-200 dark:border-red-800">
                                <LogOut className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('common.confirmLogout')}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                {t('common.logoutConfirmationMessage')}
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400"
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                onClick={handleLogout}
                                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-200 dark:shadow-none"
                            >
                                {t('common.confirm')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
