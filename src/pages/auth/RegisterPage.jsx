import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Store, UserPlus, Mail, Lock, Building2, AlertCircle, ChevronDown } from 'lucide-react';
import { authApi } from '../../lib/api/auth';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'ROLE_CUSTOMER',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation();
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Backend expects UserDto
            const userDto = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            const response = await authApi.register(userDto);

            if (response.data && response.data.jwt) {
                // Log user in automatically with the returned token
                const user = response.data.user || {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    role: formData.role
                };
                login(user, response.data.jwt);
                
                // Navigate based on role
                if (user.role === 'ROLE_CUSTOMER') {
                    navigate('/shop');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error('Registration failed:', err);
            setError(err.response?.data?.message || 'Failed to register account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-md mx-auto space-y-6">

            <div className="text-center space-y-2 mb-8 items-center flex flex-col">
                <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-2">
                    <Store className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t('auth.createAccount')}</h2>
                <p className="text-slate-500">{t('auth.startTrial')}</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 block" htmlFor="firstName">{t('auth.firstName')}</label>
                        <input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900"
                            placeholder="John"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 block" htmlFor="lastName">{t('auth.lastName')}</label>
                        <input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900"
                            placeholder="Doe"
                        />
                    </div>
                </div>

                {formData.role !== 'ROLE_CUSTOMER' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 block" htmlFor="role">{t('auth.role')}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserPlus className="h-5 w-5 text-slate-400" />
                                </div>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 appearance-none bg-white cursor-pointer"
                                >
                                    <option value="ROLE_STORE_ADMIN">{t('auth.roles.storeAdmin') || 'Store Admin'}</option>
                                    <option value="ROLE_STORE_MANAGER">{t('auth.roles.storeManager') || 'Store Manager'}</option>
                                    <option value="ROLE_BRANCH_MANAGER">{t('auth.roles.branchManager') || 'Branch Manager'}</option>
                                    <option value="ROLE_BRANCH_CASHIER">{t('auth.roles.branchCashier') || 'Branch Cashier'}</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 block" htmlFor="storeName">{t('auth.businessName')}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="storeName"
                                    type="text"
                                    value={formData.storeName || ''}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900"
                                    placeholder="Acme Retail"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="flex items-center justify-between py-2">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            role: prev.role === 'ROLE_CUSTOMER' ? 'ROLE_STORE_ADMIN' : 'ROLE_CUSTOMER' 
                        }))}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        {formData.role === 'ROLE_CUSTOMER' ? 'Registering for a business?' : 'Registering as a customer?'}
                    </button>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 block" htmlFor="email">{t('auth.workEmail')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900"
                            placeholder="admin@acme.com"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 block" htmlFor="password">{t('auth.password')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="space-y-1 mb-2">
                    <label className="text-sm font-medium text-slate-700 block" htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || (formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0)}
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            {t('auth.registerAccount')} <UserPlus className="w-4 h-4 ml-1" />
                        </>
                    )}
                </Button>
            </form>

            <div className="pt-4 text-center border-t border-slate-100">
                <p className="text-sm text-slate-600">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        {t('auth.signIn')}
                    </Link>
                </p>
            </div>

        </div>
    );
};

export default RegisterPage;
