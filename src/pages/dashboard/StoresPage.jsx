import React, { useEffect, useState, useCallback } from 'react';
import {
    Building2,
    MapPin,
    Users,
    Activity,
    Plus,
    AlertCircle,
    Loader2,
    Mail,
    Phone,
    Clock,
    ChevronRight,
    Store,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    ArrowUpDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { storeApi } from '../../lib/api/stores';
import { branchApi } from '../../lib/api/branches';
import { useAuthStore } from '../../store/useAuthStore';

const StoresPage = () => {
    const { t } = useTranslation();
    const [storesData, setStoresData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
    const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [newStore, setNewStore] = useState({
        brand: '',
        description: '',
        storeType: 'RETAIL',
        contact: { email: '', phone: '', address: '' },
        status: 'ACTIVE'
    });

    const [newBranch, setNewBranch] = useState({
        name: '',
        address: '',
        openTime: '08:00',
        closeTime: '22:00',
        status: 'ACTIVE'
    });

    const user = useAuthStore((state) => state.user);

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Fetch stores with current pagination
            const storeRes = await storeApi.getAll(page, size);
            const stores = storeRes.data?.content || [];

            setTotalElements(storeRes.data?.totalElements ?? storeRes.data?.page?.totalElements ?? 0);
            setTotalPages(storeRes.data?.totalPages ?? storeRes.data?.page?.totalPages ?? 0);

            // 2. Fetch branches for each store
            const storesWithBranches = await Promise.all(stores.map(async (store) => {
                try {
                    const branchRes = await branchApi.getByStoreId(store.id, 0, 50);
                    return {
                        ...store,
                        branches: branchRes.data?.content || []
                    };
                } catch (err) {
                    console.error(`Failed to fetch branches for store ${store.id}:`, err);
                    return { ...store, branches: [] };
                }
            }));

            setStoresData(storesWithBranches);
        } catch (err) {
            console.error('Failed to fetch stores & branches:', err);
            setError(t('stores.fetchError'));
        } finally {
            setIsLoading(false);
        }
    }, [page, size]);

    const handleCreateStore = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await storeApi.create(newStore);
            setSuccessMessage(t('stores.storeCreatedSuccess'));
            setIsAddStoreModalOpen(false);
            setNewStore({ brand: '', description: '', storeType: 'RETAIL', contact: { email: '', phone: '', address: '' }, status: 'ACTIVE' });
            fetchAllData();
            setTimeout(() => {
                setSuccessMessage('');
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error('Failed to create store:', err);
            setError(t('stores.storeCreateError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateBranch = async (e) => {
        e.preventDefault();
        if (!selectedStoreId) return;
        setIsLoading(true);
        try {
            await branchApi.create({ ...newBranch, storeId: selectedStoreId });
            setSuccessMessage(t('stores.branchCreatedSuccess'));
            setIsAddBranchModalOpen(false);
            setNewBranch({ name: '', address: '', openTime: '08:00', closeTime: '22:00', status: 'ACTIVE' });
            fetchAllData();
            setTimeout(() => {
                setSuccessMessage('');
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.error('Failed to create branch:', err);
            setError(t('stores.branchCreateError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData, page, size]);

    const getStatusInfo = (status) => {
        // Mapping numeric status to text if necessary, based on DB select output
        const isActive = status === 1 || status === '1' || status === 'ACTIVE';
        return {
            label: isActive ? t('common.active') : t('common.inactive'),
            className: isActive
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
        };
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                    <Building2 className="w-5 h-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="font-medium animate-pulse text-slate-600">{t('stores.syncingNetwork')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-12 bg-white border border-red-100 p-8 rounded-3xl shadow-sm text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('stores.systemsInterrupted')}</h3>
                <p className="text-slate-500 mb-6">{error}</p>
                <Button onClick={fetchAllData} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 rounded-xl">
                    {t('common.retryConnection')}
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        {t('stores.title')}
                        <span className="text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100/50 dark:border-indigo-800">
                            {totalElements} {t('stores.entities')}
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
                        {t('stores.description')}
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" onClick={fetchAllData} className="flex-1 md:flex-none border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-6 h-12 font-semibold transition-colors">
                        {t('common.refreshData')}
                    </Button>
                    <Button onClick={() => setIsAddStoreModalOpen(true)} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none rounded-xl px-6 h-12 font-bold transition-all active:scale-95">
                        <Plus className="w-5 h-5 mr-2 stroke-[3]" />
                        {t('common.newStore')}
                    </Button>
                </div>
            </div>

            {successMessage && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-400 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold">{t('stores.systemStatusOK')}</p>
                        <p className="text-sm opacity-90">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* Content section */}
            {storesData.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm transition-colors">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('stores.noDataFound')}</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-3 text-lg leading-relaxed">
                        {t('stores.noDataDescription')}
                    </p>
                    <Button onClick={() => setIsAddStoreModalOpen(true)} className="mt-8 bg-indigo-600 hover:bg-indigo-700 h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-100 animate-in zoom-in-50 duration-500">
                        {t('stores.createFirstStore')}
                    </Button>
                </div>
            ) : (
                <div className="grid gap-8">
                    {storesData.map((store) => {
                        const status = getStatusInfo(store.status);
                        return (
                            <div key={store.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md dark:shadow-none transition-all group flex flex-col xl:flex-row">
                                {/* Store Sidebar/Summary */}
                                <div className="p-8 xl:w-1/3 border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/40">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-500">
                                            <Store className="w-8 h-8" />
                                        </div>
                                        <span className={`px-4 py-1.5 text-xs font-black tracking-widest rounded-full border shadow-sm ${status.className} dark:bg-opacity-20`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{store.brand || t('stores.unnamedStore')}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1 leading-relaxed">{store.description || t('stores.globalRetailEntity')}</p>
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-colors">
                                                <Mail className="w-4 h-4 text-indigo-500" />
                                                <span className="font-medium truncate">{store.contact?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-colors">
                                                <Phone className="w-4 h-4 text-emerald-500" />
                                                <span className="font-medium">{store.contact?.phone || t('common.notAvailable')}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-colors">
                                                <MapPin className="w-4 h-4 text-red-500" />
                                                <span className="font-medium truncate">{store.contact?.address || t('stores.noHQAddress')}</span>
                                            </div>
                                        </div>

                                        <div className="pt-6 flex gap-3">
                                            <Button variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors">{t('common.settings')}</Button>
                                            <Button className="flex-1 h-12 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-white transition-colors">{t('common.analytics')}</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Branches List */}
                                <div className="flex-1 p-8 bg-white dark:bg-slate-900 transition-colors duration-300">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Active Branches ({store.branches.length})
                                        </h4>
                                        <button
                                            onClick={() => {
                                                setSelectedStoreId(store.id);
                                                setIsAddBranchModalOpen(true);
                                            }}
                                            className="text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:underline flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" />
                                            {t('stores.addBranch')}
                                        </button>
                                    </div>

                                    <div className="grid gap-4">
                                        {store.branches.length === 0 ? (
                                            <div className="py-12 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                                                <p className="text-slate-400 dark:text-slate-500 font-medium">{t('stores.noBranches')}</p>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedStoreId(store.id);
                                                        setIsAddBranchModalOpen(true);
                                                    }}
                                                    className="text-indigo-600 dark:text-indigo-400 text-sm font-bold mt-2 hover:underline"
                                                >
                                                    {t('stores.deployInitialBranch')}
                                                </button>
                                            </div>
                                        ) : (
                                            store.branches.map((branch) => (
                                                <div key={branch.id} className="group/branch relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-900 p-5 rounded-3xl transition-all hover:shadow-sm hover:translate-x-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover/branch:bg-indigo-50 dark:group-hover/branch:bg-indigo-900/30 group-hover/branch:text-indigo-600 dark:group-hover/branch:text-indigo-400 transition-colors">
                                                                <MapPin className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-slate-900 dark:text-white">{branch.name}</h5>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {branch.address}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center flex-wrap gap-4 sm:gap-8 pr-12">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mb-1">{t('common.hours')}</span>
                                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                                    <Clock className="w-3 h-3 text-amber-500" />
                                                                    {branch.openTime ? `${branch.openTime.slice(0, 5)} - ${branch.closeTime.slice(0, 5)}` : t('common.closed')}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mb-1">{t('common.status')}</span>
                                                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                    {t('common.operational')}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover/branch:text-indigo-400 transition-all">
                                                            <ChevronRight className="w-6 h-6" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination Controls */}
            {storesData.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4 order-2 sm:order-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 font-medium">{t('common.rowsPerPage')}</span>
                            <select
                                value={size}
                                onChange={(e) => {
                                    setSize(Number(e.target.value));
                                    setPage(0); // Reset to first page when size changes
                                }}
                                className="h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm px-2 font-bold outline-none focus:ring-2 focus:ring-indigo-500/10"
                            >
                                {[5, 10, 20, 50].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                        <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                            Showing <span className="text-slate-900 dark:text-white font-bold">{page * size + 1}</span> to <span className="text-slate-900 dark:text-white font-bold">{Math.min((page + 1) * size, totalElements)}</span> of <span className="text-slate-900 dark:text-white font-bold">{totalElements}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="h-10 w-10 p-0 rounded-xl border-slate-200 dark:border-slate-800"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>

                        <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            )).slice(Math.max(0, page - 1), Math.min(totalPages, page + 2))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(page + 1)}
                            className="h-10 w-10 p-0 rounded-xl border-slate-200 dark:border-slate-800"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Add Store Modal */}
            {isAddStoreModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('stores.establishNewStore')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{t('stores.registerEntity')}</p>
                        </div>
                        <form onSubmit={handleCreateStore} className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Brand Name</label>
                                    <input
                                        required
                                        placeholder="e.g. Skyline Retail"
                                        value={newStore.brand}
                                        onChange={(e) => setNewStore({ ...newStore, brand: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Store Type</label>
                                    <select
                                        value={newStore.storeType}
                                        onChange={(e) => setNewStore({ ...newStore, storeType: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
                                    >
                                        <option value="RETAIL">{t('stores.retail')}</option>
                                        <option value="RESTAURANT">{t('stores.restaurant')}</option>
                                        <option value="GROCERY">{t('stores.grocery')}</option>
                                        <option value="PHARMACY">{t('stores.pharmacy')}</option>
                                        <option value="ELECTRONICS">{t('stores.electronics')}</option>
                                        <option value="HOME_IMPROVEMENT">{t('stores.homeImprovement')}</option>
                                        <option value="CLOTHING">{t('stores.clothing')}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">HQ Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="hq@skyline.com"
                                        value={newStore.contact.email}
                                        onChange={(e) => setNewStore({ ...newStore, contact: { ...newStore.contact, email: e.target.value } })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Primary Phone</label>
                                    <input
                                        placeholder="+1 234 567 890"
                                        value={newStore.contact.phone}
                                        onChange={(e) => setNewStore({ ...newStore, contact: { ...newStore.contact, phone: e.target.value } })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">HQ Address</label>
                                    <input
                                        placeholder="123 Retail Ave, NY"
                                        value={newStore.contact.address}
                                        onChange={(e) => setNewStore({ ...newStore, contact: { ...newStore.contact, address: e.target.value } })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Brand Description</label>
                                    <textarea
                                        placeholder="Describe the store's focus..."
                                        value={newStore.description}
                                        onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-300 min-h-[80px]"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddStoreModalOpen(false)}
                                    className="flex-1 h-14 rounded-2xl border-slate-200 dark:border-slate-800 font-extrabold text-slate-600 dark:text-slate-400"
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-xl shadow-indigo-100 dark:shadow-none"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Building2 className="w-5 h-5 mr-2" />}
                                    {t('stores.deployStore')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Branch Modal */}
            {isAddBranchModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('stores.deployBranch')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{t('stores.addBranchDescription')}</p>
                        </div>
                        <form onSubmit={handleCreateBranch} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Branch Name</label>
                                    <input
                                        required
                                        placeholder="e.g. Downtown Nexus"
                                        value={newBranch.name}
                                        onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Physical Address</label>
                                    <input
                                        required
                                        placeholder="456 Commerce St, Central"
                                        value={newBranch.address}
                                        onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Open Time</label>
                                        <input
                                            type="time"
                                            value={newBranch.openTime}
                                            onChange={(e) => setNewBranch({ ...newBranch, openTime: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Close Time</label>
                                        <input
                                            type="time"
                                            value={newBranch.closeTime}
                                            onChange={(e) => setNewBranch({ ...newBranch, closeTime: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddBranchModalOpen(false)}
                                    className="flex-1 h-14 rounded-2xl border-slate-200 dark:border-slate-800 font-extrabold text-slate-600 dark:text-slate-400"
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-xl shadow-indigo-100 dark:shadow-none"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <MapPin className="w-5 h-5 mr-2" />}
                                    {t('stores.deployBranch')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoresPage;

