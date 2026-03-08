import React, { useEffect, useState, useCallback } from 'react';
import {
    Package,
    Search,
    Plus,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { productApi } from '../../lib/api/products';
import { categoryApi } from '../../lib/api/categories';
import { useAuthStore } from '../../store/useAuthStore';

const ProductsPage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        sellingPrice: '',
        mrp: '',
        costPrice: '',
        sku: '',
        brand: '',
        categoryId: '',
        image: ''
    });

    const user = useAuthStore((state) => state.user);
    const storeId = user?.storeId;

    const fetchCategories = useCallback(async () => {
        if (!storeId) return;
        try {
            const res = await categoryApi.getByStoreId(storeId, 0, 100);
            setCategories(res.data?.content || []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    }, [storeId]);

    const fetchProducts = useCallback(async () => {
        if (!storeId) {
            setError('No store associated. Please assign a store to your profile.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            let response;
            if (searchTerm) {
                response = await productApi.search(storeId, searchTerm, page, 10);
            } else {
                response = await productApi.getByStoreId(storeId, page, 10);
            }

            if (response.data) {
                setProducts(response.data.content || []);
                setTotalPages(response.data.totalPages ?? response.data.page?.totalPages ?? 0);
                setTotalElements(response.data.totalElements ?? response.data.page?.totalElements ?? 0);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError('Unable to load products. Make sure the backend is running.');
        } finally {
            setIsLoading(false);
        }
    }, [storeId, page, searchTerm]);

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.categoryId) {
            setError('Please select a category.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await productApi.create({
                ...newProduct,
                storeId,
                sellingPrice: parseFloat(newProduct.sellingPrice),
                mrp: parseFloat(newProduct.mrp || newProduct.sellingPrice)
            });
            setSuccessMessage('Product added successfully!');
            setIsAddModalOpen(false);
            setNewProduct({ name: '', description: '', sellingPrice: '', mrp: '', sku: '', brand: '', categoryId: '', image: '' });
            fetchProducts();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Failed to create product:', err);
            setError('Failed to create product. Please check your input.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAddModalOpen) fetchCategories();
    }, [isAddModalOpen, fetchCategories]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, searchTerm ? 500 : 0); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [fetchProducts]);

    if (isLoading && products.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <p className="font-medium">Loading your catalog...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t('common.productsCatalog')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('common.managePricingDetails')}.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('common.addProduct')}
                </Button>
            </div>

            {successMessage && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800 animate-in fade-in slide-in-from-top-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <Plus className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium">{successMessage}</p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                        placeholder={t('common.filterByNameOrSku') + "..."}
                        className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-slate-200"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                        }}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter className="w-4 h-4 mr-2" />
                        {t('common.category')}
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        {t('common.status')}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-3 text-amber-800">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative transition-colors">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10 transition-colors">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Product Information</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                        No products found in this store.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(product.name) + '&background=6366f1&color=fff';
                                                            }}
                                                        />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{product.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">${product.sellingPrice?.toFixed(2) || '0.00'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                                                {t('common.active')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-slate-400">
                                                <button className="p-1 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                                                <button className="p-1 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    <span>
                        {t('common.showingEntries', { count: products.length, total: totalElements })}
                    </span>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-200"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-200"
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('common.createNewProduct')}</h2>
                            <p className="text-sm text-slate-500 mt-1">{t('common.fillDetailsAddProduct')}.</p>
                        </div>
                        <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t('common.productName')}</label>
                                    <Input
                                        required
                                        placeholder="e.g. Men's Slim Fit Denim Jeans"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="rounded-xl border-slate-200 dark:border-slate-800 h-11"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t('common.category')}</label>
                                    <select
                                        required
                                        value={newProduct.categoryId}
                                        onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-11 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600/20"
                                    >
                                        <option value="">{t('common.selectCategory')}</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t('common.brand')}</label>
                                    <Input
                                        placeholder="e.g. O & R"
                                        value={newProduct.brand}
                                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                        className="rounded-xl border-slate-200 dark:border-slate-800 h-11"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t('common.sellingPrice')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            required
                                            placeholder="0.00"
                                            value={newProduct.sellingPrice}
                                            onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
                                            className="rounded-xl border-slate-200 dark:border-slate-800 h-11 pl-7"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t('common.mrp')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={newProduct.mrp}
                                            onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                                            className="rounded-xl border-slate-200 dark:border-slate-800 h-11 pl-7"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t('common.skuCode')}</label>
                                    <Input
                                        placeholder="SKU-2026-X"
                                        value={newProduct.sku}
                                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                                        className="rounded-xl border-slate-200 dark:border-slate-800 h-11"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t('common.imageUrl')}</label>
                                    <Input
                                        placeholder="https://images.unsplash.com/..."
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                        className="rounded-xl border-slate-200 dark:border-slate-800 h-11"
                                    />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t('common.description')}</label>
                                    <textarea
                                        placeholder="Briefly describe the product..."
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 min-h-[80px]"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 rounded-xl h-12 font-bold border-slate-200 dark:border-slate-800"
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 rounded-xl h-12 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                    {t('common.createProduct')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;

