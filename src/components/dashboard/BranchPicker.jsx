import React, { useEffect, useState } from 'react';
import { MapPin, ChevronDown, Check, Loader2, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { branchApi } from '../../lib/api/branches';
import { Button } from '../ui/button';

const BranchPicker = () => {
    const { user, updateUser } = useAuthStore();
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const storeId = user?.storeId;
    const currentBranchId = user?.branchId;

    useEffect(() => {
        const fetchBranches = async () => {
            if (!storeId) return;
            setIsLoading(true);
            try {
                // Fetch up to 50 branches for switcher
                const res = await branchApi.getByStoreId(storeId, 0, 50);
                const branchList = res.data?.content || [];
                setBranches(branchList);

                // Auto-select first branch if none selected and branches exist
                if (!currentBranchId && branchList.length > 0) {
                    updateUser({ branchId: branchList[0].id });
                }
            } catch (err) {
                console.error('Failed to fetch branches for picker:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
    }, [storeId, currentBranchId, updateUser]);

    const handleBranchSelect = (branch) => {
        updateUser({ branchId: branch.id });
        setIsOpen(false);
        // Optional: Trigger a page reload or data refresh across the dashboard
        // window.location.reload(); 
    };

    const currentBranch = branches.find(b => b.id === currentBranchId);

    if (user?.role === 'ROLE_SUPER_ADMIN') return null; // Super admins might not need a specific branch context generally
    if (!storeId) return null;

    return (
        <div className="relative">
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 h-10 px-3 rounded-xl border transition-all ${
                    isOpen 
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <MapPin className={`w-4 h-4 ${currentBranchId ? 'text-indigo-500' : 'text-slate-400'}`} />
                )}
                
                <div className="text-left hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none opacity-50">Active Branch</p>
                    <p className="text-sm font-bold truncate max-w-[120px]">
                        {currentBranch?.name || 'Select Branch'}
                    </p>
                </div>

                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)} 
                    />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-2">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Locations</p>
                        </div>
                        
                        <div className="max-h-64 overflow-y-auto px-2 space-y-1">
                            {branches.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <Building2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">No branches found</p>
                                </div>
                            ) : (
                                branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        onClick={() => handleBranchSelect(branch)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                                            currentBranchId === branch.id
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                currentBranchId === branch.id ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-slate-100 dark:bg-slate-800'
                                            }`}>
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div className="text-left overflow-hidden">
                                                <p className="text-sm font-bold truncate">{branch.name}</p>
                                                <p className="text-[10px] opacity-60 truncate">{branch.address || 'No address'}</p>
                                            </div>
                                        </div>
                                        {currentBranchId === branch.id && (
                                            <Check className="w-4 h-4 shrink-0" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BranchPicker;
