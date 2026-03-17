import React, { useEffect, useState, useCallback } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Shield,
    Building2,
    MapPin,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Edit3,
    Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../lib/api/client';
import { userApi } from '../../lib/api/users';
import { storeApi } from '../../lib/api/stores';

const StaffPage = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'ROLE_STORE_MANAGER',
        phone: '',
        storeId: ''
    });

    const currentUser = useAuthStore((state) => state.user);
    const userRole = currentUser?.role;
    const isSuperAdmin = userRole === 'ROLE_SUPER_ADMIN';

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Fetch Users
            let usersRes;
            if (isSuperAdmin) {
                usersRes = await userApi.getAll();
            } else if (currentUser?.storeId) {
                usersRes = await userApi.getByStoreId(currentUser.storeId);
            } else {
                setUsers([]);
                setIsLoading(false);
                return;
            }
            setUsers(usersRes.data || []);

            // 2. Fetch Stores (for Super Admin linking)
            if (isSuperAdmin) {
                const storesRes = await storeApi.getAll(0, 100);
                setStores(storesRes.data?.content || storesRes.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch staff data:', err);
            setError('Could not load staff or store data.');
        } finally {
            setIsLoading(false);
        }
    }, [isSuperAdmin, currentUser?.storeId]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleOpenAddModal = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 'ROLE_STORE_MANAGER',
            phone: '',
            storeId: isSuperAdmin ? '' : (currentUser?.storeId || '')
        });
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            storeId: user.storeId || ''
        });
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteConfirm = (user) => {
        setSelectedUser(user);
        setIsDeleteConfirmOpen(true);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await apiClient.post('/auth/signup', formData);
            setSuccessMessage('Staff member added successfully!');
            setIsAddModalOpen(false);
            fetchAllData();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Failed to create user:', err);
            setError('Failed to add staff member.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await userApi.update(selectedUser.id, formData);
            setSuccessMessage('Staff member updated successfully!');
            setIsEditModalOpen(false);
            fetchAllData();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Failed to update user:', err);
            setError('Failed to update staff member.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setIsLoading(true);
        try {
            await userApi.delete(selectedUser.id);
            setSuccessMessage('Staff member deleted successfully!');
            setIsDeleteConfirmOpen(false);
            fetchAllData();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete staff member.');
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        const roles = {
            'ROLE_SUPER_ADMIN': { label: 'Super Admin', color: 'bg-red-100 text-red-700 border-red-200' },
            'ROLE_STORE_ADMIN': { label: 'Store Admin', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
            'ROLE_STORE_MANAGER': { label: 'Store Manager', color: 'bg-purple-100 text-purple-700 border-purple-200' },
            'ROLE_BRANCH_MANAGER': { label: 'Branch Manager', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            'ROLE_BRANCH_CASHIER': { label: 'Cashier', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
            'ROLE_CUSTOMER': { label: 'Customer', color: 'bg-slate-100 text-slate-700 border-slate-200' }
        };
        const config = roles[role] || { label: role, color: 'bg-slate-100 text-slate-600' };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.color}`}>{config.label}</span>;
    };

    const filteredUsers = users.filter(u => 
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        Staff Management
                        <span className="text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
                            {users.length} {isSuperAdmin ? 'Total Users' : 'Employees'}
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {isSuperAdmin ? 'Manage all system accounts and store associations.' : 'Manage your store network workforce and permissions.'}
                    </p>
                </div>
                <Button 
                    onClick={handleOpenAddModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 dark:shadow-none rounded-xl px-6 h-12 font-bold transition-all active:scale-95"
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    {isSuperAdmin ? 'Create New User' : 'Add Staff Member'}
                </Button>
            </div>

            {successMessage && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-medium text-sm">{successMessage}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-800 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium text-sm">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input 
                            placeholder="Search by name, email..."
                            className="pl-12 bg-slate-50 dark:bg-slate-800 border-none h-12 rounded-xl text-slate-900 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none border-slate-200 h-12 rounded-xl text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900">
                            <Filter className="w-4 h-4 mr-2" />
                            Role
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-8 py-5">Full Name</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Assigned Store</th>
                                <th className="px-8 py-5">Contact Details</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6"><div className="h-10 bg-slate-50 dark:bg-slate-800 rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <Users className="w-12 h-12 opacity-10" />
                                            <p className="font-bold">No accounts found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-800">
                                                    {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{u.firstName} {u.lastName}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {u.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {getRoleBadge(u.role)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-medium">
                                                    {u.storeName || (u.storeId ? `Store #${u.storeId.slice(0, 6)}` : 'N/A')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 truncate max-w-[150px]"><Mail className="w-3 h-3 text-indigo-500 shrink-0" /> {u.email}</p>
                                                <p className="text-xs font-medium text-slate-500 flex items-center gap-2"><Phone className="w-3 h-3 text-emerald-500 shrink-0" /> {u.phone || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleOpenEditModal(u)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenDeleteConfirm(u)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {isEditModalOpen ? 'Edit Account' : 'Onboard New Staff'}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Assign roles and credentials to your team.</p>
                        </div>
                        <form onSubmit={isEditModalOpen ? handleUpdateUser : handleCreateUser} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                    <Input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="rounded-xl border-slate-200 h-11" placeholder="Jane" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <Input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="rounded-xl border-slate-200 h-11" placeholder="Doe" />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                    <Input type="email" required disabled={isEditModalOpen} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="rounded-xl border-slate-200 h-11" placeholder="jane@business.com" />
                                </div>
                                <div className={`space-y-1.5 ${isSuperAdmin ? 'col-span-1' : 'col-span-2'}`}>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                                    <select 
                                        className="w-full rounded-xl border-slate-200 bg-white dark:bg-slate-900 h-11 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600/20 text-slate-900 dark:text-white"
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    >
                                        {isSuperAdmin && <option value="ROLE_SUPER_ADMIN">Super Admin</option>}
                                        <option value="ROLE_STORE_ADMIN">Store Admin</option>
                                        <option value="ROLE_STORE_MANAGER">Store Manager</option>
                                        <option value="ROLE_BRANCH_MANAGER">Branch Manager</option>
                                        <option value="ROLE_BRANCH_CASHIER">Cashier</option>
                                    </select>
                                </div>
                                {isSuperAdmin && (
                                    <div className="space-y-1.5 col-span-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link to Store (Optional)</label>
                                        <select 
                                            className="w-full rounded-xl border-slate-200 bg-white dark:bg-slate-900 h-11 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600/20 text-slate-900 dark:text-white"
                                            value={formData.storeId}
                                            onChange={(e) => setFormData({...formData, storeId: e.target.value})}
                                        >
                                            <option value="">No Store (Global Admin)</option>
                                            {stores.map(s => (
                                                <option key={s.id} value={s.id}>{s.brand || s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {!isEditModalOpen && (
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Temporary Password</label>
                                        <Input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="rounded-xl border-slate-200 h-11" placeholder="••••••••" />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 h-12 rounded-xl font-bold border-slate-200">Cancel</Button>
                                <Button type="submit" disabled={isLoading} className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (isEditModalOpen ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />)}
                                    {isEditModalOpen ? 'Update Account' : 'Onboard Staff'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-6 border border-red-200 dark:border-red-800">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Account?</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">{selectedUser?.firstName} {selectedUser?.lastName}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteUser}
                                disabled={isLoading}
                                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-200 dark:shadow-none"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffPage;
