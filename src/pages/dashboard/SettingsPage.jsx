import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    User,
    Bell,
    Shield,
    Smartphone,
    Moon,
    Sun,
    Save,
    Globe,
    CreditCard,
    Building,
    Check,
    Store,
    LayoutGrid,
    Type,
    MapPinned
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { storeApi } from '../../lib/api/stores';

const SettingsPage = () => {
    const { t, i18n: i18nInstance } = useTranslation();
    const { user, updateUser } = useAuthStore();
    const { theme, setTheme } = useUIStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Business creation state
    const [businessForm, setBusinessForm] = useState({
        brand: '',
        description: '',
        address: '',
        phone: '',
        storeType: 'RETAIL',
        email: user?.email || ''
    });
    const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);

    const tabs = [
        { id: 'profile', label: t('settings.tabs.profile'), icon: User },
        { id: 'security', label: t('settings.tabs.security'), icon: Shield },
        { id: 'business', label: t('settings.tabs.business'), icon: Building },
        { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
        { id: 'preferences', label: t('settings.tabs.preferences'), icon: Globe },
    ];

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        }, 1500);
    };

    const handleCreateBusiness = async (e) => {
        e.preventDefault();
        setIsCreatingBusiness(true);
        try {
            const res = await storeApi.create({
                ...businessForm,
                storeAdminId: user.id
            });
            if (res.data) {
                updateUser({ storeId: res.data.id });
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3000);
            }
        } catch (err) {
            console.error('Failed to create business:', err);
        } finally {
            setIsCreatingBusiness(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('settings.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{t('settings.subtitle')}</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 dark:shadow-none rounded-xl px-8 h-12 font-bold transition-all active:scale-95 disabled:opacity-70"
                >
                    {isSaving ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('common.saving')}
                        </div>
                    ) : savedSuccess ? (
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            {t('common.changesSaved')}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            {t('common.saveChanges')}
                        </div>
                    )}
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs / Sidebar Navigation */}
                <div className="lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap lg:w-full font-medium ${isActive
                                    ? 'bg-white dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-indigo-500/30'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[600px] flex flex-col transition-colors duration-300">
                    <div className="p-8 flex-1">
                        {activeTab === 'profile' && (
                            <div className="space-y-10 animate-in fade-in duration-500">
                                <div className="flex flex-col md:flex-row gap-10 items-start">
                                    <div className="relative group mx-auto md:mx-0">
                                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-[3px] shadow-2xl shadow-indigo-200 dark:shadow-none transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                                            <div className="w-full h-full rounded-[2.3rem] bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-4xl font-black">
                                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all">
                                            <Smartphone className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-8 w-full">
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t('settings.profile.title')}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('settings.profile.subtitle')}</p>
                                        </div>

                                        <div className="grid gap-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 pointer-events-none">{t('settings.profile.firstName')}</label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                        <Input
                                                            defaultValue={user?.firstName || ''}
                                                            placeholder="Ex: John"
                                                            className="h-13 pl-11 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 pointer-events-none">{t('settings.profile.lastName')}</label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                        <Input
                                                            defaultValue={user?.lastName || ''}
                                                            placeholder="Ex: Doe"
                                                            className="h-13 pl-11 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 pointer-events-none">{t('settings.profile.email')}</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                    <Input
                                                        defaultValue={user?.email || ''}
                                                        placeholder="john.doe@enterprise.com"
                                                        className="h-13 pl-11 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 pointer-events-none">{t('settings.profile.bio')}</label>
                                                <div className="relative">
                                                    <Type className="absolute left-4 top-4 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                                    <textarea
                                                        className="w-full min-h-[140px] pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                                        placeholder="Write a brief description about your role and expertise..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('settings.security.title')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('settings.security.subtitle')}</p>
                                </div>

                                <div className="space-y-6 max-w-2xl">
                                    <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400 dark:text-slate-500">
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">Account Role</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black mt-0.5">{user?.role?.replace('ROLE_', '') || 'GENERAL USER'}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl">Request Upgrade</Button>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t('settings.security.currentPassword')}</label>
                                            <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                                            <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm New Password</label>
                                            <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'business' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('settings.business.title')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('settings.business.subtitle')}</p>
                                </div>

                                {user?.storeId ? (
                                    <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
                                        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Store className="w-6 h-6 text-indigo-500" />
                                                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded font-black uppercase tracking-widest">Active Store</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Assigned Store ID</p>
                                                <p className="font-mono text-sm text-slate-900 dark:text-slate-200 mt-1 break-all">{user.storeId}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <LayoutGrid className="w-6 h-6 text-emerald-500" />
                                                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-bold uppercase tracking-widest">Global Ops</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Business Status</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-200 mt-1">Verified Enterprise</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleCreateBusiness} className="max-w-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                                                <Building className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">Register Your Business</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Launch your flagship store in seconds.</p>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name</label>
                                                <Input
                                                    required
                                                    value={businessForm.brand}
                                                    onChange={(e) => setBusinessForm({ ...businessForm, brand: e.target.value })}
                                                    placeholder="Global Retail Inc."
                                                    className="h-12 bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                                <Input
                                                    required
                                                    value={businessForm.phone}
                                                    onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="h-12 bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">HQ Address</label>
                                            <Input
                                                required
                                                value={businessForm.address}
                                                onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                                                placeholder="123 Commerce St, New York, NY"
                                                className="h-12 bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-700"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                            <textarea
                                                required
                                                value={businessForm.description}
                                                onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                                                className="w-full min-h-[80px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                                placeholder="Provide a brief summary of your business operations..."
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isCreatingBusiness}
                                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none"
                                        >
                                            {isCreatingBusiness ? t('settings.business.launching') : t('settings.business.launchNow')}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Communication Hub</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure how and when you receive system alerts.</p>
                                </div>

                                <div className="grid gap-4">
                                    {[
                                        { id: 'email_reports', title: 'Daily Sales Reports', desc: 'Receive a summary of all sales and performance metrics via email.', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                                        { id: 'low_stock', title: 'Low Stock Alerts', desc: 'Get notified immediately when inventory levels fall below threshold.', icon: LayoutGrid, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                                        { id: 'security_alerts', title: 'Security Notifications', desc: 'Alerts regarding login attempts from new devices or locations.', icon: Shield, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                                        { id: 'customer_orders', title: 'New Customer Orders', desc: 'Real-time push notifications for incoming online orders.', icon: Smartphone, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' }
                                    ].map((opt) => {
                                        const Icon = opt.icon;
                                        return (
                                            <div key={opt.id} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 transition-all rounded-2xl border border-slate-100 dark:border-slate-800 group shadow-sm hover:shadow-md">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl ${opt.bg} flex items-center justify-center ${opt.color} shrink-0`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="max-w-md">
                                                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{opt.title}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{opt.desc}</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer ml-4">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Interface Preferences</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customize your dashboard appearance and regional settings.</p>
                                </div>

                                <div className="grid gap-6 max-w-2xl">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${theme === 'light'
                                                ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/20'
                                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900'
                                                }`}
                                        >
                                            <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                                            <div>
                                                <p className={`font-bold ${theme === 'light' ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>Light Mode</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${theme === 'light' ? 'text-indigo-400' : 'text-slate-400'}`}>
                                                    {theme === 'light' ? 'Active' : 'Standard View'}
                                                </p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${theme === 'dark'
                                                ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/20'
                                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900'
                                                }`}
                                        >
                                            <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                                            <div>
                                                <p className={`font-bold ${theme === 'dark' ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>Dark Mode</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`}>
                                                    {theme === 'dark' ? 'Active' : 'Experience Depth'}
                                                </p>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-slate-400" />
                                            System Language
                                        </label>
                                        <select
                                            className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 dark:text-slate-100"
                                            value={i18nInstance.language}
                                            onChange={(e) => i18nInstance.changeLanguage(e.target.value)}
                                        >
                                            <option value="en">English (United States)</option>
                                            <option value="fr">French (France)</option>
                                            <option value="rw">Kinyarwanda (Rwanda)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sticky Footer */}
                    <div className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between transition-colors">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">Enterprise POS System v2.4.0-stable</p>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200 animate-pulse" />
                            <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">Cloud Sync Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
